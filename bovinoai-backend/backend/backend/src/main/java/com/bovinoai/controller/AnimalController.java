/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.controller;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.dto.AnimalRequestDTO;
import com.bovinoai.dto.AnimalResponseDTO;
import com.bovinoai.dto.CostosResponseDTO;
import com.bovinoai.service.AnimalService;
import com.bovinoai.service.CostosService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
 
@RestController
@RequestMapping("/api/animales")
@CrossOrigin(origins = "http://localhost:5173")
public class AnimalController {
 
    @Autowired
    private AnimalService animalService;

    @Autowired
    private CostosService costosService;
 
    /**
     * GET /api/animales — Listar todos los animales activos
     */
    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> listarAnimales() {
        List<AnimalResponseDTO> animales = animalService.listarActivos();
        return ResponseEntity.ok(animales);
    }
 
    /**
     * GET /api/animales/{id} — Obtener detalle de un animal
     */
    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> obtenerAnimal(@PathVariable Long id) {
        AnimalResponseDTO animal = animalService.obtenerPorId(id);
        if (animal != null) {
            return ResponseEntity.ok(animal);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
 
    /**
     * POST /api/animales — Crear nuevo animal
     */
    @PostMapping
    public ResponseEntity<AnimalResponseDTO> crearAnimal(@RequestBody AnimalRequestDTO requestDTO) {
        AnimalResponseDTO animalCreado = animalService.crear(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(animalCreado);
    }
 
    /**
     * PUT /api/animales/{id} — Actualizar un animal
     */
    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> actualizarAnimal(
            @PathVariable Long id,
            @RequestBody AnimalRequestDTO requestDTO) {
        AnimalResponseDTO animalActualizado = animalService.actualizar(id, requestDTO);
        return ResponseEntity.ok(animalActualizado);
    }
 
    /**
     * DELETE /api/animales/{id} — Desactivar animal (soft delete)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarAnimal(@PathVariable Long id) {
        animalService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/animales/{id}/costos — Obtener indicadores de costos
     */
    @GetMapping("/{id}/costos")
    public ResponseEntity<CostosResponseDTO> obtenerCostos(@PathVariable Long id) {
        CostosResponseDTO costos = costosService.calcularCostos(id);
        return ResponseEntity.ok(costos);
    }
}
