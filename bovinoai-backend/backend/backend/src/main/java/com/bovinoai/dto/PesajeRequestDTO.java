/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.dto;

/**
 *
 * @author ALEJANDRO
 */

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PesajeRequestDTO {
    private LocalDate fechaPesaje;
    private BigDecimal pesoKg;
    private BigDecimal condicionCorporal; // Escala 1.0 a 5.0
    
    // Campos de insumos y ambiente
    private String tipoPasto;
    private Double concentradoKg;
    private Double mineralesG;
    private Double temperaturaC;
    private Double humedadPct;
    private BigDecimal costoDiaCop;
}
