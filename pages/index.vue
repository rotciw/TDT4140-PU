<template>
  <div>
    <v-layout
      row
      fill-height
    >
      <v-flex xs12>
        <v-carousel
          height="400px"
          class="carousel"
        >
          <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"
            hide-controls
            hide-delimiters
          />
        </v-carousel>
      </v-flex>
    </v-layout>
    <v-container>
      <v-flex xs12>
        <h1
          primary
          style="text-align: center"
        >
          Velkommen til Trippin Tacos
        </h1>
      </v-flex>
    </v-container>
  </div>
</template>

<script>

export default {
  layout: 'frontpage',
  data () {
    return {
      items: [
        {
          src: 'buffet-food-lunch-5944.jpg'
        },
        {
          src: 'burrito-chicken-close-up-461198.jpg'
        }
      ]
    }
  },
  methods: {
    hello123 () {
      return 'wassop'
    }
  }
}
</script>

<style scoped>
  .carousel{
    margin: 0;
  }
</style>
