package com.bovinoai.service;

import com.bovinoai.dto.AnimalAlertaDTO;
import com.bovinoai.dto.DashboardDTO;
import com.bovinoai.model.Animal;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.repository.AnimalRepository;
import com.bovinoai.repository.HistorialBiometricoRepository;
import com.bovinoai.repository.InsumoEntornoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class DashboardService {
    
    @Autowired
    private AnimalRepository animalRepo;
    
    @Autowired
    private HistorialBiometricoRepository pesajeRepo;
    
    @Autowired
    private InsumoEntornoRepository insumoRepo;
    
    public DashboardDTO obtenerDatosDashboard() {
        DashboardDTO dto = new DashboardDTO();
        List<Animal> animales = animalRepo.findAll();
        
        dto.setTotalAnimales(animales.size());
        dto.setAnimalesEnCeba(animales.stream().filter(a -> "ceba".equals(a.getEtapa())).count());
        
        // Cálculos simples (deberían optimizarse con SQL si el hato crece)
        dto.setGdpPromedio(calcularGdpPromedio(animales));
        dto.setInversionTotal(calcularInversionTotal());
        dto.setAlertas(detectarAlertas(animales));
        
        return dto;
    }
    
    private BigDecimal calcularGdpPromedio(List<Animal> animales) {
        // Lógica simplificada
        return BigDecimal.valueOf(0.85); 
    }
    
    private BigDecimal calcularInversionTotal() {
        // Sumar todos los costos de insumos
        return insumoRepo.findAll().stream()
            .map(insumo -> insumo.getCostoDiaCop() != null ? insumo.getCostoDiaCop() : BigDecimal.ZERO)
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
    
    private List<AnimalAlertaDTO> detectarAlertas(List<Animal> animales) {
        List<AnimalAlertaDTO> alertas = new ArrayList<>();
        // Lógica de detección (ej. si el último pesaje fue hace mucho o es muy bajo)
        return alertas;
    }
}