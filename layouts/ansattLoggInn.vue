<template>
  <v-app>
    <v-content class="bgColor">
      <v-layout>
        <v-snackbar
          v-model="snackbar"
          top
        >
          {{ error }}
          <v-btn
            color="green"
            flat
            @click="onDismissed"
          >
            Lukk
          </v-btn>
        </v-snackbar>
      </v-layout>
      <v-img
        src="buffet-food-lunch-5944.jpg"
      >
        <nuxt />
      </v-img>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      snackbar: false
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    error () {
      this.snackbar = true
    }
  },
  methods: {
    onDismissed () {
      this.snackbar = false
      this.$store.dispatch('clearError')
    }
  }
}
</script>

<style scoped>
  .bgColor {
    background-color: #D1DFD2;
  }
</style>
