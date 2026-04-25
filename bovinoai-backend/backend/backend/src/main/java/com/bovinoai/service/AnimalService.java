/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.service;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.Animal;
import com.bovinoai.model.Raza;
import com.bovinoai.dto.AnimalRequestDTO;
import com.bovinoai.dto.AnimalResponseDTO;
import com.bovinoai.repository.AnimalRepository;
import com.bovinoai.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private RazaRepository razaRepository;

    /**
     * Listar todos los animales activos
     */
    @Transactional(readOnly = true)
    public List<AnimalResponseDTO> listarActivos() {
        return animalRepository.findByActivoTrue()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtener un animal por ID
     */
    @Transactional(readOnly = true)
    public AnimalResponseDTO obtenerPorId(Long id) {
        Optional<Animal> animal = animalRepository.findById(id);
        return animal.map(this::convertToDTO).orElse(null);
    }

    /**
     * Crear nuevo animal
     */
    @Transactional
    public AnimalResponseDTO crear(AnimalRequestDTO requestDTO) {
        // Validar que la raza exista
        Raza raza = razaRepository.findById(requestDTO.getIdRaza())
                .orElseThrow(() -> new RuntimeException("Raza no encontrada"));

        Animal animal = new Animal();
        animal.setChapeta(requestDTO.getChapeta());
        animal.setRaza(raza);
        animal.setFechaNacimiento(requestDTO.getFechaNacimiento());
        animal.setSexo(requestDTO.getSexo());
        animal.setEtapa(requestDTO.getEtapa());
        animal.setActivo(true);
        animal.setFechaIngreso(LocalDate.now());
        animal.setObservaciones(requestDTO.getObservaciones());

        Animal guardado = animalRepository.save(animal);
        return convertToDTO(guardado);
    }

    /**
     * Actualizar un animal
     */
    @Transactional
    public AnimalResponseDTO actualizar(Long id, AnimalRequestDTO requestDTO) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal no encontrado"));

        if (requestDTO.getIdRaza() != null) {
            Raza raza = razaRepository.findById(requestDTO.getIdRaza())
                    .orElseThrow(() -> new RuntimeException("Raza no encontrada"));
            animal.setRaza(raza);
        }

        if (requestDTO.getChapeta() != null) {
            animal.setChapeta(requestDTO.getChapeta());
        }
        if (requestDTO.getSexo() != null) {
            animal.setSexo(requestDTO.getSexo());
        }
        if (requestDTO.getEtapa() != null) {
            animal.setEtapa(requestDTO.getEtapa());
        }
        if (requestDTO.getObservaciones() != null) {
            animal.setObservaciones(requestDTO.getObservaciones());
        }

        Animal actualizado = animalRepository.save(animal);
        return convertToDTO(actualizado);
    }

    /**
     * Soft delete: desactivar animal sin borrarlo
     */
    @Transactional
    public void desactivar(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Animal no encontrado"));
        animal.setActivo(false);
        animalRepository.save(animal);
    }

    /**
     * Convertir entidad Animal a DTO
     */
    private AnimalResponseDTO convertToDTO(Animal animal) {
        AnimalResponseDTO dto = new AnimalResponseDTO();
        dto.setId(animal.getId());
        dto.setChapeta(animal.getChapeta());
        dto.setRaza(animal.getRaza().getNombre());
        dto.setFechaNacimiento(animal.getFechaNacimiento());
        dto.setSexo(animal.getSexo());
        dto.setEtapa(animal.getEtapa());
        dto.setActivo(animal.getActivo());
        dto.setFechaIngreso(animal.getFechaIngreso());
        dto.setObservaciones(animal.getObservaciones());
        // ultimoPeso y gdpReciente se cargan desde el historial (por ahora null)
        dto.setUltimoPeso(null);
        dto.setGdpReciente(null);
        dto.setAlertas(null);
        return dto;
    }
}
