let cart = [];

$.getJSON("products.json", function (products) {
    renderProducts(products);
});

function renderProducts(products) {
    let $section = $("#products");
    $section.empty();

    products.forEach(function (p) {
        let $card = $(
            '<div class="product">'
            + '<img width="60" />'
            + '<span class="prod-info"></span>'
            + '<button class="add-btn">Add to Cart</button>'
            + '<span class="confirm-msg" style="color:green;margin-left:8px;"></span>'
            + '</div>'
        );

        $card.attr("id", p.id);
        $card.find("img").attr("src", p.image).attr("alt", p.name);

        $card.find(".prod-info").text(p.name + " - ₹" + p.price);

        $section.append($card);
    });

    $section.on("click", ".add-btn", function () {
        let $btn = $(this);
        let $card = $btn.closest(".product");
        let id = $card.attr("id");
        let prod = products.find(function (p) { return p.id == id; });

        cart.push(prod);

        $btn.prop("disabled", true);

        $card.find(".confirm-msg").text("Added");

        updateCounter();
        updateTotal();
    });
}

function updateCounter() {
    let count = cart.length;
    $("#cart-counter").text("(" + count + " item" + (count === 1 ? "" : "s") + " in cart)");
}

function updateTotal() {
    let total = cart.reduce(function (sum, p) { return sum + p.price; }, 0);
    $(".total-price").text(total);
}


