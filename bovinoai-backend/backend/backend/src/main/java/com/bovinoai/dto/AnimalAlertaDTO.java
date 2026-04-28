package com.bovinoai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AnimalAlertaDTO {
    private Long idAnimal;
    private String chapeta;
    private String mensaje;
    private String tipoAlerta; // 'CRITICO', 'BAJO'
}
