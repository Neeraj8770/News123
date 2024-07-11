// const obfuscatedKey = "ODJlMjlhOGIzZjg0OGEyOGU3MWI0ZDU0ZWJlYTYzYg=="; // Base64 encoded API key
const API_KEY = "182e29a8b3f848a28e71b4d54ebea63b";
const url = "https://newsapi.org/v2/everything?q=";
let page = 1;
let totalResults = 0;
let query = "India";

window.addEventListener("load", () => fetchNews(query));

function reload() {
  window.location.reload();
}

async function fetchNews(query, page = 1) {
  const res = await fetch(`${url}${query}&apiKey=${API_KEY}&page=${page}`);
  const data = await res.json();
  totalResults = data.totalResults;
  bindData(data.articles);
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  articles.forEach((article) => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;
function onNavItemClick(id) {
  query = id;
  page = 1; // Reset page number when a new category is selected
  fetchNews(query, page);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  query = searchText.value;
  if (!query) return;
  page = 2; // Reset page number when a new search is made
  fetchNews(query, page);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});

window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    page * 30 < totalResults
  ) {
    page++;
    fetchNews(query, page);
  }
});
