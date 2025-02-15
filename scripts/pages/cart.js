import Toaster from "../components/toaster.js";
import {getCartFromStorage} from "../utils/cart.js";
import {getOneProduct} from "../utils/apiFunctions.js";
import {buildCart} from "../utils/products.js";

const cartContainer = document.getElementById('cart-content');
const cartItems = document.getElementById('cart-items');
const cartPrice = document.getElementById('cart-price');

const toast = new Toaster();

cartContainer.innerHTML = '';
cartItems.innerHTML = '';
cartPrice.innerHTML = '';

async function getProductDetails(cartData) {
    const cartProducts = [];

    for (const item of cartData) {
        try {
            const product = await getOneProduct(item.productId);
            if (product) {
                cartProducts.push({ ...product, quantity: item.quantity });
            } else {
                console.warn(`Product with ID ${item.productId} not found.`);
            }
        } catch (error) {
            console.error(`Error fetching product details for ID ${item.productId}:`, error);
        }
    }

    return cartProducts;
}

function addEventListeners() {
    const removeBtns = document.querySelectorAll('.remove-btn');
    const increaseBtns = documentdw
}


async function initCartPage() {
    const cartData = getCartFromStorage();
    const cartProducts = await getProductDetails(cartData);
    if (cartProducts.length === 0) {
        console.log('No products');
    } else {
        buildCart(cartProducts);
    }
}

await initCartPage();

