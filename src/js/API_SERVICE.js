import axios from 'axios';
export default class fetchData {
  constructor() {
    this.URL = 'https://pixabay.com/api/';
    this.page = 1;
    this.per_page = 40;
  }

  async makeRequest(ar) {
    const URL_KEY = '34267443-bbee9b7fccdf3a768900f460b';
    const options = {
      params: {
        q: `${ar}`,
        key: URL_KEY,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    };
    const response = await axios.get(this.URL, options);
    console.log(response.data);
    return response.data;
  }
  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}
