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
public class InsumoEntornoRequestDTO {
    private LocalDate fecha;
    private String tipoPasto;
    private BigDecimal concentradoKg;
    private BigDecimal mineralesGramos;
    private BigDecimal consumoAguaLts;
    private BigDecimal temperaturaC;
    private BigDecimal humedadPct;
    private BigDecimal costoDiaCop;
}
