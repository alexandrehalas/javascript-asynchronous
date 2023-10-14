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

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
};

const getCountryJSON = function (
  countryURL,
  errorMessage = 'Something went wrong!'
) {
  return fetch(`${countryURL}`).then(response => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${errorMessage}`);
    }
    return response.json();
  });
};

const getCountry = function (name) {
  getCountryJSON(
    `https://restcountries.com/v3.1/name/${name}`,
    `Country with name '${name}' was not found`
  )
    .then(response => {
      const country = response[0];
      renderCountry(country);
      const [neighbour] = country.borders || [];
      if (!neighbour)
        throw new Error(
          `No country neighbour found for country ${country.name.common}`
        );
      return getCountryJSON(
        `https://restcountries.com/v3.1/alpha/${neighbour}`,
        `Country neighbour with name '${neighbour}' was not found`
      );
    })
    .then(response => renderCountry(response[0], 'neighbour'))
    .catch(error => {
      console.error(error);
      renderError(`${error.message}. Try again!`);
    })
    .finally(() => {
      countriesContainer.style.opacity = 1;
    });
};

btn.addEventListener('click', function () {
  getCountry('brazil');
  // country with no neighbour
  //getCountry('australia');
});

// THE EVENT LOOP IN PRACTICE
console.log('first, because is callback queue', 'Test start');

setTimeout(
  () =>
    console.log(
      'fifth, because is a callback of the microtask queue',
      '0 sec timer'
    ),
  0
);
Promise.resolve('third, because is microtask queue', 'Resolved promise 1').then(
  res => console.log(res)
);

// microtasks has priority over callback, soon if the microtask is to slow the timer
// of settimeout not will be executed after just 0 seconds, it need wait the microtask first
Promise.resolve(
  'fourth, because is microtask queue',
  'Resolved promise 2'
).then(res => {
  for (let i = 0; i < 1000000000; i++) {}
  console.log(res);
});

console.log('second, because is callback queue', 'Test end');
