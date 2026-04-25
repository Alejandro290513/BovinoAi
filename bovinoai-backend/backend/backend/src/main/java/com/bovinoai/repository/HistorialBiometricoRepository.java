/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */

package com.bovinoai.repository;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.HistorialBiometrico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface HistorialBiometricoRepository extends JpaRepository<HistorialBiometrico, Long> {
    List<HistorialBiometrico> findByAnimalIdOrderByFechaPesajeDesc(Long animalId);
    List<HistorialBiometrico> findByAnimalIdOrderByFechaPesajeAsc(Long animalId);
    
    @Query("SELECT h FROM HistorialBiometrico h WHERE h.animal.id = :animalId ORDER BY h.fechaPesaje DESC LIMIT 1")
    HistorialBiometrico findUltimoByAnimalId(@Param("animalId") Long animalId);
}
