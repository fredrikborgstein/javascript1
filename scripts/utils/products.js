import {getCartTotalPrice} from "./cart.js";
import Toaster from "../components/toaster.js";

const toast = new Toaster();

export function buildAllProducts(products) {
    const productContainer = document.getElementById('product-grid');
    productContainer.innerHTML = '';
    buildProductCard(products, 'product-grid');
}

export function buildProductPage(product) {
    const image = document.getElementById('product-image');
    const title = document.getElementById('product-title');
    const productDescription = document.getElementById('product-description');
    const productPrice = document.getElementById('product-purchase');
    const productInfo = document.getElementById('product-rating');
    const productMisc = document.getElementById('product-misc');
    let price;

    if (product.discountedPrice) {
         price = product.discountedPrice;
    } else {
         price = product.price;
    }

    image.src = product.image.url;
    image.alt = product.image.alt;

    if (product.onSale) {
        title.innerHTML += `<span style="background-color: yellow; color: black; font-size: 0.8em; padding: 4px 10px; border-radius: 3px; margin-left: 5px; vertical-align: middle; display: inline-block; font-weight: bold;">On Sale!</span>`;
    }

    title.innerHTML += `<h1>${product.title}</h1>`;

    productDescription.innerHTML = `<p>${product.description}</p>`;
    productPrice.innerHTML += `
            <p>Price ${price} $</p> 
            
            <a
              id="purchase-button"
              class="purchase-button"
              href="#"
            >
              Add to cart <i class="fa-solid fa-cart-shopping"></i>
            </a>
            `;
    productInfo.innerHTML = `<p>${product.genre}</p>`;
    productMisc.innerHTML = `<p>Suitable for ages over ${product.ageRating}</p> <p>Released in ${product.released}</p>`;
    productMisc.style.fontSize = '12px';
    productMisc.style.marginTop = '10px';

}

function buildProductCard(products, containerId) {
    const container = document.getElementById(containerId);

    if (!container) {
        toast.show(`Container with ID "${containerId}" not found.`, 'error');
        return;
    }

    products.forEach((product) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = product.id;

        const titleContainer = document.createElement('div');
        const title = document.createElement('h3');
        title.innerText = product.title;
        titleContainer.appendChild(title);
        card.appendChild(titleContainer);

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('card-image');
        const image = document.createElement('img');
        image.src = product.image.url;
        image.alt = product.image.alt;
        imageContainer.appendChild(image);
        card.appendChild(imageContainer);

        const descriptionContainer = document.createElement('div');
        descriptionContainer.classList.add('card-info');

        const price = document.createElement('p');
        price.innerText = product.price;
        descriptionContainer.appendChild(price);
        card.appendChild(descriptionContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.classList.add('card-button');
        const button = document.createElement('a');
        button.classList.add('card-text');
        button.innerText = 'View Product';
        button.href = `product.html?id=${product.id}`;
        buttonContainer.appendChild(button);
        card.appendChild(buttonContainer);

        container.appendChild(card);
    });
}

export function buildBestsellers(products) {
    const bestsellers = products.slice(0, 3);
    buildProductCard(bestsellers, 'bestsellers-cards-container');
}

export function buildNewReleases(products) {
    const releases = products.slice(3, 6);
    buildProductCard(releases, 'new-releases-cards-container');
}


export function buildCart(products) {
    const cartContainer = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    const cartPrice = document.getElementById('cart-price');

    for (const product of products) {
        const productData = product.data;

        const productCard = document.createElement('div');
        productCard.id = productData.id;
        productCard.classList.add('cart-card');

        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        const image = document.createElement('img');
        image.src = productData.image.url;
        image.alt = productData.image.alt;
        image.style.width = '80px';
        image.style.height = '100px';
        imageContainer.appendChild(image);

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('info-container');

        const titleContainer = document.createElement('div');
        titleContainer.classList.add('title');
        const title = document.createElement('h2');
        title.innerText = productData.title;
        titleContainer.append(title);

        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity');
        const quantityCounter = document.createElement('p');
        quantityCounter.classList.add('quantity-counter');
        quantityCounter.innerText = `Quantity: ${product.quantity}`;
        quantityContainer.append(quantityCounter);

        const priceContainer = document.createElement('div');
        priceContainer.classList.add('price');
        const price = document.createElement('p');
        price.innerText = `Price: ${productData.price} $`;
        priceContainer.append(price);

        const controlContainer = document.createElement('div');
        controlContainer.classList.add('control');
        controlContainer.innerHTML += `<i class="fa-solid icon fa-trash remove-btn" title="Remove from cart" data-productId="${productData.id}"></i>`;
        controlContainer.innerHTML += `<i class="fa-solid icon fa-plus increase-btn" title="Increase quantity" data-productId="${productData.id}"></i>`;
        controlContainer.innerHTML += `<i class="fa-solid icon fa-minus decrease-btn" title="Decrease quantity" data-productId="${productData.id}"></i>`;

        productCard.append(imageContainer);
        infoContainer.append(titleContainer);
        infoContainer.append(quantityContainer);
        infoContainer.append(priceContainer);
        infoContainer.append(controlContainer);
        productCard.append(infoContainer);

        cartContainer.appendChild(productCard);

        const summaryItems = document.createElement('p');
        summaryItems.innerText = `${product.quantity} x ${productData.title}`;
        cartItems.appendChild(summaryItems);
    }

    const priceSummary = document.createElement('p');
    const totalPrice = getCartTotalPrice();
    const roundedPrice = parseFloat(totalPrice.toFixed(2));
    priceSummary.classList.add('price-summary');
    priceSummary.innerText = `Total price ${roundedPrice} $`;

    cartPrice.append(priceSummary);
}
