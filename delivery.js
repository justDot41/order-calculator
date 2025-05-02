document.addEventListener("DOMContentLoaded", () => {
    const dishTotalsList = document.getElementById("dishTotals");
    const grandTotalEl = document.getElementById("grandTotal");
    const ordersContainer = document.getElementById("ordersContainer");

    db.collection("orders").onSnapshot(async snapshot => {
        const orders = [];
        let grandTotal = 0;
        const dishCounts = {};

        // Get all dishes
        const dishSnapshot = await db.collection("dishes").get();
        const dishes = {};
        dishSnapshot.forEach(doc => {
            dishes[doc.id] = doc.data();
        });

        // Process orders
        snapshot.forEach(doc => {
            const data = doc.data();
            orders.push({ id: doc.id, ...data });

            // Aggregate dish counts
            data.dishIds.forEach(dishId => {
                if (!dishCounts[dishId]) dishCounts[dishId] = { count: 0, price: dishes[dishId]?.price || 0 };
                dishCounts[dishId].count += 1;
                grandTotal += dishes[dishId]?.price || 0;
            });
        });

        // Update totals
        dishTotalsList.innerHTML = "";
        Object.entries(dishCounts).forEach(([id, info]) => {
            const li = document.createElement("li");
            li.textContent = `${dishes[id]?.name} ×${info.count} = ${info.count * info.price} грн`;
            dishTotalsList.appendChild(li);
        });

        grandTotalEl.textContent = grandTotal;

        // Show individual orders
        ordersContainer.innerHTML = "";
        orders.forEach(order => {
            const div = document.createElement("div");
            div.className = "order-card";
            div.innerHTML = `
                <strong>${order.name}</strong><br>
                Страви: ${order.dishIds.map(id => dishes[id]?.name).join(", ")}<br>
                Коментар: ${order.comment || "—"}<br>
                Сума: ${order.dishIds.reduce((sum, id) => sum + (dishes[id]?.price || 0), 0)} грн
            `;
            ordersContainer.appendChild(div);
        });
    });
});