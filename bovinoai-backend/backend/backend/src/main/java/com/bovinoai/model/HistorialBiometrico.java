/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.model;

/**
 *
 * @author ALEJANDRO
 */

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.math.BigDecimal;

@Entity
@Table(name = "historial_biometrico")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HistorialBiometrico {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;
    
    @Column(name = "fecha_pesaje", nullable = false)
    private LocalDate fechaPesaje;
    
    @Column(name = "peso_kg", precision = 7, scale = 2)
    private BigDecimal pesoKg;
    
    @Column(name = "condicion_corporal", precision = 2, scale = 1)
    private BigDecimal condicionCorporal;
    
    @Column(name = "gdp_calculado", precision = 5, scale = 3)
    private BigDecimal gdpCalculado;
    
    @Column(name = "dias_desde_anterior")
    private Integer diasDesdeAnterior;
}
