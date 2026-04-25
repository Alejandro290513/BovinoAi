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
public class AnimalResponseDTO {
    private Long id;
    private String chapeta;
    private String raza;              // nombre de la raza, no el ID
    private LocalDate fechaNacimiento;
    private String sexo;
    private String etapa;
    private Boolean activo;
    private LocalDate fechaIngreso;
    private String observaciones;
    private BigDecimal ultimoPeso;    // peso del último pesaje
    private BigDecimal gdpReciente;   // GDP del último período
    private String alertas;           // resumen de alertas, si las hay
}
