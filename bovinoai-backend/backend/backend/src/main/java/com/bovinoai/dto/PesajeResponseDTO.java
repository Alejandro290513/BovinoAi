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
public class PesajeResponseDTO {
    private Long id;
    private Long idAnimal;
    private LocalDate fechaPesaje;
    private BigDecimal pesoKg;
    private BigDecimal condicionCorporal;
    private BigDecimal gdpCalculado;      // Calculado automáticamente por el backend
    private Integer diasDesdeAnterior;    // Calculado automáticamente por el backend
}
