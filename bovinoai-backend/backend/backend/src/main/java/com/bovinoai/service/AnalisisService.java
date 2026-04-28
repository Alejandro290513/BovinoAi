package com.bovinoai.service;

import com.bovinoai.dto.AnalisisResponseDTO;
import com.bovinoai.model.Animal;
import com.bovinoai.model.InsumoEntorno;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.logic.PromptBuilder;
import com.bovinoai.repository.AnimalRepository;
import com.bovinoai.repository.InsumoEntornoRepository;
import com.bovinoai.repository.HistorialBiometricoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalisisService {

    private final AnimalRepository animalRepository;
    private final HistorialBiometricoRepository pesajeRepository;
    private final InsumoEntornoRepository costoRepository;

    @Value("${ai.claude.api.key}")
    private String apiKey;

    public AnalisisResponseDTO analizarAnimal(Long idAnimal, Double precioMercado) {
        Animal animal = animalRepository.findById(idAnimal)
                .orElseThrow(() -> new RuntimeException("Animal no encontrado"));

        List<HistorialBiometrico> pesajes = pesajeRepository.findByAnimalIdOrderByFechaPesajeAsc(idAnimal);
        List<InsumoEntorno> costos = costoRepository.findByAnimalIdOrderByFechaDesc(idAnimal);

        String prompt = PromptBuilder.buildAnimalAnalysisPrompt(animal, pesajes, costos, precioMercado);
        
        log.info("Prompt generado para animal {}:\\n{}", idAnimal, prompt);

        // Simulamos llamada a la IA ya que no tenemos API Key configurada
        return simulateAIResponse(animal, pesajes, precioMercado);
    }

    private AnalisisResponseDTO simulateAIResponse(Animal animal, List<HistorialBiometrico> pesajes, Double precioMercado) {
        // Lógica simple para simular una respuesta basada en datos reales
        double gdp = 0;
        if (pesajes.size() >= 2) {
            HistorialBiometrico first = pesajes.get(0);
            HistorialBiometrico last = pesajes.get(pesajes.size() - 1);
            long dias = java.time.temporal.ChronoUnit.DAYS.between(first.getFechaPesaje(), last.getFechaPesaje());
            if (dias > 0) {
                gdp = (last.getPesoKg().doubleValue() - first.getPesoKg().doubleValue()) / dias;
            }
        }

        String score = gdp > 1.0 ? "A" : (gdp > 0.7 ? "B" : (gdp > 0.5 ? "C" : "D"));
        
        return AnalisisResponseDTO.builder()
                .diagnostico("El animal presenta un GDP de " + String.format("%.3f", gdp) + " kg/día.")
                .recomendaciones(score.equals("A") ? "Mantener dieta actual." : "Revisar suplementación proteica.")
                .proyeccionPeso("Estimado: " + String.format("%.2f", (pesajes.isEmpty() ? 0 : pesajes.get(pesajes.size()-1).getPesoKg().doubleValue()) + (gdp * 30)) + " kg en 30 días.")
                .analisisFinanciero("Rentabilidad proyectada positiva basada en precio de $" + precioMercado + "/kg.")
                .scoreRendimiento(score)
                .build();
    }
}
