import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = event.target.elements['searchQuery'].value.trim();

  if (!query) {
    iziToast.error({ title: 'Error', message: 'Please enter a search query!' });
    return;
  }

  page = 1;
  clearGallery();
  hideButton(loadMoreBtn);
  showLoader();

  try {
    const { hits, totalHits } = await fetchImages(query, page, perPage);

    if (hits.length === 0) {
      iziToast.warning({ title: 'Oops!', message: 'No images found. Try again!' });
      return;
    }

    renderImages(hits);
    if (page * perPage < totalHits) {
      showButton(loadMoreBtn);
    } else {
      iziToast.info({ title: 'End', message: "You've reached the end of search results." });
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Try again later!' });
    console.error(error);
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  hideButton(loadMoreBtn);
  showLoader();

  try {
    const { hits, totalHits } = await fetchImages(query, page, perPage);

    renderImages(hits);
    scrollPage();

    if (page * perPage >= totalHits) {
      iziToast.info({ title: 'End', message: "You've reached the end of search results." });
    } else {
      showButton(loadMoreBtn);
    }
  } catch (error) {
    iziToast.error({ title: 'Error', message: 'Failed to fetch images. Try again later!' });
    console.error(error);
  } finally {
    hideLoader();
  }
});

function scrollPage() {
  const cardHeight = document.querySelector('.gallery-item')?.getBoundingClientRect().height || 0;
  window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
}

function showLoader() {
  loader.classList.add('visible');
}
function hideLoader() {
  loader.classList.remove('visible');
}
function showButton(button) {
  button.style.display = 'block';
}
function hideButton(button) {
  button.style.display = 'none';
}
