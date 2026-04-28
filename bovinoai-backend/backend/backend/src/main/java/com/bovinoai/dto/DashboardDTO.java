package com.bovinoai.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardDTO {
    private long totalAnimales;
    private long animalesEnCeba;
    private BigDecimal gdpPromedio;
    private BigDecimal inversionTotal;
    private List<AnimalAlertaDTO> alertas;
}
