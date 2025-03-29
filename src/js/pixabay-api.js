import axios from "axios";

const API_KEY = "49411735-b32ab4d57ab72698c2bda355f";
const URL = "https://pixabay.com/api/";

/**
 Pixabay
 * @param {string} query
 * @param {number} page 
 * @param {number} perPage 
 * @returns {Promise<{images: Array, totalHits: number}>}
 */
export async function fetchImages(query, page = 1, perPage = 40) {
    try {
        const response = await axios.get(URL, {
            params: {
                key: API_KEY,
                q: query,
                image_type: "photo",
                orientation: "horizontal",
                safesearch: "true",
                page,
                per_page: perPage,
            },
        });

        return {
            images: response.data.hits,
            totalHits: response.data.totalHits,
        };
    } catch (error) {
        console.error("Error fetching images:", error);
        throw error;
    }
}