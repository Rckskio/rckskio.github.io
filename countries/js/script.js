// State

let tabCountries = null;
let tabFavorites = null;

let allCountries = [];
let favoritesCountries = [];

let countCountries = 0;
let countFavorites = 0;

let totalPopulationList = 0;
let totalPopulationFavorites = 0;

let numberFormat = null;

window.addEventListener('load', () => {
  tabCountries = document.querySelector('#tabCountries');
  tabFavorites = document.querySelector('#tabFavorites');
  countCountries = document.querySelector('#countCountries');
  countFavorites = document.querySelector('#countFavorites');
  totalPopulationList = document.querySelector('#totalPopulationList');
  // prettier-ignore
  totalPopulationFavorites = 
    document.querySelector('#totalPopulationFavorites');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchCountries();
});

/* function fetchCountries() {
  //'https://restcountries.eu/rest/v2/all'
  console.log('fetching...');
  // Traditional way
  fetch('https://restcountries.eu/rest/v2/all')
    .then((res) => res.json())
    .then((json) => {
      allCountries = json;
      console.log(allCountries);
    });
} */

async function fetchCountries() {
  const res = await fetch('https://restcountries.eu/rest/v2/all');
  const json = await res.json();
  allCountries = json.map((country) => {
    const {
      numericCode,
      name,
      population,
      formattedPopulation,
      flag,
    } = country;

    return {
      id: numericCode,
      name: name,
      population: population,
      formattedPopulation: formatNumber(population),
      flag: flag,
    };
  });

  render();
}

function render() {
  renderCountryList();
  renderFavorites();
  renderSummary();

  handleCountriesButtons();
}

function renderCountryList() {
  let countriesHTML = '<div>';
  let title = 'title="Add country to favorites"';
  let alt = 'alt="Button to add country to favorites"';

  allCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const countryHTML = `
    <div class="country">
      <div>
        <a id="${id}" class="waves-effect waves-light btn" ${title} ${alt}>+</a>
      </div>
      <div>
        <img src="${flag}" alt="Flag of country ${name}" title="Flag of ${name}">
      </div>
      <div>
        <ul>
          <li>${name}</li>
          <li>${formattedPopulation}</li>
        </ul>
      </div>
    </div>
    `;

    countriesHTML += countryHTML;
  });

  countriesHTML += '</div>';

  tabCountries.innerHTML = countriesHTML;
}
function renderFavorites() {
  let favoritesHTML = '<div>';
  let title = 'title="Add country to favorites"';
  let alt = 'alt="Button to add country to favorites"';

  favoritesCountries.forEach((country) => {
    const { name, flag, id, population, formattedPopulation } = country;

    const favoriteHTML = `
      <div class="country">
        <div>
          <a id="${id}" class="waves-effect waves-light btn red darken-4" ${title} ${alt}>+</a>
        </div>
        <div>
          <img src="${flag}" alt="Flag of country ${name}" title="Flag of ${name}">
        </div>
        <div>
          <ul>
            <li>${name}</li>
            <li>${formattedPopulation}</li>
          </ul>
        </div>
      </div>
    `;

    favoritesHTML += favoriteHTML;
  });

  favoritesHTML += '</div>';

  tabFavorites.innerHTML = favoritesHTML;
}
function renderSummary() {
  countCountries.textContent = allCountries.length;
  countFavorites.textContent = favoritesCountries.length;

  const totalPopulation = allCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  const totalFavorites = favoritesCountries.reduce((accumulator, current) => {
    return accumulator + current.population;
  }, 0);

  totalPopulationList.textContent = formatNumber(totalPopulation);
  totalPopulationFavorites.textContent = formatNumber(totalFavorites);
}
function handleCountriesButtons() {
  const countriesButtons = Array.from(tabCountries.querySelectorAll('.btn'));
  const favoritesButtons = Array.from(tabFavorites.querySelectorAll('.btn'));

  countriesButtons.forEach((button) => {
    button.addEventListener('click', () => addToFavorites(button.id));
  });

  favoritesButtons.forEach((button) => {
    button.addEventListener('click', () => removeFromFavorites(button.id));
  });
}

function addToFavorites(id) {
  const countryToAdd = allCountries.find((country) => country.id === id);

  favoritesCountries = [...favoritesCountries, countryToAdd];

  favoritesCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  allCountries = allCountries.filter((country) => country.id !== id);

  render();
}
function removeFromFavorites(id) {
  const countryToRemove = favoritesCountries.find(
    (country) => country.id === id
  );

  allCountries = [...allCountries, countryToRemove];

  allCountries.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  favoritesCountries = favoritesCountries.filter(
    (country) => country.id !== id
  );

  render();
}

function formatNumber(number) {
  return numberFormat.format(number);
}
