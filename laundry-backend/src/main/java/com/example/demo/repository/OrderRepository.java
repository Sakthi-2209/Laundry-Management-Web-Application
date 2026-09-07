package com.example.demo.repository;

import com.example.demo.model.LaundryOrder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository
        extends JpaRepository<LaundryOrder, Long> {
}