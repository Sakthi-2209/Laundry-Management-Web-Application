package com.example.demo.controller;

import com.example.demo.model.LaundryService;
import com.example.demo.repository.ServiceRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
@CrossOrigin(origins = "*")
public class ServiceController {

    private final ServiceRepository serviceRepository;

    public ServiceController(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @GetMapping
    public List<LaundryService> getAllServices() {

        return serviceRepository.findAll();
    }

    @GetMapping("/{id}")
    public LaundryService getService(
            @PathVariable Long id) {

        if (id == null) {
            throw new RuntimeException("Service ID is required");
        }

        return serviceRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Service not found"));
    }
}