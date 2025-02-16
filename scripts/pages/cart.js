import Toaster from "../components/toaster.js";
import {
    decreaseQuantity,
    getCartFromStorage,
    getCartTotalPrice,
    increaseQuantity,
    removeFromCart
} from "../utils/cart.js";
import {getOneProduct} from "../utils/apiFunctions.js";
import {buildCart} from "../utils/products.js";
import {getProductDetails} from "../utils/utils.js";

const cartContainer = document.getElementById('cart-content');
const cartItems = document.getElementById('cart-items');
const cartPrice = document.getElementById('cart-price');

const toast = new Toaster();

cartContainer.innerHTML = '';
cartItems.innerHTML = '';
cartPrice.innerHTML = '';


function addEventListeners() {
    const removeBtns = document.querySelectorAll('.remove-btn');
    const increaseBtns = document.querySelectorAll('.increase-btn');
    const decreaseBtns = document.querySelectorAll('.decrease-btn');
    const checkoutBtn = document.getElementById('checkout-btn');

    checkoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/checkout.html';
    })

    removeBtns.forEach(el => {
        el.addEventListener('click', async(e) => {
            e.preventDefault();
            const productId = el.dataset.productid;
            removeFromCart(productId);
            const card = document.getElementById(productId);
            if (card) {
                card.remove();
                toast.show('Product removed from cart', 'warning');
                updatePrice();
                await updateProductSummary();
            }
        });
    });

    increaseBtns.forEach(el => {
        el.addEventListener('click', async(e) => {
            e.preventDefault();
            const productId = el.dataset.productid;
            increaseQuantity(productId);

            const card = document.getElementById(productId);
            if (card) {
                const quantityCounter = card.querySelector('.quantity-counter');
                const cart = getCartFromStorage();
                const item = cart.find(item => item.productId === productId);
                const newQuantity = item ? item.quantity : 0;
                quantityCounter.innerText = `Quantity: ${newQuantity}`;
                toast.show('Product added successfully.', 'success');
                updatePrice();
                await updateProductSummary();
            }
        });
    });

    decreaseBtns.forEach(el => {
        el.addEventListener('click', async (e) => {
            e.preventDefault();
            const productId = el.dataset.productid;
            decreaseQuantity(productId);

            const card = document.getElementById(productId);
            if (card) {
                const quantityCounter = card.querySelector('.quantity-counter');
                const cart = getCartFromStorage();
                const item = cart.find(item => item.productId === productId);
                const newQuantity = item ? item.quantity : 0;


                if (newQuantity === 0) {
                    card.remove();
                    toast.show('Product removed from cart', 'warning');
                } else {
                    quantityCounter.innerText = `Quantity: ${newQuantity}`;
                    toast.show('Product removed successfully', 'warning');
                }

                updatePrice();
                await updateProductSummary();
            }
        });
    });
}

function updatePrice() {
    const priceSummary = document.querySelector('.price-summary');
    const totalPrice = getCartTotalPrice();
    const roundedPrice = parseFloat(totalPrice.toFixed(2));
    priceSummary.innerText = `Total price ${roundedPrice} $`;
}

async function updateProductSummary() {
    const cartData = getCartFromStorage();
    const products = await getProductDetails(cartData);
    cartItems.innerHTML = '';
    for (const product of products) {
        const productData = product.data;
        const summaryItems = document.createElement('p');
        summaryItems.innerText = `${product.quantity} x ${productData.title}`;
        cartItems.appendChild(summaryItems);
    }
}

async function initCartPage() {
    const cartData = getCartFromStorage();
    const cartProducts = await getProductDetails(cartData);
    if (cartProducts.length === 0) {
        cartContainer.innerHTML = `<div>
                                        <p>No products in the cart!</p>
                                        <button id="no-products">Browse Products</button>
                                    </div>`;

        document.getElementById('no-products').addEventListener('click', event => {
            event.preventDefault();
            window.location.href = '/allproducts.html';
        });

        document.getElementById('checkout-btn').style.display = 'none';
        cartItems.innerHTML = '<p>No products!</p>';
    } else {
        buildCart(cartProducts);
        addEventListeners();
    }

    return cartProducts;
}

await initCartPage();

