import Notiflix from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { getRefs } from "./refs";
import { getapi } from "./apiSearch";
const refer = getRefs();
let inputValue = '';
let curPage = 1;
let lightbox = null
const gallery = document.querySelector('.gallery')
const initializeLightbox = () => {
    lightbox = new SimpleLightbox('.gallery a', {
      overlayOpacity: 0.4,
      animationSpeed: 300,
    });
  };
  refer.loadBtn.classList.add('visually-hidden')
const onFormSubmit = async event => {
    event.preventDefault()
    inputValue = event.target.elements.searchQuery.value
    curPage = 1

    if (inputValue.trim() === '') {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        refer.loadBtn.classList.add('visually-hidden')
        return
    }

    const {totaHits, hits} = await getapi(inputValue, curPage)
    // console.log(hits);
    if (hits.length === 0) {
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        refer.loadBtn.classList.add('visually-hidden')
        gallery.innerHTML = '';
        return;
    }
    
    createCard(hits)
    gallery.innerHTML = createCard(hits)
    initializeLightbox()
    lightbox.refresh();
    refer.loadBtn.classList.remove('visually-hidden')
}

const onLoadClick = async () => {
    curPage += 1;
    const {totalHits, hits} = await getapi(inputValue, curPage)
    const totalPages = Math.ceil(totalHits / 40)
    gallery.insertAdjacentHTML('beforeend', createCard(hits))
    
    if (curPage >= totalPages) {
        refer.loadBtn.classList.add('visually-hidden');
        Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
        refer.loadBtn.classList.remove('visually-hidden')
    }
    initializeLightbox()
    lightbox.refresh();
}


refer.form.addEventListener('submit', onFormSubmit)
refer.loadBtn.addEventListener('click', onLoadClick)

const createCard = (param) => {
    const cardMappedHits = param.map(el => {
    const cardHtml = `<div class="photo-card">
        <a href='${el.largeImageURL}'>
            <img src="${el.webformatURL}" alt="${el.tags}" loading="lazy" />
        </a>
        <div class="info">
        <p class="info-item">
            <b>Likes</b>
             ${el.likes}
        </p>
        <p class="info-item">
            <b>Views</b>
            ${el.views}
        </p>
        <p class="info-item">
            <b>Comments</b>
             ${el.comments}
        </p>
        <p class="info-item">
            <b>Downloads</b>
             ${el.downloads}
        </p>
        </div>
    </div>`
    return cardHtml
}).join('');
return cardMappedHits
}
