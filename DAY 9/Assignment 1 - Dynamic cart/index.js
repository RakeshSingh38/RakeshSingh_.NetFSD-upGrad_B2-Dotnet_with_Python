let cart = [];

// note     either on parent or child i.e add-btn

function renderProducts(products) {

    const section = document.getElementById("products");
    section.innerHTML = "";
    products.forEach((p) => {
        const div = document.createElement("div");
        div.className = "product";
        div.id = p.id;
        div.innerHTML = `
            <img src="${p.image}" alt="${p.name}" width="60" />
            <span>${p.name} - ₹${p.price}</span>
            <button class="add-btn">Add to cart</button>
        `;
        section.appendChild(div);
    });
}

async function fetchProducts() {
    const response = await fetch("products.json");
    const data = await response.json();

    return data;
}

fetchProducts().then((p) => {
    console.log(p);
    renderProducts(p);

    addProdToCart(p);
});

function addProdToCart(products) {
    const totalPrice = document.querySelector(".total-price");
    const productSection = document.getElementById("products");

    productSection.addEventListener("click", (e) => {
        const productDiv = e.target.closest(".product");
        const id = productDiv.id;
        const prod = products.find((p) => p.id == id);

        cart.push(prod);
        console.log("added", prod.name,prod);
        updateTotal();
    });

    function updateTotal() {
        const total = cart.reduce((sum, p) => sum + p.price, 0);
        totalPrice.textContent = total;
    }
}

