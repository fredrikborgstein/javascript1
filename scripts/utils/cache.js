import Toaster from "../components/toaster.js";

const CACHE_EXPIRATION = 60 * 60 * 1000;
const ALL_PRODUCTS_CACHE_KEY = 'allProducts';
const toast = new Toaster();

function isCacheValid(cacheKey, expirationTime = CACHE_EXPIRATION) {
    const cachedTimestamp = localStorage.getItem(`${cacheKey}-timestamp`);

    if (!cachedTimestamp) {
        return false;
    }

    const now = Date.now();
    return now - parseInt(cachedTimestamp, 10) < expirationTime;
}

function getCache(cacheKey) {
    const cachedData = localStorage.getItem(cacheKey);

    if (!cachedData) {
        return null;
    }

    try {
        return JSON.parse(cachedData);
    } catch (error) {
        toast.show(`Error parsing cached data for key "${cacheKey}": ${error.message}`, 'error')
        localStorage.removeItem(cacheKey);
        localStorage.removeItem(`${cacheKey}-timestamp`);
        return null;
    }
}


export function cacheAllProducts(data) {
    try {
        localStorage.setItem(ALL_PRODUCTS_CACHE_KEY, JSON.stringify(data));
        localStorage.setItem(`${ALL_PRODUCTS_CACHE_KEY}-timestamp`, Date.now().toString());
    } catch (error) {
        toast.show(`Error caching all products: ${error.message}`, 'error');
    }
}

export function cacheOneProduct(data, productId) {
    try {
        localStorage.setItem(productId, JSON.stringify(data));
        localStorage.setItem(`${productId}-timestamp`, Date.now().toString());
    } catch (error) {
        toast.show(`Error caching product with ID: ${productId} -  ${error.message}`, 'error');
    }
}

export function checkAllProductsCache() {
    return isCacheValid(ALL_PRODUCTS_CACHE_KEY);
}

export function checkOneProduct(productId) {
    return isCacheValid(productId);
}

export function getAllProductsCache() {
    return getCache(ALL_PRODUCTS_CACHE_KEY);
}

export function getOneProductFromCache(productId) {
    return getCache(productId);
}
