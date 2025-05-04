const ADMIN_PASSWORD = "admin123"; // Simple hardcoded password

document.addEventListener("DOMContentLoaded", () => {
    const dishName = document.getElementById("dishName");
    const dishPrice = document.getElementById("dishPrice");
    const saveDishBtn = document.getElementById("saveDish");
    const dishList = document.getElementById("availableDishes");
    const orderLogs = document.getElementById("orderLogs");

    // Password protected admin
    const enteredPassword = prompt("Введіть пароль адміністратора:");
    if (enteredPassword !== ADMIN_PASSWORD) {
        document.body.innerHTML = "<h2>Доступ заборонено</h2>";
        return;
    }

    // Save new dish
    saveDishBtn.addEventListener("click", () => {
        if (dishName.value && dishPrice.value) {
            db.collection("dishes").add({
                name: dishName.value,
                price: parseFloat(dishPrice.value)
            });
            dishName.value = "";
            dishPrice.value = "";
        }
    });

    // Load and display dishes with edit/delete
    db.collection("dishes").onSnapshot(snapshot => {
        dishList.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const li = document.createElement("li");
            li.className = "dish-item";
            
            li.innerHTML = `
                <span>${data.name} - ${data.price} грн</span>
                <div class="dish-actions">
                    <button onclick="editDish('${doc.id}', '${data.name}', ${data.price})">Редагувати</button>
                    <button onclick="deleteDish('${doc.id}')">Видалити</button>
                </div>
            `;
            dishList.appendChild(li);
        });
    });

    // Edit dish function
    window.editDish = (id, currentName, currentPrice) => {
        const newName = prompt("Введіть нову назву страви:", currentName);
        const newPrice = prompt("Введіть нову ціну:", currentPrice);
        
        if (newName && newPrice) {
            db.collection("dishes").doc(id).update({
                name: newName,
                price: parseFloat(newPrice)
            });
        }
    };

    // Delete dish function
    window.deleteDish = (id) => {
        if (confirm("Ви впевнені, що хочете видалити цю страву?")) {
            const password = prompt("Підтвердіть паролем адміністратора:");
            if (password === ADMIN_PASSWORD) {
                db.collection("dishes").doc(id).delete();
            }
        }
    };

    // Load recent orders
    db.collection("orders").orderBy("timestamp", "desc").limit(20).onSnapshot(snapshot => {
        orderLogs.innerHTML = "";
        snapshot.forEach(doc => {
            const data = doc.data();
            const div = document.createElement("div");
            div.innerHTML = `<small>${new Date(data.timestamp.seconds * 1000).toLocaleString()}</small><br>${data.name}`;
            orderLogs.appendChild(div);
        });
    });

    window.deleteAllOrders = () => {
        const password = prompt("Підтвердіть паролем адміністратора:");
        if (password === ADMIN_PASSWORD) {
            if (confirm("Ви впевнені, що хочете видалити ВСІ замовлення?")) {
                db.collection("orders").get().then(snapshot => {
                    snapshot.forEach(doc => {
                        doc.ref.delete();
                    });
                    alert("Всі замовлення видалено");
                });
            }
        } else {
            alert("Неправильний пароль");
        }
    };
});