import { fetchImages } from './js/pixabay-api';
import {
  renderGallery,
  clearGallery,
  toggleLoadMoreButton,
  smoothScroll,
  showLoader,
  hideLoader,
} from './js/render-functions';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const searchForm = document.querySelector('.form');
const searchInput = document.querySelector('#search-input');
const loadMoreBtn = document.querySelector('#load-more');
let currentPage = 1;
let currentQuery = '';
let totalHits = 0;
const IMAGES_PER_PAGE = 15;

searchForm.addEventListener('submit', async event => {
  event.preventDefault();

  currentQuery = searchInput.value.trim();

  if (!currentQuery) {
    iziToast.error({
      title: 'Error',
      message: 'Enter a search query',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  currentPage = 1;
  toggleLoadMoreButton(false);
  showLoader();

  try {
    const { hits, totalHits: total } = await fetchImages(
      currentQuery,
      currentPage
    );
    totalHits = total;
    renderGallery(hits);

    if (hits.length > 0 && hits.length < totalHits) {
      toggleLoadMoreButton(true);
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch images. Try again.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

loadMoreBtn.addEventListener('click', async () => {
  currentPage++;
  showLoader();

  try {
    const { hits } = await fetchImages(currentQuery, currentPage);
    renderGallery(hits);
    smoothScroll();

    if (currentPage * IMAGES_PER_PAGE >= totalHits) {
      toggleLoadMoreButton(false);
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results",
        position: 'topRight',
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to fetch more images.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});

