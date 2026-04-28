package com.bovinoai.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class CostoResponseDTO {
    private Long idAnimal;
    private BigDecimal costoAcumulado;
    private BigDecimal conversionAlimenticia;
    private BigDecimal margenBruto;
    private BigDecimal puntoEquilibrio;
    private BigDecimal precioMercadoUsado;
}