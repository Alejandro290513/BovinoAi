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
 
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnimalRequestDTO {
    private String chapeta;           // ID físico (código de oreja)
    private Long idRaza;              // FK a raza
    private LocalDate fechaNacimiento;
    private String sexo;              // "M" o "H"
    private String etapa;             // "cria", "levante", "ceba"
    private String observaciones;
}
