/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.controller;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.dto.PesajeRequestDTO;
import com.bovinoai.dto.PesajeResponseDTO;
import com.bovinoai.service.PesajeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
 
@RestController
@RequestMapping("/api/animales/{idAnimal}/pesajes")
@CrossOrigin(origins = "http://localhost:5173")
public class PesajeController {
 
    @Autowired
    private PesajeService pesajeService;
 
    /**
     * GET /api/animales/{idAnimal}/pesajes — Obtener historial de pesajes
     */
    @GetMapping
    public ResponseEntity<List<PesajeResponseDTO>> obtenerHistorial(@PathVariable Long idAnimal) {
        List<PesajeResponseDTO> pesajes = pesajeService.obtenerHistorial(idAnimal);
        return ResponseEntity.ok(pesajes);
    }
 
    /**
     * POST /api/animales/{idAnimal}/pesajes — Registrar nuevo pesaje
     * El GDP se calcula automáticamente
     */
    @PostMapping
    public ResponseEntity<PesajeResponseDTO> registrarPesaje(
            @PathVariable Long idAnimal,
            @RequestBody PesajeRequestDTO requestDTO) {
        PesajeResponseDTO pesajeGuardado = pesajeService.registrarPesaje(idAnimal, requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(pesajeGuardado);
    }
}
