/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */

package com.bovinoai.repository;

/**
 *
 * @author ALEJANDRO
 */

import com.bovinoai.model.InsumoEntorno;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface InsumoEntornoRepository extends JpaRepository<InsumoEntorno, Long> {
    List<InsumoEntorno> findByAnimalIdOrderByFechaAsc(Long animalId);
    List<InsumoEntorno> findByAnimalIdOrderByFechaDesc(Long animalId);
    
    @Query("SELECT i FROM InsumoEntorno i WHERE i.animal.id = :animalId ORDER BY i.fecha DESC LIMIT 1")
    InsumoEntorno findUltimoByAnimalId(@Param("animalId") Long animalId);
}
