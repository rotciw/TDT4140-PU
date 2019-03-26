<template>
  <v-app>
    <v-content>
      <v-layout>
        <v-toolbar
          fixed
          light
          color="white"
          style="opacity: 0.75"
          inverted-scroll
          flat
        >
          <v-spacer />
          <!--<v-toolbar-items>
            <v-btn
              flat
              to="/"
              exact
              style="opacity: 1"
            >
              Hjem
            </v-btn>
          </v-toolbar-items>-->
          <v-toolbar-items>
            <v-btn
              flat
              to="/menu"
              exact
            >
              Meny
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn
              flat
              to="/customer-reservation"
              exact
            >
              Bordbestilling
            </v-btn>
          </v-toolbar-items>
          <v-toolbar-items>
            <v-btn
              flat
              to="/login"
              exact
            >
              Logg inn
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
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
      <nuxt />
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
