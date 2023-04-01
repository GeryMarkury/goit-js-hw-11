import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #API_KEY = '34958985-0b491356a8c8280d6665784cd';

  page = 1;
  query = null;

  fetchPhotos() {
    return axios.get(`${this.#BASE_URL}`, {
      params: {
        q: this.query,
        page: this.page,
        per_page: 40,
        key: this.#API_KEY,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true,
      },
    });
  }
}