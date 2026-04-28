package com.bovinoai.service;

import com.bovinoai.dto.CostosResponseDTO;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.model.InsumoEntorno;
import com.bovinoai.repository.HistorialBiometricoRepository;
import com.bovinoai.repository.InsumoEntornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Comparator;

@Service
public class CostosService {

    @Autowired
    private InsumoEntornoRepository insumoRepository;

    @Autowired
    private HistorialBiometricoRepository historialRepository;

    @Transactional(readOnly = true)
    public CostosResponseDTO calcularCostos(Long idAnimal) {
        List<InsumoEntorno> insumos = insumoRepository.findByAnimalIdOrderByFechaDesc(idAnimal);
        List<HistorialBiometrico> pesajes = historialRepository.findByAnimalIdOrderByFechaPesajeAsc(idAnimal);

        // 1. Costo Acumulado - Manejo seguro de nulls
        BigDecimal costoAcumulado = insumos.stream()
                .map(InsumoEntorno::getCostoDiaCop)
                .filter(costo -> costo != null)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 2. Conversión Alimenticia
        double conversion = 0.0;
        double pesoActual = 0.0;
        
        if (pesajes != null && pesajes.size() >= 2) {
            HistorialBiometrico ultimoPesaje = pesajes.get(pesajes.size() - 1);
            HistorialBiometrico primerPesaje = pesajes.get(0);
            
            if (ultimoPesaje.getPesoKg() != null && primerPesaje.getPesoKg() != null) {
                pesoActual = ultimoPesaje.getPesoKg().doubleValue();
                double pesoInicial = primerPesaje.getPesoKg().doubleValue();
                double gananciaPeso = pesoActual - pesoInicial;

                double totalConcentrado = insumos.stream()
                        .mapToDouble(i -> i.getConcentradoKg() != null ? i.getConcentradoKg() : 0.0)
                        .sum();

                if (totalConcentrado > 0 && gananciaPeso > 0) {
                    conversion = totalConcentrado / gananciaPeso;
                }
            }
        } else if (pesajes != null && !pesajes.isEmpty()) {
             // Caso con 1 solo pesaje
             pesoActual = pesajes.get(0).getPesoKg() != null ? pesajes.get(0).getPesoKg().doubleValue() : 0.0;
        }

        // 3. Margen de Ganancia
        BigDecimal margen = BigDecimal.ZERO;
        if (pesoActual > 0) {
            BigDecimal precioMercado = new BigDecimal("15000"); // Debería ser dinámico
            BigDecimal valorAnimal = precioMercado.multiply(BigDecimal.valueOf(pesoActual));
            margen = valorAnimal.subtract(costoAcumulado);
        }

        // 4. Punto de Equilibrio
        Double puntoEquilibrio = 0.0;
        if (pesoActual > 0) {
            BigDecimal precioMercado = new BigDecimal("15000");
            puntoEquilibrio = costoAcumulado.divide(precioMercado, 2, RoundingMode.HALF_UP).doubleValue();
        }

        // ... resto del método igual

        // 5. Días en Etapa
        Integer diasEnEtapa = 0;
        if (insumos.size() >= 2) {
            LocalDate fechaInicio = insumos.get(insumos.size() - 1).getFecha();
            LocalDate fechaFin = insumos.get(0).getFecha();
            diasEnEtapa = (int) ChronoUnit.DAYS.between(fechaInicio, fechaFin);
        } else if (insumos.size() == 1) {
            diasEnEtapa = 1;
        }

        // 6. Alertas
        List<CostosResponseDTO.AlertaDTO> alertas = new ArrayList<>();
        if (conversion > 7.0) {
            alertas.add(new CostosResponseDTO.AlertaDTO("Eficiencia", "La conversión alimenticia es alta, revisa la dieta."));
        }
        if (pesoActual > 0 && puntoEquilibrio > pesoActual) {
            alertas.add(new CostosResponseDTO.AlertaDTO("Rentabilidad", "El animal aún no alcanza el punto de equilibrio."));
        }
        if (margen.compareTo(BigDecimal.ZERO) < 0) {
            alertas.add(new CostosResponseDTO.AlertaDTO("Urgente", "Margen de ganancia negativo."));
        }

        return new CostosResponseDTO(
                costoAcumulado.setScale(2, RoundingMode.HALF_UP),
                conversion != 0 ? Math.round(conversion * 100.0) / 100.0 : 0.0,
                margen.setScale(2, RoundingMode.HALF_UP),
                pesoActual,
                puntoEquilibrio,
                diasEnEtapa,
                alertas
        );
    }
}
