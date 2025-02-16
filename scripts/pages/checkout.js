import Toaster from "../components/toaster.js";
import Modal from "../components/modal.js";
import {emptyCart, getCartFromStorage, getCartTotalPrice} from "../utils/cart.js";
import {getProductDetails} from "../utils/utils.js";
import Spinner from "../components/Spinner.js";

const toast = new Toaster();
const spinner = new Spinner('#cart-summary');
const modal = new Modal();

const submitBtn = document.getElementById("checkout-btn");
const cartSummary = document.getElementById("cart-summary");
const priceP = document.getElementById("pay-price");
const normalShippingBtn = document.getElementById("normal");
const expressShippingBtn = document.getElementById("express");


let shipping = 'normal';
const purchaseId = Math.random().toString(36);
const totalPrice = getCartTotalPrice();
const roundedPrice = parseFloat(totalPrice.toFixed(2));

priceP.innerText = `Total price ${roundedPrice} $`;

async function updateProductSummary() {
    spinner.show();
    const cartData = getCartFromStorage();
    const products = await getProductDetails(cartData);
    cartSummary.innerHTML = '';
    for (const product of products) {
        const productData = product.data;
        const summaryItems = document.createElement('p');
        summaryItems.innerText = `${product.quantity} x ${productData.title}`;
        cartSummary.appendChild(summaryItems);
    }
    spinner.hide();
    return products;
}

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const nameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email-address");
    const phoneInput = document.getElementById("phone-number");
    const addressInput = document.getElementById("street-address");
    const zipInput = document.getElementById("zip-code");
    const cityInput = document.getElementById("city-input");
    const termsCheckbox = document.getElementById("terms");


    const name = nameInput.value;
    const email = emailInput.value;
    const phone = phoneInput.value;
    const address = addressInput.value;
    const zipCode = zipInput.value;
    const cityCode = cityInput.value;

    if (!termsCheckbox.checked) {
        toast.show('You need to accept the terms and conditions', 'error');
        return;
    };

    const purchase = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        zipCode: zipCode,
        cityCode: cityCode,
        shipping: shipping,
        products: JSON.stringify(products),
    };

    localStorage.setItem(purchaseId, JSON.stringify(purchase));
    modal.show({
        title: 'Thank you!',
        message: 'We appreciate your order! You will soon receive an email with further information about your purchase, and your invoice',
        confirmText: 'Ok',
        onConfirm: () => {
           nameInput.value = '';
           emailInput.value = '';
           phoneInput.value = '';
           addressInput.value = '';
           zipInput.value = '';
           cityInput.value = '';
           termsCheckbox.checked = false;
           products = [];
           shipping = '';

           emptyCart();

           window.location.href = '/';
        }
    });

    emptyCart();
});

normalShippingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    normalShippingBtn.classList.add('active');
    expressShippingBtn.classList.remove('active');
    normalShippingBtn.innerHTML = `<i class="fa-regular fa-circle-check"></i>Normal`;
    expressShippingBtn.innerHTML = `<i class="fa-regular fa-circle"></i>Express`;
    shipping = 'normal';
});

expressShippingBtn.addEventListener("click", (e) => {
    e.preventDefault();
    expressShippingBtn.classList.add('active');
    normalShippingBtn.classList.remove('active');
    normalShippingBtn.innerHTML = `<i class="fa-regular fa-circle"></i>Normal`;
    expressShippingBtn.innerHTML = `<i class="fa-regular fa-circle-check"></i>Express`;
    shipping = 'express';
});

let products = await updateProductSummary();
