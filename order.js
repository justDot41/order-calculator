document.addEventListener("DOMContentLoaded", () => {
    const dishSelects = document.querySelectorAll(".dish-select");
    const totalDisplay = document.getElementById("totalAmount");
    const submitBtn = document.getElementById("submitOrder");
    const dishCountsContainer = document.querySelector(".dish-counts");

    let dishes = [];

    // Add default option to all selects
    dishSelects.forEach(select => {
        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Нічого";
        select.appendChild(defaultOption);
    });

    // Load dishes
    db.collection("dishes").onSnapshot(snapshot => {
        dishes = [];
        dishSelects.forEach(select => select.innerHTML = ""); // Clear first
        
        // Add default option back
        dishSelects.forEach(select => {
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Нічого";
            select.appendChild(defaultOption);
        });

        snapshot.forEach(doc => {
            const data = doc.data();
            dishes.push({ id: doc.id, ...data });
            
            // Add to all selects
            dishSelects.forEach(select => {
                const option = document.createElement("option");
                option.value = doc.id;
                option.textContent = `${data.name} (${data.price} грн)`;
                select.appendChild(option);
            });
        });
    });

    // Live total calculation with counts
    function updateTotal() {
        const selectedIds = [...dishSelects].map(s => s.value).filter(id => id);
        const selectedDishes = dishes.filter(d => selectedIds.includes(d.id));
        
        // Count occurrences
        const counts = {};
        selectedIds.forEach(id => counts[id] = (counts[id] || 0) + 1);
        
        // Display counts
        dishCountsContainer.innerHTML = "";
        Object.entries(counts).forEach(([id, count]) => {
            const dish = dishes.find(d => d.id === id);
            if (dish) {
                const div = document.createElement("div");
                div.className = "dish-count";
                div.textContent = `${dish.name}: ${count} шт.`;
                dishCountsContainer.appendChild(div);
            }
        });

        // Calculate total
        const total = selectedDishes.reduce((sum, d) => sum + d.price, 0);
        totalDisplay.textContent = total;
    }

    // Event listener for selects
    dishSelects.forEach(select => {
        select.addEventListener("change", updateTotal);
    });

    // Submit order
    submitBtn.addEventListener("click", () => {
        const order = {
            name: document.getElementById("clientName").value,
            dishIds: [...dishSelects].map(s => s.value).filter(id => id),
            comment: document.getElementById("comment").value,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        db.collection("orders").add(order);
        alert("Замовлення надіслано!");
    });
});