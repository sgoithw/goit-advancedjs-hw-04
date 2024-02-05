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
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        handleOsbserverIntersect(observer);
      }
    });
  },
  { rootMargin: '250px' }
);

const perPage = 40;

let currentPage = 1;

elements.searchForm.addEventListener('submit', handleSearchFormSubmit);

/**
 * Handles the search form submit event.
 * @param {*} event
 */
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  try {
    clearGallery();
    const result = await renderGallery();
    if (result.totalHits !== 0) {
      iziToast.success({
        title: 'Success',
        position: 'topRight',
        message: `Hooray! We found ${result.totalHits} images.`,
      });
    } else {
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message:
          'Sorry, there are no images matching your search query. Please try again.',
      });
    }
    if (result.totalHits > perPage) {
      observer.observe(elements.galleryEnd);
    } else {
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message: "You've reached the end of search results.",
      });
    }
  } catch (error) {
    showErrorMessage(error);
  }
}

/**
 * Handles the observer intersect event.
 * Loads more images if the observer intersects.
 * @param {*} observer
 */
async function handleOsbserverIntersect(observer) {
  try {
    const res = await renderGallery(++currentPage);
    if (res.totalHits <= currentPage * perPage) {
      observer.unobserve(elements.galleryEnd);
      iziToast.info({
        title: 'Info',
        position: 'topRight',
        message: "We're sorry, but you've reached the end of search results.",
      });
    }
  } catch (error) {
    showErrorMessage(error);
  }
}

/**
 * Loads the images and renders the gallery.
 * @param {*} page
 */
async function renderGallery(page = 1) {
  currentPage = page;
  const query = getQuery(page);
  checkQuery(query);
  const { data: response } = await searchImages(query);
  if (response.hits.length > 0) {
    renderImages(response.hits);
    refreshSimpleLightbox();
  }
  return response;
}

/**
 * Checks the query.
 * @param {*} query
 */
function checkQuery(query) {
  if (!query.query || query.query.length === 0) {
    throw new Error('Quey is empty. Please enter a search query');
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
  observer.unobserve(elements.galleryEnd);
}

/**
 * Returns image query parameters.
 * @param {number} page - The page number.
 * @returns {Object} - The image query parameters.
 */
function getQuery(page = 1) {
  return {
    query: elements.searchForm.elements.searchQuery.value.trim(),
    page,
    per_page: perPage,
  };
}

/**
 * Displays an error message.
 * @param {*} error
 */
function showErrorMessage(error) {
  console.log(error);
  iziToast.error({
    title: 'Error',
    position: 'topRight',
    message: error.message,
  });
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
