/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.controller;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.Raza;
import com.bovinoai.service.RazaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
 
@RestController
@RequestMapping("/api/razas")
@CrossOrigin(origins = "http://localhost:5173")
public class RazaController {
 
    @Autowired
    private RazaService razaService;
 
    /**
     * GET /api/razas — Obtener todas las razas
     */
    @GetMapping
    public ResponseEntity<List<Raza>> listarRazas() {
        List<Raza> razas = razaService.listar();
        return ResponseEntity.ok(razas);
    }
 
    /**
     * GET /api/razas/{id} — Obtener una raza por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<Raza> obtenerRaza(@PathVariable Long id) {
        Optional<Raza> raza = razaService.obtenerPorId(id);
        return raza.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }
}
