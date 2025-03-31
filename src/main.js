import { getImagesByQuery } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';

let query = '';
let page = 1;
const perPage = 15;

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

form.addEventListener('submit', async e => {
  e.preventDefault();
  query = e.target.elements.searchQuery.value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Enter search query' });
    return;
  }

  page = 1;
  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);

    if (hits.length === 0) {
      iziToast.warning({ title: 'Oops!', message: 'No images found.' });
      return;
    }

    createGallery(hits);

    if (page * perPage < totalHits) {
      showLoadMoreButton();
    } else {
      iziToast.info({ title: 'End', message: "You've reached the end." });
    }
  } catch (err) {
    iziToast.error({ title: 'Error', message: 'Request failed.' });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits } = await getImagesByQuery(query, page);
    createGallery(hits);

    const cardHeight = document.querySelector('.gallery-item')?.getBoundingClientRect().height || 0;
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });

    if (page * perPage >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "You've reached the end." });
    } else {
      showLoadMoreButton();
    }
  } catch (err) {
    iziToast.error({ title: 'Error', message: 'Loading more failed.' });
  } finally {
    hideLoader();
  }
});
