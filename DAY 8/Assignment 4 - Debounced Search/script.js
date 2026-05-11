const state = {
    products: [
        { id: 1, name: "Nike Air Max" },
        { id: 2, name: "Adidas Ultraboost" },
        { id: 3, name: "Puma Suede Classic" },
        { id: 4, name: "Reebok Classic Leather" },
        { id: 5, name: "New Balance 990v5" },
        { id: 6, name: "Asics Gel-Kayano" },
        { id: 7, name: "Converse Chuck Taylor" },
        { id: 8, name: "Vans Old Skool" },
        { id: 9, name: "Under Armour HOVR" },
        { id: 10, name: "Saucony Jazz Original" },
        { id: 11, name: "Fila Disruptor" },
        { id: 12, name: "Skechers D'Lites" },
        { id: 13, name: "Brooks Ghost" },
        { id: 14, name: "Mizuno Wave Rider" },
        { id: 15, name: "Jordan Air 1" },
    ],
    filteredProduct: [],
};

const searchInput = document.getElementById("searchInput");

const productList = document.getElementById("productList");

function renderShoes(products) {
    productList.innerHTML = "";

    if (products.length === 0) {
        productList.innerHTML = "<li>No Search Results</li>";
        return;
    }

    products.forEach((product) => {
        const li = document.createElement("li");
        li.innerText = product.name;
        productList.appendChild(li);
    });
}

let debounceSearch;
function filterShoes(query) {
    clearTimeout(debounceSearch);
    debounceSearch = setTimeout(() => {
        state.filteredProduct = state.products.filter((product) => {
            return product.name.toLowerCase().includes(query.toLowerCase());
        });
        renderShoes(state.filteredProduct);
    }, 200);
}
renderShoes(state.products);


searchInput.addEventListener("input", (event) => {
    const query = event.target.value;

    filterShoes(query);
});
