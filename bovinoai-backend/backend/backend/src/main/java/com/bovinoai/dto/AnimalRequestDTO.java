/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.dto;

/**
 *
 * @author ALEJANDRO
 */

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.math.BigDecimal;
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalRequestDTO {
    @NotBlank(message = "La chapeta es obligatoria")
    private String chapeta;
    
    @NotNull(message = "La raza es obligatoria")
    private Long idRaza;
    
    @NotNull(message = "La fecha de nacimiento es obligatoria")
    private LocalDate fechaNacimiento;
    
    @NotBlank(message = "El sexo es obligatorio")
    private String sexo;
    
    @NotBlank(message = "La etapa es obligatoria")
    private String etapa;
    
    private String observaciones;
    
    @Positive(message = "El peso debe ser positivo")
    private BigDecimal pesoInicial;
}
