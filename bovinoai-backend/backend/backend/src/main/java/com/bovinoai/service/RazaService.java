/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.bovinoai.service;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.Raza;
import com.bovinoai.repository.RazaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
 
import java.util.List;
import java.util.Optional;
 
@Service
public class RazaService {
 
    @Autowired
    private RazaRepository razaRepository;
 
    /**
     * Listar todas las razas disponibles
     */
    @Transactional(readOnly = true)
    public List<Raza> listar() {
        return razaRepository.findAll();
    }
 
    /**
     * Obtener una raza por ID
     */
    @Transactional(readOnly = true)
    public Optional<Raza> obtenerPorId(Long id) {
        return razaRepository.findById(id);
    }
}
