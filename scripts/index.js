import { fetchAllProducts } from './utils/apiFunctions.js';
import initSession from './utils/session.js';
import { buildBestsellers, buildNewReleases } from './utils/products.js';
import { loadHeaderAndFooter } from './utils/utils.js';
import { getCartFromStorage } from './utils/cart.js';

function updateCartCount() {
    const cart = getCartFromStorage();
    let itemCount = 0;

    cart.forEach((item) => {
        itemCount += item.quantity;
    });

    console.log('Cart count:', itemCount);

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
            console.warn('No products data received or data is empty.');
        }
    } catch (error) {
        console.error('Error initializing home page:', error);
    }
}

async function initPage() {
    initSession();

    try {
        await loadHeaderAndFooter();
        updateCartCount();

        if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
            await initHomePage();
        }
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

(async () => {
    document.addEventListener('DOMContentLoaded', async () => {
        try {
            await initPage();
            console.log('Page initialized successfully.');
        } catch (error) {
            console.error('Error during page initialization:', error);
        }
    });
})();
