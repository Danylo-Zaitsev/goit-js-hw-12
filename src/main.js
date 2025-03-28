import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { responseData } from './js/pixabay-api';
import { createGalleryMarkup, clearGallery } from './js/render-functions';

const form = document.querySelector('.form');
const loader = document.querySelector('.loader');
const gallery = document.querySelector('.gallery');
const loadButton = document.querySelector('.js-button');

let query = '';
let currentPage = 1;
let totalHits = 0; // Глобальная переменная для общего количества изображений

const lightbox = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
  animationSpeed: 350,
});

form.addEventListener('submit', userInputForm);
loadButton.addEventListener('click', loadMoreImage);

async function userInputForm(event) {
  event.preventDefault();
  query = event.currentTarget.elements['search-text'].value.trim();

  if (!query) {
    return;
  }

  loader.classList.remove('hidden');
  clearGallery();
  form.reset();
  currentPage = 1;

  try {
    const { hits, totalHits: fetchedTotalHits } = await responseData(
      query,
      currentPage
    );

    // Логирование всей структуры ответа
    console.log('API Response:', { hits, totalHits: fetchedTotalHits });

    // Проверка на отсутствие данных
    if (!hits || hits.length === 0) {
      iziToast.error({
        title: 'Sorry',
        message: 'No images found, please try another search.',
        position: 'topRight',
      });
      loadButton.classList.add('hidden');
      return;
    }

    // Обновляем глобальное количество изображений
    totalHits = fetchedTotalHits;

    renderImages(hits);
    lightbox.refresh();

    if (Math.ceil(totalHits / 15) === currentPage) {
      iziToast.show({
        title: 'End of search',
        message: 'You have reached the end of the collection.',
        position: 'topRight',
      });
      loadButton.classList.add('hidden');
    } else {
      loadButton.classList.remove('hidden');
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: `Something went wrong: ${error.message}`,
      position: 'topRight',
    });
  } finally {
    loader.classList.add('hidden');
  }
}

function renderImages(images) {
  if (Array.isArray(images) && images.length > 0) {
    console.log('Rendering images:', images); // Логируем перед рендером
    createGalleryMarkup(images);
    lightbox.refresh();
  } else {
    console.warn('No valid images to render.');
  }
}

async function loadMoreImage() {
  if (currentPage * 15 < totalHits) {
    loader.classList.remove('hidden');
    currentPage += 1;

    try {
      const { hits } = await responseData(query, currentPage);

      console.log('Hits on load more:', hits);

      // Проверка на пустой ответ
      if (hits && hits.length > 0) {
        renderImages(hits);
      } else {
        console.warn('No more images found.');
      }

      if (Math.ceil(totalHits / 15) === currentPage) {
        iziToast.show({
          title: 'End of search',
          message: 'You have reached the end of the collection.',
          position: 'topRight',
        });
        loadButton.classList.add('hidden');
      }
    } catch (error) {
      iziToast.error({
        title: 'Error',
        message: `Something went wrong: ${error.message}`,
        position: 'topRight',
      });
    } finally {
      loader.classList.add('hidden');
    }
  }
}