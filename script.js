document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // API URL
    // ==========================================

    const API_BASE_URL = "http://localhost:8080/api";


    // ==========================================
    // GET HTML ELEMENTS
    // ==========================================

    const orderForm = document.getElementById("orderForm");

    const customerName = document.getElementById("customerName");
    const phone = document.getElementById("phone");

    const serviceSelect = document.getElementById("service");

    // IMPORTANT:
    // HTML uses id="quantity"
    const clothesCount = document.getElementById("quantity");

    const pickupDate = document.getElementById("pickupDate");
    const deliveryDate = document.getElementById("deliveryDate");

    const pricePerPiece = document.getElementById("pricePerPiece");

    // HTML uses id="quantityDisplay"
    const quantityDisplay = document.getElementById("quantityDisplay");

    // HTML uses id="totalPrice"
    const totalPrice = document.getElementById("totalPrice");


    // ==========================================
    // LOAD SERVICES
    // ==========================================

    loadServices();


    async function loadServices() {

        try {

            const response =
                await fetch(`${API_BASE_URL}/services`);


            if (!response.ok) {
                throw new Error("Failed to load services");
            }


            const services =
                await response.json();


            console.log("Services received:", services);


            serviceSelect.innerHTML =
                '<option value="">Select a service</option>';


            services.forEach(service => {

                const option =
                    document.createElement("option");


                // IMPORTANT
                // Send SERVICE ID to Spring Boot
                option.value = service.id;


                // Display service name and price
                option.textContent =
                    `${service.name} - ₹${service.price}/pc`;


                // Store price for calculation
                option.dataset.price =
                    service.price;


                serviceSelect.appendChild(option);

            });


        } catch (error) {

            console.error(
                "Service loading error:",
                error
            );


            // ==========================================
            // FALLBACK SIX SERVICES
            // ==========================================

            const services = [

                {
                    id: 1,
                    name: "Wash & Fold",
                    price: 40
                },

                {
                    id: 2,
                    name: "Wash & Iron",
                    price: 55
                },

                {
                    id: 3,
                    name: "Dry Cleaning",
                    price: 74
                },

                {
                    id: 4,
                    name: "Steam Ironing",
                    price: 15
                },

                {
                    id: 5,
                    name: "Saree Cleaning",
                    price: 120
                },

                {
                    id: 6,
                    name: "Leather Jacket Cleaning",
                    price: 344
                }

            ];


            serviceSelect.innerHTML =
                '<option value="">Select a service</option>';


            services.forEach(service => {

                const option =
                    document.createElement("option");


                option.value =
                    service.id;


                option.textContent =
                    `${service.name} - ₹${service.price}/pc`;


                option.dataset.price =
                    service.price;


                serviceSelect.appendChild(option);

            });

        }

    }


    // ==========================================
    // SERVICE CHANGE
    // ==========================================

    serviceSelect.addEventListener(
        "change",
        calculateTotal
    );


    // ==========================================
    // CLOTHES COUNT CHANGE
    // ==========================================

    clothesCount.addEventListener(
        "input",
        calculateTotal
    );


    // ==========================================
    // CALCULATE TOTAL
    // ==========================================

    function calculateTotal() {

        const selectedOption =
            serviceSelect.options[
                serviceSelect.selectedIndex
            ];


        // No service selected
        if (
            !selectedOption ||
            !selectedOption.dataset.price
        ) {

            pricePerPiece.textContent = "₹0";

            quantityDisplay.textContent = "0";

            totalPrice.textContent = "₹0";

            return;
        }


        // Get price
        const price =
            Number(selectedOption.dataset.price);


        // Get clothes quantity
        const quantity =
            Number(clothesCount.value);


        // Calculate
        const total =
            price * quantity;


        // ==========================================
        // UPDATE SCREEN
        // ==========================================

        pricePerPiece.textContent =
            `₹${price}`;


        quantityDisplay.textContent =
            quantity || 0;


        totalPrice.textContent =
            `₹${total}`;

    }


    // ==========================================
    // PLACE ORDER
    // ==========================================

    orderForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            // ==========================================
            // VALIDATION
            // ==========================================

            if (!customerName.value.trim()) {

                alert("Please enter customer name.");

                return;
            }


            if (!phone.value.trim()) {

                alert("Please enter phone number.");

                return;
            }


            if (!serviceSelect.value) {

                alert("Please select a laundry service.");

                return;
            }


            if (
                !clothesCount.value ||
                Number(clothesCount.value) <= 0
            ) {

                alert(
                    "Please enter the number of clothes."
                );

                return;
            }


            if (!pickupDate.value) {

                alert("Please select pickup date.");

                return;
            }


            if (!deliveryDate.value) {

                alert("Please select delivery date.");

                return;
            }


            // ==========================================
            // GET SELECTED SERVICE
            // ==========================================

            const selectedOption =
                serviceSelect.options[
                    serviceSelect.selectedIndex
                ];


            const price =
                Number(selectedOption.dataset.price);


            const quantity =
                Number(clothesCount.value);


            const total =
                price * quantity;


            // ==========================================
            // ORDER DATA
            // ==========================================

            const orderData = {

                customerName:
                    customerName.value.trim(),

                phone:
                    phone.value.trim(),

                service: {

                    id:
                        Number(serviceSelect.value)

                },

                clothesCount:
                    quantity,

                pickupDate:
                    pickupDate.value,

                deliveryDate:
                    deliveryDate.value

            };


            console.log(
                "Sending order:",
                orderData
            );


            console.log(
                "Estimated total:",
                total
            );


            // ==========================================
            // SEND TO SPRING BOOT
            // ==========================================

            try {

                const response =
                    await fetch(
                        `${API_BASE_URL}/orders`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(orderData)
                        }
                    );


                // ==========================================
                // ERROR RESPONSE
                // ==========================================

                if (!response.ok) {

                    const errorText =
                        await response.text();


                    console.error(
                        "Server error:",
                        errorText
                    );


                    alert(
                        "Failed to place order."
                    );


                    return;
                }


                // ==========================================
                // SUCCESS
                // ==========================================

                const savedOrder =
                    await response.json();


                console.log(
                    "Order saved:",
                    savedOrder
                );


                alert(
                    `Laundry order placed successfully!\n\n` +
                    `Estimated Amount: ₹${total}`
                );


                // Clear form
                orderForm.reset();


                // Reset price display
                pricePerPiece.textContent =
                    "₹0";


                quantityDisplay.textContent =
                    "0";


                totalPrice.textContent =
                    "₹0";

            }


            catch (error) {

                console.error(
                    "Order error:",
                    error
                );


                alert(
                    "Cannot connect to the Spring Boot server."
                );

            }

        }
    );


    // ==========================================
    // DATE VALIDATION
    // ==========================================

    pickupDate.addEventListener(
        "change",
        () => {

            if (pickupDate.value) {

                deliveryDate.min =
                    pickupDate.value;

            }

        }
    );

});

