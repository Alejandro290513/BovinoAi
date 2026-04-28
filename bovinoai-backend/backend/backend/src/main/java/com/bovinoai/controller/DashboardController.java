package com.bovinoai.controller;

import com.bovinoai.dto.DashboardDTO;
import com.bovinoai.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "http://localhost:5173")
public class DashboardController {
    
    @Autowired
    private DashboardService dashboardService;
    
    @GetMapping
    public ResponseEntity<DashboardDTO> obtenerDatos() {
        return ResponseEntity.ok(dashboardService.obtenerDatosDashboard());
    }
}