/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.service;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.Animal;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.dto.PesajeRequestDTO;
import com.bovinoai.dto.PesajeResponseDTO;
import com.bovinoai.repository.AnimalRepository;
import com.bovinoai.repository.HistorialBiometricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PesajeService {

    @Autowired
    private HistorialBiometricoRepository historialRepository;

    @Autowired
    private AnimalRepository animalRepository;

    /**
     * Obtener historial de pesajes de un animal
     */
    @Transactional(readOnly = true)
    public List<PesajeResponseDTO> obtenerHistorial(Long idAnimal) {
        List<HistorialBiometrico> pesajes = historialRepository.findByAnimalIdOrderByFechaPesajeDesc(idAnimal);
        
        return pesajes.stream()
                .sorted(Comparator.comparing(HistorialBiometrico::getFechaPesaje))
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Registrar nuevo pesaje y calcular GDP automáticamente
     */
    @Transactional
    public PesajeResponseDTO registrarPesaje(Long idAnimal, PesajeRequestDTO requestDTO) {
        // Validar que el animal exista
        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal no encontrado"));

        // Buscar el pesaje anterior más reciente
        List<HistorialBiometrico> pesajesPrevios = historialRepository.findByAnimalIdOrderByFechaPesajeDesc(idAnimal);
        
        HistorialBiometrico historicoNuevo = new HistorialBiometrico();
        historicoNuevo.setAnimal(animal);
        historicoNuevo.setFechaPesaje(requestDTO.getFechaPesaje());
        historicoNuevo.setPesoKg(requestDTO.getPesoKg());
        historicoNuevo.setCondicionCorporal(requestDTO.getCondicionCorporal());

        // Calcular GDP si hay pesaje anterior
        if (!pesajesPrevios.isEmpty()) {
            // Obtener el pesaje más reciente anterior a la fecha actual
            Optional<HistorialBiometrico> pesajeAnterior = pesajesPrevios.stream()
                    .filter(p -> p.getFechaPesaje().isBefore(requestDTO.getFechaPesaje()))
                    .max(Comparator.comparing(HistorialBiometrico::getFechaPesaje));

            if (pesajeAnterior.isPresent()) {
                HistorialBiometrico anterior = pesajeAnterior.get();
                
                // Calcular días transcurridos
                long diasTranscurridos = ChronoUnit.DAYS.between(
                        anterior.getFechaPesaje(),
                        requestDTO.getFechaPesaje()
                );

                if (diasTranscurridos > 0) {
                    // GDP = (peso_nuevo - peso_anterior) / días
                    BigDecimal diferenciaPeso = requestDTO.getPesoKg()
                            .subtract(anterior.getPesoKg());
                    
                    BigDecimal gdp = diferenciaPeso.divide(
                            BigDecimal.valueOf(diasTranscurridos),
                            3,
                            RoundingMode.HALF_UP
                    );

                    historicoNuevo.setGdpCalculado(gdp);
                    historicoNuevo.setDiasDesdeAnterior((int) diasTranscurridos);
                } else {
                    // Mismo día, no se puede calcular GDP
                    historicoNuevo.setGdpCalculado(null);
                    historicoNuevo.setDiasDesdeAnterior(0);
                }
            } else {
                // No hay pesaje anterior válido
                historicoNuevo.setGdpCalculado(null);
                historicoNuevo.setDiasDesdeAnterior(0);
            }
        } else {
            // Primer pesaje del animal
            historicoNuevo.setGdpCalculado(null);
            historicoNuevo.setDiasDesdeAnterior(0);
        }

        HistorialBiometrico guardado = historialRepository.save(historicoNuevo);
        return convertToDTO(guardado);
    }

    /**
     * Convertir entidad HistorialBiometrico a DTO
     */
    private PesajeResponseDTO convertToDTO(HistorialBiometrico historial) {
        PesajeResponseDTO dto = new PesajeResponseDTO();
        dto.setId(historial.getId());
        dto.setIdAnimal(historial.getAnimal().getId());
        dto.setFechaPesaje(historial.getFechaPesaje());
        dto.setPesoKg(historial.getPesoKg());
        dto.setCondicionCorporal(historial.getCondicionCorporal());
        dto.setGdpCalculado(historial.getGdpCalculado());
        dto.setDiasDesdeAnterior(historial.getDiasDesdeAnterior());
        return dto;
    }
}
