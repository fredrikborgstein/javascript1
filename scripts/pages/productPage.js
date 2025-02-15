import {generateFeaturedSection, getOneProduct} from "../utils/apiFunctions.js";
import {buildProductPage} from "../utils/products.js";
import Toaster from "../components/toaster.js";
import {addToCart} from "../utils/cart.js";

const toaster = new Toaster();

function getProductIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function initProductPage() {
    const productId = getProductIdFromUrl();
    const product = await getOneProduct(productId);
    buildProductPage(product.data);
    const genre = product.data.genre;

    await generateFeaturedSection(genre, productId);
    return productId;

}

const productId =  await initProductPage();

const addToCartBtn = document.getElementById("purchase-button");
addToCartBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    addToCart(productId);
})


