// FRONT END FILE TO INTERACT WITH THE DOM
const searchInput = document.querySelector('#searchInput');
const searchButton = document.querySelector('#searchButton');
const searchTerm = searchInput.value;

const area = document.querySelector(".profile-cover__info");

searchButton.addEventListener('click', (e) => {
    console.log('clicked me!');
    console.log(searchInput.value);
    area.insertAdjacentHTML('beforeend', searchTerm);
});

