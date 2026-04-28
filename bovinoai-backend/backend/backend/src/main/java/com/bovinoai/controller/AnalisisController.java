package com.bovinoai.controller;

import com.bovinoai.dto.AnalisisResponseDTO;
import com.bovinoai.service.AnalisisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analisis")
@RequiredArgsConstructor
public class AnalisisController {

    private final AnalisisService analisisService;

    @PostMapping("/{idAnimal}")
    public ResponseEntity<AnalisisResponseDTO> analizarAnimal(
            @PathVariable Long idAnimal,
            @RequestBody Map<String, Object> payload) {
        
        Double precioMercado = Double.valueOf(payload.getOrDefault("precioMercadoCop", 0.0).toString());
        AnalisisResponseDTO analisis = analisisService.analizarAnimal(idAnimal, precioMercado);
        return ResponseEntity.ok(analisis);
    }
}
