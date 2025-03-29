import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const gallery = document.querySelector(".gallery");
const lightbox = new SimpleLightbox(".gallery a", {
    captionsData: "alt",
    captionDelay: 250,
});

export function clearGallery() {
    gallery.innerHTML = "";
}

/**
 * @param {Array} images 
 */
export function renderImages(images) {
  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) => `
      <li class="img-card">
        <a href="${largeImageURL}" target="_blank">
          <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        </a>
        <div class="image-info">
          <p>❤️ Likes: <strong>${likes}</strong></p>
          <p>👁 Views: <strong>${views}</strong></p>
          <p>💬 Comments: <strong>${comments}</strong></p>
          <p>⬇ Downloads: <strong>${downloads}</strong></p>
        </div>
      </li>`
    )
    .join('');

  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}