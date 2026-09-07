# 🧺 Laundry Service Management System

A simple full-stack Laundry Service Management System developed using HTML, CSS, JavaScript, Spring Boot, Java, and MySQL.

The application allows customers to view available laundry services, calculate pricing, place laundry orders, and send enquiries through a simple and responsive web interface.

---

## 🌐 Live Demo

**Website:** [Visit LaundryCare]( https://sakthi-2209.github.io/Laundry-Management-Web-Application/)

**GitHub:** [View Source Code](https://github.com/Sakthi-2209/Laundry-Management-Web-Application)


## 🚀 Project Overview

This project is being developed as a beginner-friendly full-stack web application to understand how a frontend communicates with a backend and database.

### Current Features

- 🏠 Customer-friendly home page
- 🧺 Laundry services and pricing
- 📦 Place laundry orders
- 💰 Automatic price calculation
- 📅 Pickup and delivery date selection
- 📞 Customer contact information
- 💬 Customer enquiry form
- 💾 Orders stored in MySQL
- 💾 Enquiries stored in MySQL
- 🔗 REST APIs using Spring Boot

---

## 🛠️ Technologies Used

### Frontend

- HTML5
- CSS3
- JavaScript

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA

### Database

- MySQL

### Development Tools

- Visual Studio Code
- Spring Tool Suite / Eclipse
- MySQL
- Postman
- Git & GitHub

---

## 📂 Project Structure

```text
Laundry-Service-Management-System/
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
├── backend/
│   └── laundry-backend/
│       ├── src/
│       │   └── main/
│       │       └── java/
│       │           └── com/
│       │               └── example/
│       │                   └── demo/
│       │                       ├── controller/
│       │                       │   ├── OrderController.java
│       │                       │   ├── ServiceController.java
│       │                       │   └── EnquiryController.java
│       │                       │
│       │                       ├── model/
│       │                       │   ├── LaundryOrder.java
│       │                       │   ├── LaundryService.java
│       │                       │   └── Enquiry.java
│       │                       │
│       │                       └── repository/
│       │                           ├── OrderRepository.java
│       │                           ├── ServiceRepository.java
│       │                           └── EnquiryRepository.java
│       │
│       └── pom.xml
│
└── README.md
