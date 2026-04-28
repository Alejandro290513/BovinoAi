package com.bovinoai.service;

import com.bovinoai.model.Animal;
import com.bovinoai.model.HistorialBiometrico;
import com.bovinoai.model.Raza;
import com.bovinoai.dto.AnimalRequestDTO;
import com.bovinoai.dto.AnimalResponseDTO;
import com.bovinoai.exception.ResourceNotFoundException;
import com.bovinoai.repository.AnimalRepository;
import com.bovinoai.repository.HistorialBiometricoRepository;
import com.bovinoai.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnimalService {

    @Autowired
    private AnimalRepository animalRepository;

    @Autowired
    private RazaRepository razaRepository;
    
    @Autowired
    private HistorialBiometricoRepository historialRepository;

    @Transactional(readOnly = true)
    public List<AnimalResponseDTO> listar(String etapa, Long idRaza) {
        List<Animal> animales;
        if (etapa != null && idRaza != null) {
            animales = animalRepository.findByActivoTrueAndEtapaAndRaza_Id(etapa, idRaza);
        } else if (etapa != null) {
            animales = animalRepository.findByActivoTrueAndEtapa(etapa);
        } else if (idRaza != null) {
            animales = animalRepository.findByActivoTrueAndRaza_Id(idRaza);
        } else {
            animales = animalRepository.findByActivoTrue();
        }
        return animales.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AnimalResponseDTO obtenerPorId(Long id) {
        return animalRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado con ID: " + id));
    }

    @Transactional
    public AnimalResponseDTO crear(AnimalRequestDTO requestDTO) {
        Raza raza = razaRepository.findById(requestDTO.getIdRaza())
                .orElseThrow(() -> new ResourceNotFoundException("Raza no encontrada con ID: " + requestDTO.getIdRaza()));

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
        
        if (requestDTO.getPesoInicial() != null && requestDTO.getPesoInicial().compareTo(BigDecimal.ZERO) > 0) {
            HistorialBiometrico historial = new HistorialBiometrico();
            historial.setAnimal(guardado);
            historial.setFechaPesaje(guardado.getFechaIngreso());
            historial.setPesoKg(requestDTO.getPesoInicial());
            historial.setCondicionCorporal(BigDecimal.valueOf(3));
            historialRepository.save(historial);
        }
        
        return convertToDTO(guardado);
    }

    @Transactional
    public AnimalResponseDTO actualizar(Long id, AnimalRequestDTO requestDTO) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado con ID: " + id));

        if (requestDTO.getIdRaza() != null) {
            Raza raza = razaRepository.findById(requestDTO.getIdRaza())
                    .orElseThrow(() -> new ResourceNotFoundException("Raza no encontrada con ID: " + requestDTO.getIdRaza()));
            animal.setRaza(raza);
        }

        if (requestDTO.getChapeta() != null) animal.setChapeta(requestDTO.getChapeta());
        if (requestDTO.getSexo() != null) animal.setSexo(requestDTO.getSexo());
        if (requestDTO.getEtapa() != null) animal.setEtapa(requestDTO.getEtapa());
        if (requestDTO.getObservaciones() != null) animal.setObservaciones(requestDTO.getObservaciones());

        Animal actualizado = animalRepository.save(animal);
        return convertToDTO(actualizado);
    }

    @Transactional
    public void desactivar(Long id) {
        Animal animal = animalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Animal no encontrado con ID: " + id));
        animal.setActivo(false);
        animalRepository.save(animal);
    }

    private AnimalResponseDTO convertToDTO(Animal animal) {
        AnimalResponseDTO dto = new AnimalResponseDTO();
        dto.setId(animal.getId());
        dto.setChapeta(animal.getChapeta());
        dto.setRaza(animal.getRaza() != null ? animal.getRaza().getNombre() : "N/A");
        dto.setFechaNacimiento(animal.getFechaNacimiento());
        dto.setSexo(animal.getSexo());
        dto.setEtapa(animal.getEtapa());
        dto.setActivo(animal.getActivo());
        dto.setFechaIngreso(animal.getFechaIngreso());
        dto.setObservaciones(animal.getObservaciones());
        dto.setUltimoPeso(BigDecimal.ZERO);
        dto.setGdpReciente(BigDecimal.ZERO);
        dto.setAlertas("Sin alertas");
        return dto;
    }
}
