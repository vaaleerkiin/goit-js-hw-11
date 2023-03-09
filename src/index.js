import './js/top__link';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchData from './js/API_SERVICE';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const fetchNewData = new fetchData();
let queryValue = '';

let gallery = new SimpleLightbox('.gallery a');

const refs = {
  submit: document.querySelector('.submit'),
  input: document.querySelector('.input'),
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  readMore: document.querySelector('.read__more'),
};

refs.form.addEventListener('submit', e => {
  if (refs.input.value.trim() === '') return;
  queryValue = refs.input.value.trim();
  onSubmit();
  e.preventDefault();
});

async function onSubmit() {
  fetchNewData.resetPage();

  disabledBtn('submit');

  const response = await fetchNewData.makeRequest(queryValue);
  if (response.hits.length === 0) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    removeDisabledBtn('submit');
    return;
  } else Notify.success(`Hooray! We found ${response.totalHits} images.`);

  clearAMarkup();

  renderMarkup(response.hits);

  gallery.refresh();

  addReadMore();

  removeDisabledBtn('submit');

  fetchNewData.incrementPage();
}

refs.readMore.addEventListener('click', () => {
  if (refs.input.value.trim() === '') return;

  onReadMore();
});

function addReadMore() {
  refs.readMore.style.opacity = '1';
}

function removeReadMore() {
  refs.readMore.style.opacity = '0';
}

async function onReadMore() {
  disabledBtn();

  const response = await fetchNewData.makeRequest(queryValue);

  if (response.hits.length === 0) {
    Notify.info(`We're sorry, but you've reached the end of search results.`);
    removeReadMore();
    removeDisabledBtn();
    return;
  }

  renderMarkup(response.hits);

  removeDisabledBtn();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy(0, cardHeight * 2.5);
  fetchNewData.incrementPage();
}

function renderMarkup(response) {
  const markup = response
    .map(
      ({
        largeImageURL,
        webformatURL,
        comments,
        downloads,
        likes,
        views,
        tags,
      }) => {
        const markup = `
        <a class="gallary__link" href="${largeImageURL}">
<div class="photo-card">
 <div class="img__wrap">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      <span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b>
      <span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b>
      <span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b>
      <span>${downloads}</span>
    </p>
  </div>
</div>
</a>`;
        return markup;
      }
    )
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function disabledBtn(ar) {
  if (ar === 'submit') refs.submit.setAttribute('disabled', '');
  else {
    refs.submit.setAttribute('disabled', '');
    refs.readMore.setAttribute('disabled', '');
  }
}

function removeDisabledBtn(ar) {
  if (ar === 'submit') refs.submit.removeAttribute('disabled', '');
  else {
    refs.submit.removeAttribute('disabled', '');
    refs.readMore.removeAttribute('disabled', '');
  }
}

function clearAMarkup() {
  refs.gallery.innerHTML = '';
}
