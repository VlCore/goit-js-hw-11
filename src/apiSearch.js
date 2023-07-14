import Notiflix from "notiflix";
import axios from "axios";

const url = 'https://pixabay.com/api/'

const OPTIONS = {
    key: '38243208-1c51fba615c3da50a804f6e01',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: '1',
    per_page: '40',
}

export const getapi = async(value, curPage) => {
    const searchParams = new URLSearchParams(OPTIONS)
    searchParams.set('q', value)
    searchParams.set('page', curPage)
    const response = await axios.get(`${url}?${searchParams}`)
    return response.data;
}