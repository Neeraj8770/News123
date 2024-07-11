const API_KEY = "182e29a8b3f848a28e71b4d54ebea63b";
const url = "https://newsapi.org/v2/everything?q=";
let page = 1; // Initial page number
let totalResults = 0; // Total number of articles
let query = "India"; // Initial query

window.addEventListener("load", () => fetchNews(query));

function reload() {
  window.location.reload();
}

async function fetchNews(query, page = 1) {
  try {
    const res = await fetch(`${url}${query}&apiKey=${API_KEY}&page=${page}`);
    const data = await res.json();
    totalResults = data.totalResults;
    bindData(data.articles);
  } catch (error) {
    console.error("Error fetching news:", error);
  }
}

function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  // Clear existing content if any
  cardsContainer.innerHTML = "";

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

  // Open article in a new tab when card is clicked
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

let curSelectedNav = null;

function onNavItemClick(id) {
  query = id; // Update query based on category clicked
  page = 1; // Reset page number when a new category is selected
  fetchNews(query, page); // Fetch news based on new query and page 1
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value.trim();
  if (query) {
    page = 1; // Reset page number when a new search is made
    fetchNews(query, page);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
  }
});

window.addEventListener("scroll", () => {
  // Load more news when scroll nears the bottom and there are more articles to fetch
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    page * 20 < totalResults
  ) {
    page++;
    fetchNews(query, page);
  }
});
