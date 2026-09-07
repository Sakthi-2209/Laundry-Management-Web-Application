package com.example.demo.config;

import com.example.demo.model.LaundryService;
import com.example.demo.repository.ServiceRepository;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final ServiceRepository serviceRepository;

    public DataInitializer(ServiceRepository serviceRepository) {
        this.serviceRepository = serviceRepository;
    }

    @Override
    public void run(String... args) {

        if (serviceRepository.count() == 0) {

            serviceRepository.save(
                new LaundryService(
                    "Wash & Fold",
                    "Wash, dry and neatly fold your clothes.",
                    40,
                    "Laundry"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Wash & Iron",
                    "Complete washing and professional ironing.",
                    55,
                    "Laundry"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Dry Cleaning",
                    "Professional dry cleaning for garments.",
                    74,
                    "Dry Cleaning"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Organic Dry Cleaning",
                    "Eco-friendly dry cleaning service.",
                    112,
                    "Dry Cleaning"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Steam Iron",
                    "Professional steam ironing service.",
                    20,
                    "Ironing"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Blanket Cleaning",
                    "Deep cleaning for blankets.",
                    180,
                    "Home Care"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Curtain Cleaning",
                    "Professional curtain cleaning.",
                    150,
                    "Home Care"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Shoe Cleaning",
                    "Cleaning and refreshing shoes.",
                    120,
                    "Special Care"
                )
            );

            serviceRepository.save(
                new LaundryService(
                    "Leather Jacket Cleaning",
                    "Specialized leather jacket cleaning.",
                    344,
                    "Premium Cleaning"
                )
            );

            System.out.println(
                "Laundry services added successfully!"
            );
        }
    }
}