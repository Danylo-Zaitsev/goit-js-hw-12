import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');
let lightbox = new SimpleLightbox('.gallery a');


export function createGalleryMarkup(images) {

  const validImages = images.filter(image => {
    return image.largeImageURL && image.webformatURL && image.tags;
  });


  if (validImages.length > 0) {
    gallery.insertAdjacentHTML(
      'beforeend',
      validImages
        .map(
          image => `
    <li class="gallery-item">
      <a class="gallery-link" href="${image.largeImageURL}">
        <img
          class="gallery-image"
          src="${image.webformatURL}"
          data-source="${image.largeImageURL}"
          alt="${image.tags}"
        />
      </a>
      <p>Likes: ${image.likes}</p>
      <p>Views: ${image.views}</p>
      <p>Comments: ${image.comments}</p>
      <p>Downloads:  ${image.downloads}</p>
    </li>`
        )
        .join('')
    );


    lightbox.refresh();
  } else {
    console.warn('No valid images to render.');
  }
}


export function clearGallery() {
  gallery.innerHTML = '';
}