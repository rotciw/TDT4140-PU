<template>
  <v-container>
    <v-layout
      column
      justify-center
      align-center
    >
      <img
        src="logo-clean.png"
        height="150px"
        contain
        style="margin-bottom:50px"
        @click="$router.push('/')"
      >
      <v-flex
        xs12
        sm5
        md5
      >
        <!-- Kommentar -->
        <div class="loginbox">
          <h2
            class="text-xs-center"
          >
            Ansattlogin
          </h2>
          <form @submit.prevent="onSignin">
            <v-card-text>
              <v-text-field
                id="username"
                v-model="email"
                class="roundedCorners"
                prepend-inner-icon="person"
                name="login"
                label="Email"
                type="email"
                required
              />
              <v-text-field
                id="password"
                v-model="password"
                class="roundedCorners"
                prepend-inner-icon="lock"
                name="password"
                label="Passord"
                type="password"
                required
              />
            </v-card-text>
            <div class="text-xs-center">
              <v-btn
                id="loginBtn"
                type="submit"
                :disabled="loading"
                :loading="loading"
                large
                color="#6BE096"
                class="roundedCorners"
              >
                Logg inn
              </v-btn>
            </div>
          </form>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <!--<v-snackbar
        v-model="snackbar"
        top
      >
        {{ error }}
        <v-btn
          color="pink"
          flat
          @click="onDismissed"
        >
          Lukk
        </v-btn>
      </v-snackbar>-->
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'ansattLoggInn',
  data () {
    return {
      email: '', // Email til brukeren
      password: '', // Passord til brukeren
      snackbar: false // Om snackbaren skal være synlig eller ei. TODO: FLytte denne over til en global snackbar
    }
  },
  // Henter vaiabler fra storen
  computed: {
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  // Følger med på å om vi skal logge inn eller ikke
  watch: {
    user (val) {
      if (val !== null && val !== undefined) {
        this.$router.push('/dashboard')
      }
    },
    error () {
      this.snackbar = true
    }
  },
  methods: {
    // Hvis brukeren lukker snackbaren
    onDismissed () {
      this.$store.dispatch('clearError')
      this.snackbar = false
    },
    // Kaller på sotren for å logge oss inn
    onSignin () {
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
      this.$store.dispatch('mountReservations')
      // this.$store.dispatch('mountTables')
    }
  }
}
</script>

<style scoped>
  .loginbox{
    height:320px;
    width: 450px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }
</style>
