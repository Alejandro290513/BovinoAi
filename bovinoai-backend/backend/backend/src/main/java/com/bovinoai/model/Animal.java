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
import java.util.List;
 
@Entity
@Table(name = "animales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Animal {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true, length = 20)
    private String chapeta;
    
    @ManyToOne
    @JoinColumn(name = "id_raza", nullable = false)
    private Raza raza;
    
    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;
    
    @Column(length = 1)
    private String sexo;
    
    @Column(length = 20)
    private String etapa;
    
    @Column(nullable = false)
    private Boolean activo = true;
    
    @Column(name = "fecha_ingreso")
    private LocalDate fechaIngreso;
    
    @Column(columnDefinition = "TEXT")
    private String observaciones;
    
    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<HistorialBiometrico> historialesBiometricos;
    
    @OneToMany(mappedBy = "animal", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<InsumoEntorno> insumosEntorno;
}
