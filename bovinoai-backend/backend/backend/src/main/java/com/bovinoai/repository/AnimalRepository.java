/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */

package com.bovinoai.repository;

/**
 *
 * @author ALEJANDRO
 */
 
import com.bovinoai.model.Animal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
 
@Repository
public interface AnimalRepository extends JpaRepository<Animal, Long> {
    Animal findByChapeta(String chapeta);
    List<Animal> findByActivoTrue();
    List<Animal> findByActivoTrueAndEtapa(String etapa);
    List<Animal> findByActivoTrueAndRaza_Id(Long idRaza);
    List<Animal> findByActivoTrueAndEtapaAndRaza_Id(String etapa, Long idRaza);
}
