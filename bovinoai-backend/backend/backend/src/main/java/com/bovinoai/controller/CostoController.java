package com.bovinoai.controller;

import com.bovinoai.dto.CostoResponseDTO;
import com.bovinoai.logic.CalculadorCostos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/animales/{idAnimal}/costos")
public class CostoController {
    
    @Autowired
    private CalculadorCostos calculador;
    
    @GetMapping
    public ResponseEntity<CostoResponseDTO> obtenerCostos(
            @PathVariable Long idAnimal,
            @RequestParam(required = false, defaultValue = "9000") BigDecimal precioMercado) {
        
        CostoResponseDTO response = new CostoResponseDTO();
        response.setIdAnimal(idAnimal);
        response.setCostoAcumulado(calculador.calcularCostoAcumulado(idAnimal));
        response.setConversionAlimenticia(calculador.calcularConversionAlimenticia(idAnimal));
        response.setMargenBruto(calculador.calcularMargenBruto(idAnimal, precioMercado));
        response.setPuntoEquilibrio(calculador.calcularPuntoEquilibrio(idAnimal, precioMercado));
        response.setPrecioMercadoUsado(precioMercado);
        
        return ResponseEntity.ok(response);
    }
}