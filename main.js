const form = document.querySelector('.form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let query = '';
let page = 1;
const perPage = 15;
let lightbox = new SimpleLightbox('.gallery a');

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

function fetchImages(query, page = 1, perPage = 15) {
  const API_KEY = `49323961-66159e96cf1899f53bae32983`;
  const BASE_URL = `https://pixabay.com/api/`;
  const params = {
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: perPage,
  };
  return axios.get(BASE_URL, { params }).then(res => res.data);
}

function renderImages(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
        <li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
          </a>
          <ul class="info">
            <li>Likes: ${likes}</li>
            <li>Views: ${views}</li>
            <li>Comments: ${comments}</li>
            <li>Downloads: ${downloads}</li>
          </ul>
        </li>
      `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function clearGallery() {
  gallery.innerHTML = '';
}

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
