// get the elements from the  DOM
const characterList = document.getElementById("character-list");
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filter");
const loadMoreBtn = document.getElementById("load-more");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const favoritesList = document.getElementById("favorites-list");
const popup = document.getElementById("popup");
const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");
const userDisplay = document.getElementById("user-display");
const logoutBtn = document.getElementById("logout-btn");

let characterData = [];
let favCharacters = JSON.parse(localStorage.getItem("favorites")) || [];
let currentPage = 1;
let currentUser = sessionStorage.getItem("currentUser") || "";


function updateUserDisplay() {
    if (currentUser) {
  userDisplay.textContent = `Welcome, ${currentUser}`;
loginForm.style.display = "none";
  registerForm.style.display = "none";
logoutBtn.style.display = "block";
    } else {
  userDisplay.textContent = "";
  loginForm.style.display = "block";
  registerForm.style.display = "block";
        logoutBtn.style.display = "none";
    }
}

// register
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
const username = document.getElementById("register-username").value;
const password = document.getElementById("register-password").value;

if (localStorage.getItem(username)) {
  alert("Username already exists!");
    } else {
localStorage.setItem(username, password);
        alert("Account created! Now log in.");
    }
});

// login
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();const username = document.getElementById("login-username").value;
    
    const password = document.getElementById("login-password").value;
if (localStorage.getItem(username) === password) {
    currentUser = username;
  sessionStorage.setItem("currentUser", username);
        updateUserDisplay();
    } else {
        alert("Wrong username or password.");
    }
});

// logout
logoutBtn.addEventListener("click", () => {
currentUser = "";
  sessionStorage.removeItem("currentUser");
    updateUserDisplay();
});

updateUserDisplay();


// fetch anime characters from Jikan
function fetchCharacters() {
    console.log(`Fetching page ${currentPage} of characters...`);
    
    fetch(`https://api.jikan.moe/v4/characters?page=${currentPage}`)
        .then(response => response.json())
      .then(data => {
     characterData = [...characterData, ...data.data];
          displayCharacters();
        })
        .catch(error => console.log("Error fetching characters:", error));
}




// display the characters
function displayCharacters() {
    characterList.innerHTML = "";
    
    let filteredCharacters = characterData.filter(character => {
      return character.name.toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1; // More human-like filtering
    });

    // sort by popularity
    if (filterSelect.value === "popularity") {
  filteredCharacters.sort((a, b) => b.favorites - a.favorites);
    }

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

// add event listeners
function addEventListeners() {
  searchInput.addEventListener("input", displayCharacters);
    filterSelect.addEventListener("change", displayCharacters);
  darkModeToggle.addEventListener("click", () => {
 document.body.classList.toggle("dark-mode");
    });
    loadMoreBtn.addEventListener("click", () => {
        currentPage++;
        fetchCharacters();
    });
}

// show popup 
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("more-details")) {
  const charId = event.target.getAttribute("data-id");
     const character = characterData.find(c => c.mal_id == charId);
        
        if (character) {
            document.getElementById("popup-content").innerHTML = `
   <span id="close-popup" class="close-btn">&times;</span>
      <h2>${character.name}</h2>
      <img src="${character.images.jpg.image_url}" alt="${character.name}">
  <p>${character.about || "No description available."}</p>
            `;
            popup.style.display = "flex";
        }
    }
});

// close popup
popup.addEventListener("click", (event) => {
    if (event.target.classList.contains("close-btn") || event.target === popup) {
  popup.style.display = "none";
    }
});

// adding and removing favorites
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("favorite-btn")) {
  const charId = event.target.getAttribute("data-id");
        toggleFavorite(charId);
    }
});

function isFavorite(charId) {
    return favCharacters.some(fav => fav.mal_id == charId);
}

function toggleFavorite(charId) {
    const character = characterData.find(c => c.mal_id == charId);
if (!character) return;

    if (isFavorite(charId)) {
  favCharacters = favCharacters.filter(fav => fav.mal_id != charId);
    } else {
        favCharacters.push(character);
    }

localStorage.setItem("favorites", JSON.stringify(favCharacters));
    displayCharacters();
    displayFavorites();
}

// show favorites list
function displayFavorites() {
    favoritesList.innerHTML = "<h2>Favorites</h2>";
    
    favCharacters.forEach(character => {
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

// remove favorite
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-favorite")) {
  const charId = event.target.getAttribute("data-id");
  favCharacters = favCharacters.filter(fav => fav.mal_id != charId);
  localStorage.setItem("favorites", JSON.stringify(favCharacters));
  displayFavorites();
  displayCharacters();
    }
});

fetchCharacters();
displayFavorites();
addEventListeners();
