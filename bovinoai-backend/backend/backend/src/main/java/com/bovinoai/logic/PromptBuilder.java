package com.bovinoai.logic;

import com.bovinoai.model.Animal;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.model.InsumoEntorno;
import java.util.List;
import java.util.stream.Collectors;

public class PromptBuilder {

    public static String buildAnimalAnalysisPrompt(Animal animal, List<HistorialBiometrico> pesajes, List<InsumoEntorno> costos, Double precioMercado) {
        StringBuilder prompt = new StringBuilder();
        
        prompt.append("Eres un experto en zootecnia y gestión financiera de ganado bovino. ");
        prompt.append("Tu objetivo es analizar el rendimiento de un animal específico y proporcionar recomendaciones accionables.\n\n");

        prompt.append("### INFORMACIÓN DEL ANIMAL\n");
        prompt.append("- Identificación: ").append(animal.getChapeta()).append("\n");
        prompt.append("- Raza: ").append(animal.getRaza() != null ? animal.getRaza().getNombre() : "No especificada").append("\n");
        prompt.append("- Fecha de Ingreso: ").append(animal.getFechaIngreso()).append("\n");
        prompt.append("- Peso Inicial: ").append(pesajes.isEmpty() ? "No disponible" : pesajes.get(0).getPesoKg()).append(" kg\n\n");

        prompt.append("### HISTORIAL DE PESAJES\n");
        if (pesajes.isEmpty()) {
            prompt.append("No hay registros de pesajes.\n");
        } else {
            String pesajesStr = pesajes.stream()
                .map(p -> String.format("Fecha: %s, Peso: %.2f kg", p.getFechaPesaje(), p.getPesoKg()))
                .collect(Collectors.joining("\n"));
            prompt.append(pesajesStr).append("\n");
        }
        prompt.append("\n");

        prompt.append("### COSTOS ACUMULADOS\n");
        if (costos.isEmpty()) {
            prompt.append("No hay registros de costos.\n");
        } else {
            double totalCosto = costos.stream().mapToDouble(c -> c.getCostoDiaCop() != null ? c.getCostoDiaCop().doubleValue() : 0.0).sum();
            prompt.append("- Inversión Total: $").append(String.format("%.2f", totalCosto)).append("\n");
            
            String costosDetalle = costos.stream()
                .map(c -> String.format("- Insumo (%s): $%s", c.getTipoPasto() != null ? c.getTipoPasto() : "General", c.getCostoDiaCop()))
                .collect(Collectors.joining("\n"));
            prompt.append(costosDetalle).append("\n");
        }
        prompt.append("\n");

        prompt.append("### CONTEXTO DE MERCADO\n");
        prompt.append("- Precio actual del mercado (por kg): $").append(String.format("%.2f", precioMercado)).append("\n\n");

        prompt.append("### TAREA\n");
        prompt.append("Por favor, proporciona el análisis en el siguiente formato JSON estrictamente:\n");
        prompt.append("{\n");
        prompt.append("  \"diagnostico\": \"Resumen del estado actual del animal\",\n");
        prompt.append("  \"recomendaciones\": \"Sugerencias específicas de alimentación o manejo\",\n");
        prompt.append("  \"proyeccionPeso\": \"Estimación de peso a 30 días basada en la tendencia\",\n");
        prompt.append("  \"analisisFinanciero\": \"Evaluación de la rentabilidad actual vs precio mercado\",\n");
        prompt.append("  \"scoreRendimiento\": \"Calificación de A (Excelente) a F (Muy Bajo)\"\n");
        prompt.append("}\n");
        prompt.append("\nResponde ÚNICAMENTE con el JSON.");

        return prompt.toString();
    }
}
