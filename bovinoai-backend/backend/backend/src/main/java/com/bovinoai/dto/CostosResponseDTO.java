package com.bovinoai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CostosResponseDTO {
    private BigDecimal costoAcumulado;
    private Double conversionAlimenticia;
    private BigDecimal margenGanancia;
    private Double pesoActual;
    private Double puntoEquilibrio;
    private Integer diasEnEtapa;
    private List<AlertaDTO> alertasActivas;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class AlertaDTO {
        private String tipo;
        private String descripcion;
    }
}
