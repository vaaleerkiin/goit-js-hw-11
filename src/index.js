import './js/top__link';
import Pagination from './js/pagination';
let pagination = new Pagination();

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchData from './js/API_SERVICE';
import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
const fetchNewData = new fetchData();
let queryValue = '';
let totalAmount = null;
let gallery = new SimpleLightbox('.gallery a');

const refs = {
  submit: document.querySelector('.submit'),
  input: document.querySelector('.input'),
  form: document.querySelector('.form'),
  gallery: document.querySelector('.gallery'),
  readMore: document.querySelector('.read__more'),
  backdrop: document.querySelector('.backdrop'),
};

refs.form.addEventListener('submit', e => {
  e.preventDefault();
  if (refs.input.value.trim() === '') return;
  queryValue = refs.input.value.trim();
  onSubmit();
});

async function onSubmit() {
  fetchNewData.resetPage();

  disabledBtn('submit');
  refs.backdrop.classList.remove('hidden');
  const response = await fetchNewData.makeRequest(queryValue);

  pagination.paginationContainer.innerHTML = '';

  fetchNewData.totalPage = Math.ceil(
    response.totalHits / fetchNewData.per_page
  );

  if (
    fetchNewData.page === Math.ceil(response.totalHits / fetchNewData.per_page)
  ) {
  }

  if (response.hits.length === 0) {
    refs.backdrop.classList.add('hidden');
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    removeDisabledBtn('submit');
    return;
  } else {
    Notify.success(`Hooray! We found ${response.totalHits} images.`);
    totalAmount = response.totalHits;
  }

  const pag = pagination.createPagination(fetchNewData.totalPage, 1);

  pagination.renderPagination(pag);

  clearAMarkup();

  renderMarkup(response.hits);

  gallery.refresh();
  refs.backdrop.classList.add('hidden');
  removeDisabledBtn('submit');
}

refs.readMore.addEventListener('click', () => {
  if (refs.input.value.trim() === '') return;

  onReadMore();
});

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

document
  .getElementById('pagination-container')
  .addEventListener('click', ev => {
    if (ev.target.nodeName === 'BUTTON') {
      onChangePage(ev.target);
    }
  });

async function onChangePage(ev) {
  refs.backdrop.classList.remove('hidden');
  if (ev.textContent == '<') {
    fetchNewData.setPage(Number(fetchNewData.page) - 1);

    const response = await fetchNewData.makeRequest(queryValue);
    pagination.paginationContainer.innerHTML = '';
    clearAMarkup();

    renderMarkup(response.hits);

    const pag = pagination.createPagination(
      fetchNewData.totalPage,
      fetchNewData.page
    );

    pagination.renderPagination(pag);
  } else if (ev.textContent === '>') {
    fetchNewData.setPage(Number(fetchNewData.page) + 1);

    const response = await fetchNewData.makeRequest(queryValue);
    pagination.paginationContainer.innerHTML = '';
    clearAMarkup();

    renderMarkup(response.hits);

    const pag = pagination.createPagination(
      fetchNewData.totalPage,
      Number(fetchNewData.page)
    );

    pagination.renderPagination(pag);
  } else if (ev.classList.contains('post-dots')) {
    fetchNewData.setPage(
      Math.ceil(Number(fetchNewData.page + fetchNewData.totalPage) / 2)
    );

    const response = await fetchNewData.makeRequest(queryValue);
    pagination.paginationContainer.innerHTML = '';
    clearAMarkup();

    renderMarkup(response.hits);

    const pag = pagination.createPagination(
      fetchNewData.totalPage,
      fetchNewData.page
    );

    pagination.renderPagination(pag);
  } else if (ev.classList.contains('pre-dots')) {
    fetchNewData.setPage(Math.ceil(Number(fetchNewData.page) / 2));

    const response = await fetchNewData.makeRequest(queryValue);
    pagination.paginationContainer.innerHTML = '';
    clearAMarkup();

    renderMarkup(response.hits);

    const pag = pagination.createPagination(
      fetchNewData.totalPage,
      fetchNewData.page
    );

    pagination.renderPagination(pag);
  } else {
    ev = ev.textContent;
    fetchNewData.setPage(+ev);
    const response = await fetchNewData.makeRequest(queryValue);
    pagination.paginationContainer.innerHTML = '';
    clearAMarkup();

    renderMarkup(response.hits);

    const pag = pagination.createPagination(fetchNewData.totalPage, Number(ev));

    pagination.renderPagination(pag);
  }

  gallery.refresh();

  refs.backdrop.classList.add('hidden');
}
