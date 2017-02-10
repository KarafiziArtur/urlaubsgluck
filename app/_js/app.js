const API_URL = 'https://pixabay.com/api/';
const API_KEY = '773085-762cd7221136451dfa34a6a5e';
const PHOTOS_PER_PAGE = 7;

// Fetching photos from Pixabay API
const searchIdeas = (searchQuery) => {
  return fetch(`${API_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&pretty=true&per_page=${PHOTOS_PER_PAGE}`)
    .then((data) => {
      return data.json();
    })
    .then(data => {
      return data.hits;
    });
};

const sliders = [
  {
    id: 0,
    badge: 'Step 1',
    title: 'Sed leo enim, condimentum',
    text: 'Quisque libero libero, dictum non turpis in, luctus semper lorem. Donec rhoncus a leo sit amet facilisis.',
    image: '/images/step-1.jpg'
  },
  {
    id: 1,
    badge: 'Step 2',
    title: 'Morbi velit risus',
    text: 'Nulla venenatis tempor dui in molestie. Nulla quis dictum purus, sit amet porttitor est.',
    image: '/images/step-2.jpg'
  },
  {
    id: 2,
    badge: 'Step 3',
    title: 'Sed leo enim, condimentum',
    text: 'Quisque libero libero, dictum non turpis in, luctus semper lorem. Donec rhoncus a leo sit amet facilisis.',
    image: '/images/step-3.jpg'
  }
];

Vue.component('Slider', {
  template: `
    <div class="how-it-works__slider slider"
         v-bind:style="{ backgroundImage: 'url(' + slider.image + ')' }">
        <div class="slider__info">
            <span class="slider__step" v-text="slider.badge"></span>
            <div class="slider__title" v-text="slider.title"></div>
            <div class="slider__text"  v-text="slider.text"></div>
            <span class="slider__prev" @click="prevSlide"></span>
            <span class="slider__next" @click="nextSlide"></span>
        </div>
    </div>
  `,
  props: ['current'],
  data() {
    return {
      activeSlider: +this.current,
      slider: sliders[this.current]
    };
  },
  methods: {
    prevSlide() {
      this.activeSlider =  this.activeSlider === 0 ? sliders.length - 1 : this.activeSlider - 1;
      this.slider = sliders[this.activeSlider];
    },
    nextSlide() {
      this.activeSlider = this.activeSlider === (sliders.length - 1) ? 0 : this.activeSlider + 1;
      this.slider = sliders[this.activeSlider];
    }
  }

});

new Vue({
  el: '#app',
  data: {
    ideas: [],
    searchIdeaQuery: '',
    title: 'URLAUBSGLÜCK',
    sliders
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
