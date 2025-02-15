import { fetchAllProducts } from '../utils/apiFunctions.js';
import { buildAllProducts } from '../utils/products.js';

const genreFilter = document.getElementById('genre');
const sortBy = document.getElementById('sortby');
const searchBox = document.getElementById('search');
const clearFilterBtn = document.getElementById('clear-filter');
let allProducts = [];
let filteredProducts = [];

async function initAllProductsPage() {
    try {
        const productsData = await fetchAllProducts();

        console.log('productsData:', productsData);

        if (productsData && productsData.data) {
            allProducts = productsData.data;
            filteredProducts = [...allProducts];

            buildAllProducts(allProducts);
            populateGenreDropDown(allProducts);
        } else {
            console.warn('No products data received or data is empty.');
        }
    } catch (error) {
        console.error('Error initializing all products page:', error);
    }
}

function populateGenreDropDown(products) {
    genreFilter.innerHTML = '';
    const defaultOption = createOption('Genre', 'Genre', true, true);
    genreFilter.appendChild(defaultOption);

    const allOption = createOption('All', 'All', false, false);
    genreFilter.appendChild(allOption);

    const genres = [...new Set(products.map((product) => product.genre))];
    genres.forEach((genre) => {
        const option = createOption(genre, genre);
        genreFilter.appendChild(option);
    });
}

function createOption(value, text, disabled = false, selected = false) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    if (disabled) option.setAttribute('disabled', true);
    if (selected) option.setAttribute('selected', true);
    return option;
}

function sortProducts(sortBy, products) {
    const sortedProducts = [...products];
    switch (sortBy) {
        case 'price':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'popularity':
            sortedProducts.sort((a, b) => b.favorite - a.favorite);
            break;
        case 'release':
            sortedProducts.sort((a, b) => parseInt(b.released) - parseInt(a.released));
            break;
        case 'name':
        default:
            sortedProducts.sort((a, b) => {
                const nameA = a.title.trim().toLowerCase();
                const nameB = b.title.trim().toLowerCase();
                return nameA.localeCompare(nameB);
            });
            break;
    }

    buildAllProducts(sortedProducts);
}

let dropdown = document.getElementById('search-dropdown');
if (!dropdown) {
    dropdown = document.createElement('div');
    dropdown.id = 'search-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.backgroundColor = '#fff';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.width = '200px';
    dropdown.style.color = 'black';
    dropdown.style.display = 'none';
    dropdown.style.left = '10';
    dropdown.style.top = '100%';
    document.getElementById('search').parentElement.style.position =
        'relative';
    document.getElementById('search').parentElement.appendChild(dropdown);
}

function showDropdownSuggestions(query, products) {
    dropdown.innerHTML = '';

    if (!query.trim()) {
        dropdown.style.display = 'none';
        return;
    }

    const matches = products.filter((product) =>
        product.title.toLowerCase().includes(query)
    );

    matches.forEach((product) => {
        const suggestion = document.createElement('div');
        suggestion.textContent = product.title;
        suggestion.style.padding = '8px';
        suggestion.style.cursor = 'pointer';
        suggestion.addEventListener('click', () => {
            searchBox.value = product.title;
            dropdown.style.display = 'none';
            filterProductsBySearch(product.title);
        });
        dropdown.appendChild(suggestion);
    });

    dropdown.style.display = matches.length > 0 ? 'block' : 'none';
}

function clearFilters() {
    genreFilter.value = 'All';
    sortBy.value = 'name';
    searchBox.value = '';

    filteredProducts = [...allProducts];

    dropdown.innerHTML = '';
    dropdown.style.display = 'none';

    buildAllProducts(allProducts);
}

function filterProductsBySearch(query) {
    if (!query.trim()) {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter((product) =>
            product.title.toLowerCase().includes(query.toLowerCase())
        );
    }
    buildAllProducts(filteredProducts);
}

void initAllProductsPage();

genreFilter.addEventListener('change', (e) => {
    e.preventDefault();
    const selectedGenre = e.target.value;

    if (selectedGenre === 'All') {
        filteredProducts = [...allProducts];
    } else {
        filteredProducts = allProducts.filter(
            (product) => product.genre === selectedGenre
        );
    }

    buildAllProducts(filteredProducts);
});

sortBy.addEventListener('change', (e) => {
    e.preventDefault();
    sortProducts(e.target.value, filteredProducts);
});

searchBox.addEventListener('input', (e) => {
    const dropdownSelection = document.getElementById('search-dropdown');
    dropdownSelection.style.display = 'block';
    const query = e.target.value.toLowerCase();
    showDropdownSuggestions(query, allProducts);
});

searchBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        filterProductsBySearch(searchBox.value);
        dropdown.style.display = 'none';
    }
});

clearFilterBtn.addEventListener('click', (e) => {
    e.preventDefault();
    clearFilters();
});
