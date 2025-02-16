import { fetchAllProducts } from './utils/apiFunctions.js';
import initSession from './utils/session.js';
import { buildBestsellers, buildNewReleases } from './utils/products.js';
import {becomeMemberForm, loadHeaderAndFooter, submitContactForm, subscribeToNewsletter} from './utils/utils.js';
import { getCartFromStorage } from './utils/cart.js';
import Toaster from "./components/toaster.js";


const toast = new Toaster();

function updateCartCount() {
    const cart = getCartFromStorage();
    let itemCount = 0;

    cart.forEach((item) => {
        itemCount += item.quantity;
    });

    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = itemCount.toString();
    }
}

export { updateCartCount };

async function initHomePage() {
    try {
        const products = await fetchAllProducts();

        if (products && products.data) {
            buildBestsellers(products.data);
            buildNewReleases(products.data);
        } else {
            toast.show('No products found.', 'error');
        }
    } catch (error) {
        toast.show(error.message, 'error');
    }
}

async function initPage() {
    initSession();

    try {
        await loadHeaderAndFooter();
        updateCartCount();

        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            await initHomePage();
            document.getElementById('members-section-btn').addEventListener('click', event => {
                event.preventDefault();
                becomeMemberForm();
            });
            document.getElementById('hero-btn').addEventListener('click', event => {
                event.preventDefault();
                becomeMemberForm();
            })
        } else if(window.location.pathname === '/contact.html') {
            document.getElementById('contact-form-button').addEventListener('click', event => {
                event.preventDefault();
                submitContactForm();
            });
        }
    } catch (error) {
        toast.show(error.message, 'error');
    }
}

(async () => {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await initPage();
            document.getElementById('newsletter-button').addEventListener('click',  (e) => {
                e.preventDefault();
                subscribeToNewsletter();
            });
        } catch (error) {
            toast.show(error.message, 'error');
        }
    });
})();
