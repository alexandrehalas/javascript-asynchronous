'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

// old school way XMLHttpRequest

// const getCountry = function (name) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [country] = JSON.parse(this.responseText);
//     const html = `
//     <article class="country">
//         <img class="country__img" src="${country.flags.svg}" />
//         <div class="country__data">
//         <h3 class="country__name">${country.name.common}</h3>
//         <h4 class="country__region">${country.region}</h4>
//         <p class="country__row"><span>👫</span>${(
//           +country.population / 1_000_000
//         ).toFixed(1)}</p>
//         <p class="country__row"><span>🗣️</span>${
//           Object.values(country.languages)[0]
//         }</p>
//         <p class="country__row"><span>💰</span>${
//           Object.values(country.currencies)[0].name
//         }</p>
//         </div>
//     </article>`;

//     countriesContainer.insertAdjacentHTML('beforeend', html);
//     countriesContainer.style.opacity = 1;
//   });
// };

// const renderCountry = function () {};

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
  countriesContainer.style.opacity = 1;
};

// const getCountry = function (name) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${name}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [country] = JSON.parse(this.responseText);
//     renderCountry(country);
//     const [neighbour] = country.borders;
//     if (!neighbour) return;

//     const request2 = new XMLHttpRequest();
//     request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
//     request2.send();

//     request2.addEventListener('load', function () {
//       const [country] = JSON.parse(this.responseText);
//       renderCountry(country, 'neighbour');
//     });
//   });
// };

//getCountry('brazil');

// MODERN WAY
// fetch returns a promise
const getCountry = function (name) {
  fetch(`https://restcountries.com/v3.1/name/${name}`)
    .then(promiseResponse => promiseResponse.json())
    .then(dateResponse => renderCountry(dateResponse[0]));
};

getCountry('brazil');
