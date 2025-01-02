const baseApiUrl = "https://v2.api.noroff.dev/";
const newReleasesContainer = document.getElementById(
  "new-releases-cards-container"
);
const popularProductsContainer = document.getElementById(
  "bestsellers-cards-container"
);

const getAllProducts = async () => {
  const response = await fetch(`${baseApiUrl}gamehub`);
  const products = await response.json();
  console.log(products);
  const bestSellers = products.data.slice(0, 3);
  const newReleases = products.data.slice(3, 6);

  createHomePageProductCards(newReleases);
  createHomePageProductCards(bestSellers);
};

getAllProducts();

const createHomePageProductCards = (products) => {
  products.forEach((product) => {
    // Create the card
    const newReleaseCard = document.createElement("div");
    newReleaseCard.classList.add("card");
    newReleaseCard.id = product.id;
    const tags = product.tags;

    // The card title
    const newReleaseCardTitleContainer = document.createElement("div");
    const newReleaseCardTitle = document.createElement("h3");
    newReleaseCardTitle.innerText = product.title;
    newReleaseCardTitleContainer.appendChild(newReleaseCardTitle);
    newReleaseCard.appendChild(newReleaseCardTitleContainer);

    // The card image
    const newReleaseImageContainer = document.createElement("div");
    newReleaseImageContainer.classList.add("card-image");
    const newReleaseCardImage = document.createElement("img");
    newReleaseCardImage.src = product.image.url;
    newReleaseCardImage.alt = product.image.alt;
    newReleaseImageContainer.appendChild(newReleaseCardImage);
    newReleaseCard.appendChild(newReleaseImageContainer);

    // The card description
    const newReleaseCardDescriptionContainer = document.createElement("div");
    newReleaseCardDescriptionContainer.classList.add("card-info");

    // The card tags
    const newReleaseCardTags = document.createElement("p");
    tags.forEach((tag) => {
      const newReleaseCardTag = document.createElement("span");
      newReleaseCardTag.classList.add("card-tag");
      newReleaseCardTag.style.fontSize = "0.8rem";
      newReleaseCardTag.innerText = tag + " ";
      newReleaseCardTags.appendChild(newReleaseCardTag);
    });
    newReleaseCardDescriptionContainer.appendChild(newReleaseCardTags);

    // The card price
    const newReleaseCardDescriptionPrice = document.createElement("p");
    newReleaseCardDescriptionPrice.innerText = product.price;
    newReleaseCardDescriptionContainer.appendChild(
      newReleaseCardDescriptionPrice
    );
    newReleaseCard.appendChild(newReleaseCardDescriptionContainer);

    // The card button
    const newReleaseCardButtonContainer = document.createElement("div");
    newReleaseCardButtonContainer.classList.add("card-button");
    const newReleaseCardButton = document.createElement("a");
    newReleaseCardButton.classList.add("card-text");
    newReleaseCardButton.innerText = "View Product";
    newReleaseCardButton.href = `product.html?id=${product.id}`;
    newReleaseCardButtonContainer.appendChild(newReleaseCardButton);
    newReleaseCard.appendChild(newReleaseCardButtonContainer);

    newReleasesContainer.appendChild(newReleaseCard);
  });
};
