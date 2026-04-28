package com.bovinoai.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AnalisisResponseDTO {
    private String diagnostico;
    private String recomendaciones;
    private String proyeccionPeso;
    private String analisisFinanciero;
    private String scoreRendimiento; // A-F
}
