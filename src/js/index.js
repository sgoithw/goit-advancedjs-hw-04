import iziToast from 'izitoast';
import simpleLightbox from 'simplelightbox';
import { searchImages } from './pixabayApi';

import 'modern-normalize/modern-normalize.css';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../css/style.css';

const elements = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('#gallery'),
  galleryEnd: document.querySelector('#gallery-end'),
};

const lightbox = new simpleLightbox('.photo-card', {
  captionsData: 'alt',
  sourceAttr: 'data-image',
  captionDelay: 250,
});

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach(async entry => {
      if (entry.isIntersecting) {
        handleOsbserverIntersect(observer);
      }
    });
  },
  { rootMargin: '150px' }
);

let currentPage = 1;

elements.searchForm.addEventListener('submit', handleSearchFormSubmit);

/**
 * Handles the search form submit event.
 * @param {*} event
 */
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  clearGallery();
  const result = await renderGallery(1);
  observer.observe(elements.galleryEnd);
}

/**
 * Handles the observer intersect event.
 * Loads more images if the observer intersects.
 * @param {*} observer
 */
async function handleOsbserverIntersect(observer) {
  const res = await renderGallery(++currentPage);
  if (res.totalHits <= 40 || res.totalHits <= currentPage * 40) {
    observer.unobserve(elements.galleryEnd);
  }
}

/**
 * Loads the images and renders the gallery.
 * @param {*} page
 */
async function renderGallery(page = 1) {
  try {
    currentPage = page;
    const { data: response } = await searchImages(getQuery(page));
    if (response.totalHits !== 0) {
      iziToast.success({
        title: 'Success',
        position: 'topRight',
        message: `Hooray! We found ${response.totalHits} images.`,
      });
      renderImages(response.hits);
      refreshSimpleLightbox();
    } else {
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
      });
    }
    return response;
  } catch (error) {
    console.log(error);
    iziToast.error({
      title: 'Error',
      position: 'topRight',
      message: error.message,
    });
  }
}

/**
 * Refreshes the simple lightbox.
 */
function refreshSimpleLightbox() {
  lightbox.refresh();
}

/**
 * Shows loaded the images.
 *
 * @param {*} images
 */
function renderImages(images) {
  elements.gallery.insertAdjacentHTML(
    'beforeend',
    images.map(getImageCardHTML).join('')
  );
}

/**
 * Removes all loaded images.
 * @returns {void}
 * */
function clearGallery() {
  elements.gallery.innerHTML = '';
}

/**
 * Returns image query parameters.
 * @param {number} page - The page number.
 * @returns {Object} - The image query parameters.
 */
function getQuery(page = 1) {
  return {
    query: elements.searchForm.elements.searchQuery.value,
    page,
    per_page: 40,
  };
}

/**
 * Returns the image card HTML.
 * @param {Object} image - The image object.
 * @returns {string} - The image card HTML.
 */
function getImageCardHTML({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `
    <div class="photo-card" data-image="${largeImageURL}">
        <img class="photo-card-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
            <p class="info-item">
                <b>Likes</b><br>${likes}
            </p>
                <p class="info-item">
            <b>Views</b><br>${views}
            </p>
            <p class="info-item">
                <b>Comments</b><br>${comments}
            </p>
            <p class="info-item">
                <b>Downloads</b><br>${downloads}
            </p>
        </div>
    </div>`;
}
