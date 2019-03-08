<template>
  <v-container>
    <v-layout
      row
      justify-center
      align-center
    >
      <v-flex
        xs12
        sm5
        md5
      >
        <img
          src="logo-long.png"
          height="150px"
          contain
          style="margin-bottom:10px"
        >
        <h1 style="text-align: center">
          Endre/avbestille reservasjon
        </h1>
        <h3 style="text-align: center">
          Skriv inn din email og reservasjonsnummer for reservasjonen du vil endre/avbestille.
        </h3>
      </v-flex>
    </v-layout>
    <v-layout
      row
      justify-center
      align-center
    >
      <v-flex
        xs12
        sm5
        md5
      >
        <div class="loginbox">
          <form @submit.prevent="onFetch">
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
                id="reservationnumber"
                v-model="reservationID"
                class="roundedCorners"
                prepend-inner-icon="restaurant"
                name="reservationnumber"
                label="Reservasjonsnummer"
                type="reservationnumber"
                required
              />
            </v-card-text>
            <div class="text-xs-center">
              <v-btn
                id="searchBtn"
                type="submit"
                :disabled="loading"
                :loading="loading"
                large
                color="#6BE096"
                class="roundedCorners"
              >
                Søk
              </v-btn>
            </div>
          </form>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-snackbar
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
      </v-snackbar>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  layout: 'frontpage',
  data () {
    return {
      email: '', // email til kunden
      reservationID: '', // reservasjonsnummeret til reservasjonen som skal endres
      snackbar: false
    }
  },
  computed: {
    reservation () {
      return this.$store.getters.reservation
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    reservation (val) {
      console.log('hallo')
      if (val !== null && val !== undefined) {
        console.log(this.reservation)
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
    // Kaller på storen for å logge oss inn
    onFetch () {
      this.$store.dispatch('fetchReservation', { email: this.email, reservationID: this.reservationID })
    }
  }
}
</script>

<style scoped>
  .loginbox{
    height:300px;
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
