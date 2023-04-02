import './css/styles.css';
import { PixabayAPI } from './pixabayAPI';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const searchFormEl = document.querySelector('#search-form');
const galleryListEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

const onSearchFormSubmit = async event => { 
    event.preventDefault();
    
    const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();
    pixabayAPI.query = searchQuery;

    try {
      const result = await pixabayAPI.fetchPhotos();
      
      const images = result.data.hits;

    if (!images.length || searchQuery === "") {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      return;
    }

      Notify.success(`Hooray! We found ${result.data.totalHits} images.`);
      
    renderGalleryList(images);
      
    loadMoreBtnEl.classList.remove('is-hidden');
  } catch (err) {
    console.log(err);
  }
};

const renderGalleryList = (list) => {
  const markup = list.map(({ webformatURL, tags, likes, views, comments, downloads }) => {
    return `<div class="photo-card"><img src=${webformatURL} alt=${tags} loading="lazy" /><div class="info"><p class="info-item"><b>Likes ${likes}</b></p><p class="info-item"><b>Views ${views}</b></p><p class="info-item"><b>Comments ${comments}</b></p><p class="info-item"><b>Downloads ${downloads}</b></p></div></div>`
  }).join("");

  galleryListEl.insertAdjacentHTML("beforeend", markup);
};

const onLoadMoreBtnClick = async () => {
  pixabayAPI.page += 1;

  try {
    const result = await pixabayAPI.fetchPhotos();
    const images = result.data.hits;
    const totalPages = Math.floor(result.data.totalHits / 40);

    if (pixabayAPI.page === totalPages) {
      loadMoreBtnEl.classList.add('is-hidden');
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    renderGalleryList(images);
  } catch (err) {
    console.log(err);
  }
};

const clearGallery = (event) => {
  const searchQuery = event.currentTarget.elements['searchQuery'].value.trim();

    if (!searchQuery) {
      galleryListEl.innerHTML = "";
      loadMoreBtnEl.classList.add('is-hidden');
      pixabayAPI.page = 1;
    }
}


searchFormEl.addEventListener('submit', onSearchFormSubmit);
searchFormEl.addEventListener('input', clearGallery)
loadMoreBtnEl.addEventListener('click', onLoadMoreBtnClick);
