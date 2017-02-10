window.onload = () => {

  const API_URL = 'https://pixabay.com/api/';
  const API_KEY = '773085-762cd7221136451dfa34a6a5e';
  const PHOTOS_PER_PAGE = 7;
  const searchIdeas = (searchQuery) => {
    return fetch(`${API_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&pretty=true&per_page=${PHOTOS_PER_PAGE}`)
      .then((data) => {
        return data.json();
      })
      .then(data => {
        return data.hits;
      });
  };

  new Vue({
    el: '#app',
    data: {
      ideas: [],
      searchIdeaQuery: '',
      title: 'URLAUBSGLÜCK'
    },
    methods: {
      onSearchIdea(e) {
        e.preventDefault();
        searchIdeas(this.searchIdeaQuery)
            .then(ideas => this.ideas = ideas);
      }
    },
    created() {
      searchIdeas("flowers")
          .then(ideas => this.ideas = ideas);
    }
  });
};