//  the get Elements part
const characterList = document.getElementById("character-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const loadMoreBtn = document.getElementById("load-more");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const favoritesList = document.getElementById("favorites-list");
const popup = document.getElementById("popup");
const popupContent = document.getElementById("popup-content");


// Variables part
let characters = [];
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let page = 1;


// Fetch The anime characters From api
function fetchCharacters() {
fetch(`https://api.jikan.moe/v4/characters?page=${page}`)
      .then(response => response.json())
      .then(data => {
   characters = [...characters, ...data.data]; // Addnew characters to the Page
   displayCharacters();
      })
.catch(error => console.log("Error fetching characters:", error));
}

// display characters Function
function displayCharacters() {
  characterList.innerHTML = "";
 
    // Filter TO PROVIDE CHARACTERS SO THAT THE USER CAN CHOOSE

    let filteredCharacters = characters.filter(character =>
      character.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );

      // Sort
      if (filterSelect.value === "popularity") {
        filteredCharacters.sort((a, b) => b.favorites - a.favorites);
    }

// Add Characres to favourite and remove
        filteredCharacters.forEach(character => {
   const charCard = document.createElement("div");
   charCard.className = "character-card";
charCard.innerHTML = `
      <img src="${character.images.jpg.image_url}" alt="${character.name}">
  <h3>${character.name}</h3>
<button class="more-details" data-id="${character.mal_id}">More Details</button>
     <button class="favorite-btn" data-id="${character.mal_id}">
          ${isFavorite(character.mal_id) ? "❌ Remove" : "❤️ Add"}
</button>
          `;
  characterList.appendChild(charCard);
      });
  }

 //Search Function
  searchInput.addEventListener("input", displayCharacters);


// A sorting feature
  filterSelect.addEventListener("change", displayCharacters);


  // Dark mode
darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});


loadMoreBtn.addEventListener("click", () => {
  page++;
  fetchCharacters();
});


// The Popup Comes Out
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("more-details")) {
      const charId = event.target.getAttribute("data-id");
      const character = characters.find(c => c.mal_id == charId);

      if (character) {
          popupContent.innerHTML = `
              <span id="close-popup" class="close-btn">&times;</span>
              <h2>${character.name}</h2>
              <img src="${character.images.jpg.image_url}" alt="${character.name}">
              <p>${character.about || "No description available."}</p>
          `;
          popup.style.display = "flex";
      }
  }
});


// Close popup and going back to the home page
popup.addEventListener("click", (event) => {
  if (event.target.classList.contains("close-btn") || event.target === popup) {
      popup.style.display = "none";
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("favorite-btn")) {
      const charId = event.target.getAttribute("data-id");
      toggleFavorite(charId);
  }
});

// Checking if the anime is favourited
function isFavorite(charId) {
  return favorites.some(fav => fav.mal_id == charId);
}

// Add or remove character
function toggleFavorite(charId) {
  const character = characters.find(c => c.mal_id == charId);
  if (!character) return;

  if (isFavorite(charId)) {
      favorites = favorites.filter(fav => fav.mal_id != charId);
  } else {
      favorites.push(character);
  }

  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayCharacters();
  displayFavorites();
}


// Display favorites
function displayFavorites() {
  favoritesList.innerHTML = "<h2>Favorites</h2>";
  favorites.forEach(character => {
      const favCard = document.createElement("div");
      favCard.className = "character-card";
      favCard.innerHTML = `
          <img src="${character.images.jpg.image_url}" alt="${character.name}">
          <h3>${character.name}</h3>
          <button class="remove-favorite" data-id="${character.mal_id}">❌ Remove</button>
      `;
      favoritesList.appendChild(favCard);
  });
}