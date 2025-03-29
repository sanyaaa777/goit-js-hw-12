import { fetchImages } from './js/pixabay-api.js';
import { renderImages, clearGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const input = document.querySelector('#input');
const gallery = document.querySelector('.gallery');
const loadingMessage = document.querySelector('#loading-message');

const loadMoreBtn = document.createElement('button');
loadMoreBtn.textContent = 'Load more';
loadMoreBtn.id = 'load-more-btn';
loadMoreBtn.style.display = 'none';
document.body.appendChild(loadMoreBtn);

let query = '';
let page = 1;
const perPage = 15;
let totalHits = 0;

form.addEventListener('submit', async event => {
  event.preventDefault();
  query = input.value.trim();

  if (!query) return;

  page = 1;
  clearGallery();
  loadMoreBtn.style.display = 'none';
  loadingMessage.style.display = 'block';

  try {
    const { images, totalHits: newTotalHits } = await fetchImages(
      query,
      page,
      perPage
    );
    totalHits = newTotalHits;

    if (images.length === 0) {
      iziToast.warning({
        title: 'Warning',
        message: 'No images found. Try another search!',
        position: 'topRight',
      });
      return;
    }

    renderImages(images);

    if (totalHits <= perPage) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
    }

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images!`,
      position: 'topRight',
    });
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
    console.error('Error fetching images:', error);
  } finally {
    loadingMessage.style.display = 'none';
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  loadMoreBtn.style.display = 'none';
  loadingMessage.style.display = 'block';

  try {
    const { images } = await fetchImages(query, page, perPage);
    renderImages(images);

    const galleryHeight = gallery.getBoundingClientRect().height;
    window.scrollBy({
      top: galleryHeight * 0.5,
      behavior: 'smooth',
    });

    const totalLoadedImages = page * perPage;
    if (totalLoadedImages >= totalHits) {
      loadMoreBtn.style.display = 'none';
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      loadMoreBtn.style.display = 'block';
    }
  } catch (error) {
    iziToast.error({
      title: 'Error',
      message: 'Failed to load more images.',
      position: 'topRight',
    });
    console.error('Error loading more images:', error);
  } finally {
    loadingMessage.style.display = 'none';
  }
});
