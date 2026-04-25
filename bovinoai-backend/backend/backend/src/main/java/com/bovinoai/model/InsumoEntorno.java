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
@Table(name = "insumos_entorno")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InsumoEntorno {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "id_animal", nullable = false)
    private Animal animal;
    
    @Column(nullable = false)
    private LocalDate fecha;
    
    @Column(name = "tipo_pasto", length = 80)
    private String tipoPasto;
    
    @Column(name = "concentrado_kg")
    private Double concentradoKg;
    
    @Column(name = "minerales_g")
    private Double mineralesG;
    
    @Column(name = "consumo_agua_lt")
    private Double consumoAguaLt;
    
    @Column(name = "temperatura_c")
    private Double temperaturC;
    
    @Column(name = "humedad_pct")
    private Double humedad_pct;
    
    @Column(name = "costo_dia_cop", precision = 10, scale = 2)
    private BigDecimal costoDiaCop;
}
