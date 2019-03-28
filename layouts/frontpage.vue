<template>
  <v-app>
    <v-toolbar
      tabs
      flat
    >
      <v-flex xs2>
        <nuxt-link
          to="/"
        >
          <v-img
            src="logo-long.png"
            height="50px"
            position="left left"
            contain
          />
        </nuxt-link>
      </v-flex>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          to="/"
          exact
        >
          Hjem
        </v-btn>
      </v-toolbar-items>
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
    <v-content class="bgColor">
      <v-container>
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
        <nuxt />
      </v-container>
    </v-content>
    <v-footer>
      <v-layout
        row
        wrap
        align-center
      >
        <v-flex xs12>
          <div class="text-xs-center">
            <b>Lagd med
              <v-icon class="red--text">
                favorite
              </v-icon>
              av PU-Gruppe 30</b>
          </div>
        </v-flex>
      </v-layout>
    </v-footer>
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
    error (val) {
      this.snackbar = !!(val && val.length > 1)
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
