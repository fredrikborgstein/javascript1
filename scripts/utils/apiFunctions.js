import Toaster from '../components/toaster.js';
import {
    cacheAllProducts,
    cacheOneProduct,
    checkAllProductsCache,
    checkOneProduct,
    getAllProductsCache,
    getOneProductFromCache,
} from './cache.js';

const apiUrl = 'https://v2.api.noroff.dev/gamehub';
const toast = new Toaster();

export async function fetchAllProducts() {
    try {
        if (checkAllProductsCache()) {
            return getAllProductsCache();
        }

        const request = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!request.ok) {
            const message = `HTTP error! Status: ${request.status}`;
            toast.show(message, 'error');
            throw new Error(message);
        }

        const response = await request.json();

        cacheAllProducts(response);
        return response;
    } catch (error) {
        toast.show(error.message, 'error');
        throw error;
    }
}

export async function getOneProduct(productId) {
    try {
        if (checkOneProduct(productId)) {
            return getOneProductFromCache(productId);
        }
        const request = await fetch(`${apiUrl}/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });

        if (!request.ok) {
            const message = `HTTP error! Status: ${request.status}`;
            toast.show(message, 'error');
        }

        const response = await request.json();
        cacheOneProduct(response, productId);

        return await response;
    } catch (error) {
        toast.show(error.message, 'error');
        throw error;
    }
}

export async function generateFeaturedSection(genre, productId) {
    const featuredGrid = document.getElementById('featured-grid');

    if (!featuredGrid) return;
    featuredGrid.innerHTML = '';

    try {
        const data = await fetchAllProducts();
        const games = data.data || [];
        const relatedGames = games.filter(
            (game) => game.genre === genre && game.id !== productId
        );

        if (relatedGames.length === 0) {
            const noGamesMessage = document.createElement('p');
            noGamesMessage.innerText = "No similar games available.";
            featuredGrid.appendChild(noGamesMessage);
            return;
        }

        relatedGames.forEach((game) => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.height = '400px';

            card.innerHTML = `
                <div class="card-title">
                    <h3>${game.title}</h3>
                </div>
                <div class="card-image">
                    <img src="${game.image.url}" alt="${game.image.alt || `The cover of the game ${game.title}`}" />
                </div>
                <div class="card-info">
                    <p>${game.genre}</p>
                    <p>${game.price} $</p>
                </div>
                <div class="card-button">
                    <a href="/product.html?id=${game.id}" class="card-text">View Details</a>
                </div>
            `;
            featuredGrid.appendChild(card);
        });
    } catch (error) {
        toast.show("Failed to load related games. Please try again later.", "error", 5000);
    }
}