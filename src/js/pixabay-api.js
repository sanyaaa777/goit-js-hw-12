import axios from 'axios';

const API_KEY = '49410735-a7c42e02d1ae980291a09914d';
const BASE_URL = 'https://pixabay.com/api/';
const IMAGES_PER_PAGE = 15;

export async function fetchImages(query, page = 1, per_page = IMAGES_PER_PAGE) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page,
        per_page,
      },
    });

    if (response.status !== 200) {
      throw new Error(`Failed to fetch images. Status: ${response.status}`);
    }

    return response.data;
  } catch (error) {
    console.error('Error loading images:', error.message || error);
    throw error;
  }
}