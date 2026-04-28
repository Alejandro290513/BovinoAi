package com.bovinoai.logic;

import com.bovinoai.model.*;
import com.bovinoai.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Component
public class CalculadorCostos {
    
    @Autowired
    private InsumoEntornoRepository insumoRepo;
    
    @Autowired
    private HistorialBiometricoRepository pesajeRepo;
    
    public BigDecimal calcularCostoAcumulado(Long idAnimal) {
        List<InsumoEntorno> insumos = insumoRepo.findByAnimalIdOrderByFechaAsc(idAnimal);
        
        return insumos.stream()
            .map(InsumoEntorno::getCostoDiaCop)
            .filter(costo -> costo != null)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    public BigDecimal calcularConversionAlimenticia(Long idAnimal) {
        BigDecimal totalConcentrado = insumoRepo.findByAnimalIdOrderByFechaAsc(idAnimal)
            .stream()
            .map(InsumoEntorno::getConcentradoKg)
            .filter(c -> c != null)
            // Convertir Double a BigDecimal correctamente
            .map(c -> BigDecimal.valueOf(c))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        List<HistorialBiometrico> pesajes = pesajeRepo
            .findByAnimalIdOrderByFechaPesajeAsc(idAnimal);
        
        if (pesajes.size() < 2) {
            return BigDecimal.ZERO;
        }
        
        // pesoKg es BigDecimal, no necesita valueOf
        BigDecimal pesoInicial = pesajes.get(0).getPesoKg();
        BigDecimal pesoActual = pesajes.get(pesajes.size() - 1).getPesoKg();
        BigDecimal gananciaTotal = pesoActual.subtract(pesoInicial);
        
        if (gananciaTotal.compareTo(BigDecimal.ZERO) <= 0) {
            return BigDecimal.ZERO;
        }
        
        return totalConcentrado.divide(gananciaTotal, 2, RoundingMode.HALF_UP);
    }
    
    public BigDecimal calcularMargenBruto(Long idAnimal, BigDecimal precioMercadoKg) {
        List<HistorialBiometrico> pesajes = pesajeRepo
            .findByAnimalIdOrderByFechaPesajeAsc(idAnimal);
        
        if (pesajes.isEmpty()) {
            return BigDecimal.ZERO;
        }
        
        BigDecimal pesoActual = pesajes.get(pesajes.size() - 1).getPesoKg();
        BigDecimal valorMercado = pesoActual.multiply(precioMercadoKg);
        BigDecimal costoAcumulado = calcularCostoAcumulado(idAnimal);
        
        return valorMercado.subtract(costoAcumulado);
    }
    
    public BigDecimal calcularPuntoEquilibrio(Long idAnimal, BigDecimal precioMercadoKg) {
        BigDecimal costoTotal = calcularCostoAcumulado(idAnimal);
        
        if (precioMercadoKg.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        
        return costoTotal.divide(precioMercadoKg, 2, RoundingMode.HALF_UP);
    }
}