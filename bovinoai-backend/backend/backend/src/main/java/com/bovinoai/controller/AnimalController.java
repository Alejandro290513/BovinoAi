package com.bovinoai.controller;

import com.bovinoai.dto.AnimalRequestDTO;
import com.bovinoai.dto.AnimalResponseDTO;
import com.bovinoai.dto.CostosResponseDTO;
import com.bovinoai.service.AnimalService;
import com.bovinoai.service.CostosService;
import jakarta.validation.Valid;
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

    @GetMapping
    public ResponseEntity<List<AnimalResponseDTO>> listarAnimales(
            @RequestParam(required = false) String etapa,
            @RequestParam(required = false) Long idRaza) {
        List<AnimalResponseDTO> animales = animalService.listar(etapa, idRaza);
        return ResponseEntity.ok(animales);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> obtenerAnimal(@PathVariable Long id) {
        AnimalResponseDTO animal = animalService.obtenerPorId(id);
        return ResponseEntity.ok(animal);
    }

    @PostMapping
    public ResponseEntity<AnimalResponseDTO> crearAnimal(@Valid @RequestBody AnimalRequestDTO requestDTO) {
        AnimalResponseDTO animalCreado = animalService.crear(requestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(animalCreado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnimalResponseDTO> actualizarAnimal(
            @PathVariable Long id,
            @Valid @RequestBody AnimalRequestDTO requestDTO) {
        AnimalResponseDTO animalActualizado = animalService.actualizar(id, requestDTO);
        return ResponseEntity.ok(animalActualizado);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desactivarAnimal(@PathVariable Long id) {
        animalService.desactivar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/costos")
    public ResponseEntity<CostosResponseDTO> obtenerCostos(@PathVariable Long id) {
        CostosResponseDTO costos = costosService.calcularCostos(id);
        return ResponseEntity.ok(costos);
    }
}
