package com.example.demo.controller;

import com.example.demo.model.Enquiry;
import com.example.demo.repository.EnquiryRepository;

import org.springframework.lang.NonNull;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/enquiries")
@CrossOrigin(origins = "*")
public class EnquiryController {

    private final EnquiryRepository enquiryRepository;

    public EnquiryController(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    @PostMapping
    public Enquiry createEnquiry(@RequestBody @NonNull Enquiry enquiry) {
        return enquiryRepository.save(enquiry);
    }

    @GetMapping
    public List<Enquiry> getAllEnquiries() {
        return enquiryRepository.findAll();
    }
}