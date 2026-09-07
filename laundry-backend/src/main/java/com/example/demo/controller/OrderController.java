package com.example.demo.controller;

import com.example.demo.model.LaundryOrder;
import com.example.demo.model.LaundryService;
import com.example.demo.repository.OrderRepository;
import com.example.demo.repository.ServiceRepository;
import java.util.Objects;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ServiceRepository serviceRepository;

    public OrderController(OrderRepository orderRepository,
                            ServiceRepository serviceRepository) {

        this.orderRepository = orderRepository;
        this.serviceRepository = serviceRepository;
    }

    @PostMapping
    public LaundryOrder createOrder(
            @RequestBody LaundryOrder order) {

        if (order.getService() == null ||
                order.getService().getId() == null) {

            throw new RuntimeException("Service is required");
        }

        Long serviceId = Objects.requireNonNull(
        order.getService().getId(),
        "Service ID is required"
);

        LaundryService service =
                serviceRepository.findById(serviceId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Service not found"));

        order.setService(service);

        double price = service.getPrice();

        double total =
                price * order.getClothesCount();

        order.setPricePerPiece(price);

        order.setTotalAmount(total);

        order.setOrderDate(LocalDateTime.now());

        order.setStatus("PLACED");

        return orderRepository.save(order);
    }

    @GetMapping
    public List<LaundryOrder> getAllOrders() {

        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public LaundryOrder getOrder(
            @PathVariable Long id) {

        if (id == null) {
            throw new RuntimeException("Order ID is required");
        }

        return orderRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found"));
    }

    @PutMapping("/{id}/status")
    public LaundryOrder updateStatus(
            @PathVariable Long id,
            @RequestParam String status) {

        if (id == null) {
            throw new RuntimeException("Order ID is required");
        }

        LaundryOrder order =
                orderRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Order not found"));

        order.setStatus(status);

        return orderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    public String deleteOrder(
            @PathVariable Long id) {

        if (id == null) {
            throw new RuntimeException("Order ID is required");
        }

        orderRepository.deleteById(id);

        return "Order deleted successfully";
    }
}