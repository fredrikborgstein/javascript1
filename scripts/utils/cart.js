// --- Constants ---
import {updateCartCount} from "../index.js";

const CART_STORAGE_KEY = 'shoppingCart';

// --- Utility Functions ---
export function getCartFromStorage() {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);

    return cartData ? JSON.parse(cartData) : [];
}

function saveCartToStorage(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

// --- Cart Management Functions ---
export function getCart() {
    return getCartFromStorage();
}

export function addToCart(productId) {
    const cart = getCartFromStorage();
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1 });
    }

    saveCartToStorage(cart);
    updateCartCount();
    return cart;
}

export function removeFromCart(productId) {
    let cart = getCartFromStorage();
    cart = cart.filter((item) => item.productId !== productId);

    saveCartToStorage(cart);
    updateCartCount();
    return cart; // Return the updated cart
}

export function increaseQuantity(productId) {
    const cart = getCartFromStorage();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
        item.quantity++;
        saveCartToStorage(cart);
    }
    updateCartCount();
    return cart; // Return the updated cart
}

export function decreaseQuantity(productId) {
    const cart = getCartFromStorage();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            // Remove the item if the quantity is 1
            return removeFromCart(productId);
        }
        saveCartToStorage(cart);
    }
    updateCartCount();
    return cart; // Return the updated cart
}

export function clearCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
    updateCartCount();
    return []; // Return an empty cart
}

export function getCartTotal() {
    const cart = getCartFromStorage();
    let total = 0;

    // Assuming you have a function to get the price of a product
    cart.forEach(item => {
        const productPrice = getProductPrice(item.productId); // Replace with your actual function
        total += productPrice * item.quantity;
    });

    return total;
}

// --- Initialization Function ---
export function initCart() {
    return getCartFromStorage();
}

// --- Helper Function (Replace with your actual implementation) ---
function getProductPrice(productId) {
    // This is a placeholder - replace with your actual logic to fetch the product price
    // from your data source (e.g., an API or a local data file)
    // For example:
    // const product = products.find(p => p.id === productId);
    // return product ? product.price : 0;
    console.warn(`getProductPrice(${productId}) is not implemented!`);
    return 10; // Default price for testing
}
