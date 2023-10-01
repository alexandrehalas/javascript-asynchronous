'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (country, className = '') {
  const html = `
    <article class="country ${className}">
        <img class="country__img" src="${country.flags.svg}" />
        <div class="country__data">
        <h3 class="country__name">${country.name.common}</h3>
        <h4 class="country__region">${country.region}</h4>
        <p class="country__row"><span>👫</span>${(
          +country.population / 1_000_000
        ).toFixed(1)}</p>
        <p class="country__row"><span>🗣️</span>${
          Object.values(country.languages)[0]
        }</p>
        <p class="country__row"><span>💰</span>${
          Object.values(country.currencies)[0].name
        }</p>
        </div>
    </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
};

const handleError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getCountry = function (name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(promiseResponse => promiseResponse.json())
    .then(dateResponse => {
      const country = dateResponse[0];
      renderCountry(country);
      const [neighbour] = country.borders;
      if (!neighbour) return;
      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
    })
    .then(promiseResponse => promiseResponse.json())
    .then(dateResponse => renderCountry(dateResponse[0], 'neighbour'))
    .catch(error => {
      console.error(error);
      handleError(`Something went wrong: ${error.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountry('brazil');
});
