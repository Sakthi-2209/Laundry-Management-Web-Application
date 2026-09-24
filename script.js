document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // API CONFIGURATION
    // ==========================================
    const API_BASE_URL = "http://localhost:8080/api";

    // ==========================================
    // ELEMENTS
    // ==========================================
    const orderForm = document.getElementById("orderForm");
    const customerName = document.getElementById("customerName");
    const phone = document.getElementById("phone");
    const customerAddress = document.getElementById("customerAddress");
    const serviceSelect = document.getElementById("service");
    const clothesCount = document.getElementById("quantity");
    const pickupDate = document.getElementById("pickupDate");
    const deliveryDate = document.getElementById("deliveryDate");
    const pricePerPieceDisplay = document.getElementById("pricePerPiece");
    const quantityDisplay = document.getElementById("quantityDisplay");
    const totalPriceDisplay = document.getElementById("totalPrice");
    const submitOrderBtn = document.getElementById("submitOrderBtn");

    const enquiryForm = document.getElementById("enquiryForm");
    const submitEnquiryBtn = document.getElementById("submitEnquiryBtn");

    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const navbar = document.getElementById("navbar");

    // Modal elements
    const successModal = document.getElementById("successModal");
    const closeModalBtn = document.getElementById("closeModalBtn");
    const modalCustomerName = document.getElementById("modalCustomerName");
    const modalService = document.getElementById("modalService");
    const modalQty = document.getElementById("modalQty");
    const modalPickup = document.getElementById("modalPickup");
    const modalDelivery = document.getElementById("modalDelivery");
    const modalTotal = document.getElementById("modalTotal");

    // ==========================================
    // UI UTILITIES
    // ==========================================
    
    // Mobile Menu Toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", () => {
            navbar.classList.toggle("active");
        });
    }

    // Close menu when clicking a link
    document.querySelectorAll(".nav-link, .nav-button").forEach(link => {
        link.addEventListener("click", () => {
            if (navbar.classList.contains("active")) {
                navbar.classList.remove("active");
            }
        });
    });

    // Toast Notification System
    function showToast(message, type = "error") {
        const container = document.getElementById("toastContainer");
        if (!container) return;

        const toast = document.createElement("div");
        toast.className = `toast ${type}`;
        
        const iconName = type === "success" ? "check-circle" : "alert-circle";
        toast.innerHTML = `<i data-lucide="${iconName}"></i> <span>${message}</span>`;
        
        container.appendChild(toast);
        lucide.createIcons({ root: toast });

        // Trigger animation
        setTimeout(() => toast.classList.add("show"), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove("show");
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Clear form errors
    function clearErrors(form) {
        form.querySelectorAll(".form-group").forEach(group => {
            group.classList.remove("has-error");
        });
    }

    // Show field error
    function showFieldError(inputElement) {
        const group = inputElement.closest(".form-group");
        if (group) group.classList.add("has-error");
    }

    // ==========================================
    // LOAD SERVICES
    // ==========================================
    loadServices();

    async function loadServices() {
        try {
            const response = await fetch(`${API_BASE_URL}/services`);
            if (!response.ok) throw new Error("Failed to load services");
            
            const services = await response.json();
            populateServices(services);
        } catch (error) {
            console.error("Service loading error:", error);
            // Fallback services
            const fallbackServices = [
                { id: 1, name: "Wash & Fold", price: 40 },
                { id: 2, name: "Wash & Iron", price: 55 },
                { id: 3, name: "Dry Cleaning", price: 74 },
                { id: 4, name: "Steam Ironing", price: 15 },
                { id: 5, name: "Saree Cleaning", price: 120 },
                { id: 6, name: "Leather Jacket Cleaning", price: 344 }
            ];
            populateServices(fallbackServices);
        }
    }

    function populateServices(services) {
        serviceSelect.innerHTML = '<option value="">Choose a laundry service</option>';
        
        services.forEach(service => {
            const option = document.createElement("option");
            option.value = service.id;
            option.textContent = `${service.name} - ₹${service.price}/pc`;
            option.dataset.price = service.price;
            option.dataset.name = service.name;
            serviceSelect.appendChild(option);
        });

        // Re-attach listeners to "Choose Service" buttons now that we have actual IDs
        document.querySelectorAll(".choose-service-btn").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const serviceId = e.target.dataset.serviceId;
                if (serviceId) {
                    serviceSelect.value = serviceId;
                    calculateTotal();
                    // Smooth scroll to order section
                    document.getElementById("order").scrollIntoView({ behavior: "smooth" });
                }
            });
        });
    }

    // ==========================================
    // PRICING CALCULATION
    // ==========================================
    serviceSelect.addEventListener("change", calculateTotal);
    clothesCount.addEventListener("input", calculateTotal);

    function calculateTotal() {
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        
        if (!selectedOption || !selectedOption.dataset.price) {
            pricePerPieceDisplay.textContent = "₹0";
            quantityDisplay.textContent = "0";
            totalPriceDisplay.textContent = "₹0";
            return;
        }

        const price = Number(selectedOption.dataset.price);
        const quantity = Number(clothesCount.value) || 0;
        const total = price * quantity;

        pricePerPieceDisplay.textContent = `₹${price}`;
        quantityDisplay.textContent = quantity;
        totalPriceDisplay.textContent = `₹${total}`;
    }

    // ==========================================
    // DATE VALIDATION LOGIC
    // ==========================================
    // Set min date for pickup to today
    const today = new Date().toISOString().split("T")[0];
    if(pickupDate) pickupDate.min = today;

    pickupDate.addEventListener("change", () => {
        if (pickupDate.value) {
            deliveryDate.min = pickupDate.value;
            // If delivery is before new pickup, reset delivery
            if (deliveryDate.value && deliveryDate.value < pickupDate.value) {
                deliveryDate.value = pickupDate.value;
            }
        }
    });

    // ==========================================
    // ORDER SUBMISSION
    // ==========================================
    orderForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearErrors(orderForm);
        
        let isValid = true;

        if (!customerName.value.trim()) { showFieldError(customerName); isValid = false; }
        
        // Basic 10 digit check
        const phoneVal = phone.value.trim();
        if (!phoneVal || !/^\d{10}$/.test(phoneVal)) { showFieldError(phone); isValid = false; }
        
        if (!customerAddress.value.trim()) { showFieldError(customerAddress); isValid = false; }
        if (!serviceSelect.value) { showFieldError(serviceSelect); isValid = false; }
        
        const qtyVal = Number(clothesCount.value);
        if (!qtyVal || qtyVal <= 0) { showFieldError(clothesCount); isValid = false; }
        
        if (!pickupDate.value) { showFieldError(pickupDate); isValid = false; }
        if (!deliveryDate.value || deliveryDate.value < pickupDate.value) { showFieldError(deliveryDate); isValid = false; }

        if (!isValid) {
            showToast("Please fix the errors in the form.", "error");
            return;
        }

        // Prepare data
        const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
        const price = Number(selectedOption.dataset.price);
        const serviceName = selectedOption.dataset.name;
        const quantity = Number(clothesCount.value);
        const total = price * quantity;

        const orderData = {
            customerName: customerName.value.trim(),
            phone: phone.value.trim(),
            customerAddress: customerAddress.value.trim(),
            service: { id: Number(serviceSelect.value) },
            clothesCount: quantity,
            pickupDate: pickupDate.value,
            deliveryDate: deliveryDate.value
        };

        submitOrderBtn.disabled = true;
        submitOrderBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Placing Order...`;
        lucide.createIcons({ root: submitOrderBtn });

        try {
            const response = await fetch(`${API_BASE_URL}/orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) throw new Error("Failed to place order");

            // Success
            orderForm.reset();
            calculateTotal();
            
            // Show Success Modal
            modalCustomerName.textContent = orderData.customerName;
            modalService.textContent = serviceName;
            modalQty.textContent = orderData.clothesCount;
            modalPickup.textContent = orderData.pickupDate;
            modalDelivery.textContent = orderData.deliveryDate;
            modalTotal.textContent = `₹${total}`;
            
            successModal.classList.add("active");
            
        } catch (error) {
            console.error("Order error:", error);
            showToast("Cannot connect to the server. Please try again later.", "error");
        } finally {
            submitOrderBtn.disabled = false;
            submitOrderBtn.textContent = "Place Laundry Order";
        }
    });

    // Close Modal Logic
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            successModal.classList.remove("active");
        });
    }

    // ==========================================
    // ENQUIRY SUBMISSION
    // ==========================================
    if (enquiryForm) {
        enquiryForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            const nameInput = document.getElementById("enquiryName");
            const phoneInput = document.getElementById("enquiryPhone");
            const messageInput = document.getElementById("enquiryMessage");

            const enquiryData = {
                name: nameInput.value.trim(),
                phone: phoneInput.value.trim(),
                message: messageInput.value.trim()
            };

            if (!enquiryData.name || !enquiryData.phone || !enquiryData.message) {
                showToast("Please fill all enquiry fields.", "error");
                return;
            }

            submitEnquiryBtn.disabled = true;
            submitEnquiryBtn.textContent = "Sending...";

            try {
                const response = await fetch(`${API_BASE_URL}/enquiries`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(enquiryData)
                });

                if (!response.ok) throw new Error("Failed to send enquiry");

                showToast("Your enquiry has been sent successfully.", "success");
                enquiryForm.reset();
            } catch (error) {
                console.error("Enquiry error:", error);
                showToast("Failed to send enquiry. Please try again.", "error");
            } finally {
                submitEnquiryBtn.disabled = false;
                submitEnquiryBtn.textContent = "Send Enquiry";
            }
        });
    }

});