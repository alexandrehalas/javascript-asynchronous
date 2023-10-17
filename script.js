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

/*
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
*/

// BUILDING A SIMPLE PROMISE

// const lotteryPromise = new Promise(function (resolve, reject) {
//   console.log('Lottery draw is happening 🔮');
//   setTimeout(function () {
//     if (Math.random() >= 0.5) {
//       resolve('You WIN 💰');
//     } else {
//       reject(new Error('You lost your money 💩'));
//     }
//   }, 2000);
// });

// lotteryPromise
//   .then(result => {
//     console.log(result);
//   })
//   .catch(error => {
//     console.error(error);
//   });

/*
// Promisifying setTimeout
const wait = function (seconds) {
  return new Promise(function (resolve) {
    setTimeout(resolve, seconds * 1000);
  });
};

// Promise chaining
wait(1)
  .then(seconds => {
    console.log(`I waited for 1 second(s)`);
    return wait(1);
  })
  .then(seconds => {
    console.log(`I waited for 2 second(s)`);
    return wait(1);
  })
  .then(seconds => {
    console.log(`I waited for 3 second(s)`);
    return wait(1);
  })
  .then(seconds => {
    console.log(`I waited for 4 second(s)`);
  });

// Callback hell
// setTimeout(() => {
//   console.log('1 second passed');
//   setTimeout(() => {
//     console.log('2 seconds passed');
//     setTimeout(() => {
//       console.log('3 second passed');
//       setTimeout(() => {
//         console.log('4 second passed');
//       }, 1000);
//     }, 1000);
//   }, 1000);
// }, 1000);

// resolve or reject immediately
Promise.resolve('abc').then(res => console.log(res));
Promise.reject(new Error('abc')).catch(err => console.error(err));
*/

/*
// PROMISIFYING THE GEOLOCATION API

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    // navigator.geolocation.getCurrentPosition(
    //   position => resolve(position),
    //   err => reject(err)
    // );
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};
// getPosition().then(pos => console.log(pos));

const whereAmI = function () {
  getPosition()
    .then(pos => {
      const { latitude: lat, longitude: lng } = pos.coords;

      return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Problem with geocoding ${res.status}`);
      return res.json();
    })
    .then(data => {
      console.log(data);
      console.log(`You are in ${data.city}, ${data.country}`);

      return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`);
    })
    .then(res => {
      if (!res.ok) throw new Error(`Country not found (${res.status})`);

      return res.json();
    })
    .then(data => renderCountry(data[0]))
    .catch(err => console.error(`${err.message} 💥`));
};

btn.addEventListener('click', whereAmI);
*/

// CONSUMING PROMISES WITH ASYNC/AWAIT

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

// async function is a function basiically keep running in background
// while performing the code inside of it
// them when this function is done it automatically returns a promise
// async and await is an syntatic sugar over the 'then' method in promises
// behind of scenes we continue using promises
const whereAmI = async function () {
  try {
    // Geolocation
    const position = await getPosition();
    const { latitude: lat, longitude: lng } = position.coords;

    // Reverse geocoding
    const responseGeo = await fetch(
      `https://geocode.xyz/${lat},${lng}?geoit=json`
    );
    if (!responseGeo.ok) {
      throw new Error('Problem getting location data');
    }

    const dataGeo = await responseGeo.json();
    if (dataGeo.geoCode === 'Throttled! See geocode.xyz/pricing') {
      throw new Error('Problem getting location data');
    }

    // Country data
    const response = await fetch(
      `https://restcountries.com/v3.1/name/${dataGeo.country}`
    );
    if (!response.ok) {
      throw new Error('Problem getting location data');
    }
    const data = await response.json();
    const country = data[0];
    renderCountry(country);
    countriesContainer.style.opacity = 1;
    return `You are in ${country.name.common}`;
  } catch (error) {
    renderError(`${error.message}. Try again!`);
    countriesContainer.style.opacity = 1;
    throw error;
  }
};

// IIFE
console.log('1: Will get the location');
(async function () {
  try {
    const youAreIn = await whereAmI();
    console.log(`2: ${youAreIn}`);
  } catch (error) {
    console.error(`2: ${error}`);
  } finally {
    console.log('3: Finished get the location');
  }
})();

// RUNNING PROMISES IN PARALLEL
const get3Countries = async function (c1, c2, c3) {
  try {
    // SERIAL
    // const [data1] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c1}`
    // );
    // const [data2] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c2}`
    // );
    // const [data3] = await getJSON(
    //   `https://restcountries.eu/rest/v2/name/${c3}`
    // );
    // console.log([data1.capital, data2.capital, data3.capital]);

    // PARALLEL
    const data = await Promise.all([
      getJSON(`https://restcountries.eu/rest/v2/name/${c1}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c2}`),
      getJSON(`https://restcountries.eu/rest/v2/name/${c3}`),
    ]);
    console.log(data.map(d => d[0].capital));
  } catch (err) {
    console.error(err);
  }
};
get3Countries('portugal', 'canada', 'tanzania');
