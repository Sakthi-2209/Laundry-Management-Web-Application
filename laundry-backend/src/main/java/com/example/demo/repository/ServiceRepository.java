package com.example.demo.repository;

import com.example.demo.model.LaundryService;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ServiceRepository
        extends JpaRepository<LaundryService, Long> {
}