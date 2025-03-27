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