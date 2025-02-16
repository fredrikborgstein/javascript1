import {generateFeaturedSection, getOneProduct} from "../utils/apiFunctions.js";
import {buildProductPage} from "../utils/products.js";
import Toaster from "../components/toaster.js";
import {addToCart} from "../utils/cart.js";
import Spinner from "../components/spinner.js";

const toast = new Toaster();
const spinner = new Spinner('#product-info');

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function initProductPage() {
    spinner.show();
    const productId = getProductIdFromUrl();
    const product = await getOneProduct(productId);
    const price = product.data.discountedPrice ?? product.data.price;
    buildProductPage(product.data);
    const genre = product.data.genre;
    document.title = `Gamehub - ${product.data.title}`;

    const cartData = {productId, price};

    await generateFeaturedSection(genre, productId);
    spinner.hide();
    return cartData;

}

const cartData =  await initProductPage();

const addToCartBtn = document.getElementById("purchase-button");
let cartAdded = false;

addToCartBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    if (cartAdded) {
        return;
    }

    try {
        await addToCartHandler(cartData.productId, cartData.price);
        updateButtonState("success");
        cartAdded = true;
        setTimeout(resetButtonState, 3000);
    } catch (error) {
        toast.show("Failed to add to cart. Please try again.", "error");
    }
});

function addToCartHandler(productId, price) {
    try {
        addToCart(productId, price);
        toast.show("Added to cart!", "success");
    } catch (error) {
        toast.show("Failed to add to cart. Please try again.", "error");
        throw error;
    }
}

function updateButtonState(state) {
    if (state === "success") {
        addToCartBtn.innerHTML =
            '<i class="fa-regular fa-circle-check" style="color:black;margin-right:4px;"></i>Added to cart!';
        addToCartBtn.style.background = "green";
        addToCartBtn.disabled = true;
    } else if (state === "reset") {
        addToCartBtn.innerHTML =
            '<i class="fa-solid icon fa-cart-shopping" style="color: black; margin-right: 4px;"></i>Go to cart';
        addToCartBtn.style.background = "#cfa616";
    }
}

function resetButtonState() {
    updateButtonState("reset");
    addToCartBtn.disabled = false;

    addToCartBtn.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/cart.html";
    });
}