// ==========================================
// ENQUIRY FORM
// ==========================================
// ==========================================
// ENQUIRY FORM
// ==========================================

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", async (event) => {

        // IMPORTANT: Stop normal form submission
        event.preventDefault();

        const enquiryData = {
            name: document.getElementById("enquiryName").value.trim(),
            phone: document.getElementById("enquiryPhone").value.trim(),
            message: document.getElementById("enquiryMessage").value.trim()
        };

        console.log("Sending enquiry:", enquiryData);

        // Validation
        if (!enquiryData.name) {
            alert("Please enter your name.");
            return;
        }

        if (!enquiryData.phone) {
            alert("Please enter your phone number.");
            return;
        }

        if (!enquiryData.message) {
            alert("Please enter your enquiry.");
            return;
        }

        try {

            const response = await fetch(
                "http://localhost:8080/api/enquiries",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(enquiryData)
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "Enquiry error:",
                    errorText
                );

                alert("Failed to send enquiry.");

                return;
            }

            const savedEnquiry = await response.json();

            console.log(
                "Enquiry saved:",
                savedEnquiry
            );

            // SUCCESS MESSAGE
            alert(
                "Enquiry sent successfully! We will contact you soon."
            );

            // Clear form
            enquiryForm.reset();

        } catch (error) {

            console.error(
                "Enquiry connection error:",
                error
            );

            alert(
                "Cannot connect to the Spring Boot server."
            );
        }
    });
}