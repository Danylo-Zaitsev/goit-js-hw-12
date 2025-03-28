import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function responseData(requestWords, page = 1) {
  const params = {
    key: '49272449-54e018c7c1ace9d1b8dfc3596',
    q: requestWords,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 15,
    page,
  };
  try {
    const response = await axios.get('', {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching data from Pixabay API:', error);
    throw error;
  }
}

export function resetPage() {
  currentPage = 1;
}