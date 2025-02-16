import {updateCartCount} from "../index.js";

const CART_STORAGE_KEY = 'shoppingCart';

export function getCartFromStorage() {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);

    return cartData ? JSON.parse(cartData) : [];
}

function saveCartToStorage(cart) {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

export function addToCart(productId, price) {
    const cart = getCartFromStorage();
    const existingItem = cart.find((item) => item.productId === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ productId: productId, quantity: 1, price: price });
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
    return cart;
}

export function increaseQuantity(productId) {
    const cart = getCartFromStorage();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
        item.quantity++;
        saveCartToStorage(cart);
    }
    updateCartCount();
    return cart;
}

export function decreaseQuantity(productId) {
    const cart = getCartFromStorage();
    const item = cart.find((item) => item.productId === productId);

    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            return removeFromCart(productId);
        }
        saveCartToStorage(cart);
    }
    updateCartCount();
    return cart;
}

export function initCart() {
    return getCartFromStorage();
}

export function getCartTotalPrice() {
    const cart = getCartFromStorage();
    let total = 0;

    cart.forEach((item) => {
        total += item.quantity * item.price;
    });

    return total;
}

export function emptyCart() {
    localStorage.removeItem(CART_STORAGE_KEY);
}

