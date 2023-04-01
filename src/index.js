import './css/styles.css';
import { PixabayAPI } from './pixabayAPI';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

const onSearchFormSubmit = async event => { 
    event.preventDefault();
    
    const searchQuery = event.currentTarget.elements['searchQuery'].value;
    pixabayAPI.query = searchQuery;

    try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (!data.results.length) {
      console.log('Images not found!');
      return;
    }

    data.forEach((result) => {
    const markup = `<div class="photo-card">
  <img src=${result.webformatURL} alt=${result.tags} loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${result.likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${result.views}</b>
    </p>
    <p class="info-item">
      <b>Comments ${result.comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${result.downloads}</b>
    </p>
  </div>
</div>`
            
    galleryListEl.insertAdjacentHTML("beforeend", markup);
    })
    // galleryListEl.innerHTML = createGalleryCards(data.results);
    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const onLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhotos();

    if (pixabayAPI.page === data.total_pages) {
      loadMoreBtnEl.classList.add('is-hidden');
    }

      data.forEach((result) => {
          galleryListEl.insertAdjacentHTML("beforeend", markup);
      });
  } catch (err) {
    console.log(err);
  }
};


searchFormEl.addEventListener('submit', onSearchFormSubmit);
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);