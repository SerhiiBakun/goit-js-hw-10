import './css/styles.css';
import fetchCountries from './js/fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import markupList from './js/templates/countries-list.hbs';
import markupCard from './js/templates/country-card.hbs';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  if (!e.target.value.trim()) {
    resetMarkup();
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(data => {
      resetMarkup();
      renderMarkup(data);
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderMarkup(data) {
  if (data.length > 9) {
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (data.length > 1 && data.length < 10) {
    refs.countryList.insertAdjacentHTML('beforeend', markupList(data));
  } else if (data.length === 1) {
    refs.countryInfo.insertAdjacentHTML('beforeend', markupCard(data));
  }
}

function resetMarkup() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}
