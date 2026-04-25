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

@Entity
@Table(name = "razas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Raza {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 80)
    private String nombre;
    
    @Column(name = "gdp_esperado_kg")
    private Double gdpEsperadoKg;
    
    @Column(name = "peso_venta_ideal_kg")
    private Double pesoVentaIdealKg;
    
    @Column(name = "tolerancia_termica_c")
    private Double toleranciaTermicaC;
    
    @Column(name = "req_concentrado_kg")
    private Double reqConcentradoKg;
    
    @Column(name = "req_minerales_g")
    private Double reqMineralesG;
    
    @Column(name = "curva_crecimiento_json", columnDefinition = "jsonb")
    private String curvaCrecimientoJson;
}
