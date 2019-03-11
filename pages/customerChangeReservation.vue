<template>
  <v-container>
    <v-layout
      row
      justify-center
      align-center
    >
      <v-flex
        xs12
        sm12
        md12
      >
        <!-- Dialogen (popup) her er for endring av reservasjonen
      ENDRING AV RESERVASJON START -->
        <v-dialog
          v-model="dialog"
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Endre reservasjonen din her:</span>
            </v-card-title>
            <v-card-text>
              <v-container grid-list-md>
                <v-layout wrap>
                  <!-- .user. på de man skal hente fra users databasen -->
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-text-field
                      v-model="editedSelectedReservation.user.firstName"
                      label="Fornavn"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <!-- Her hentes data fra editedSelectedReservation som er definert under.
                    Disse henter fra users og reservations tabellene i databasen -->
                    <v-text-field
                      v-model="editedSelectedReservation.user.lastName"
                      label="Etternavn"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-text-field
                      v-model="editedSelectedReservation.user.mobile"
                      label="Tlfnr"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-text-field
                      v-model="editedSelectedReservation.user.email"
                      label="Epost"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-text-field
                      v-model="numberOfPersons"
                      label="Antall Personer"
                      min="1"
                      type="number"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-text-field
                      v-model="editedSelectedReservation.comments"
                      label="Kommentarer"
                    />
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-menu
                      ref="startMenu"
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-left="40"
                      :return-value.sync="startTime"
                      lazy
                      transition="scale-transition"
                      offset-x
                      full-width
                      max-width="250px"
                      min-width="250px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="startTime"
                        color="green"
                        prepend-icon="access_time"
                        label="Starttid"
                        readonly
                      />
                      <v-time-picker
                        v-if="menu2"
                        v-model="startTime"
                        color="green"
                        format="24hr"
                        full-width
                        :min="minStartTime"
                        :max="tomorrow"
                        @click:minute="$refs.startMenu.save(startTime); updateMinEndTime()"
                      />
                    </v-menu>
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-menu
                      ref="leavingMenu"
                      v-model="menu1"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      :return-value.sync="endTime"
                      lazy
                      transition="scale-transition"
                      offset-x
                      full-width
                      max-width="250px"
                      min-width="250px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="endTime"
                        color="green"
                        prepend-icon="directions_walk"
                        label="Sluttid"
                        readonly
                      />
                      <v-time-picker
                        v-if="menu1"
                        v-model="endTime"
                        color="green"
                        format="24hr"
                        :min="minEndTime"
                        :max="tomorrow"
                        full-width
                        @click:minute="$refs.leavingMenu.save(endTime)"
                      />
                    </v-menu>
                  </v-flex>
                  <v-flex
                    xs12
                    sm6
                    md4
                  >
                    <v-menu
                      v-model="menu"
                      color="green"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px"
                    >
                      <v-text-field
                        slot="activator"
                        v-model="date"
                        label="Dato"
                        color="green"
                        prepend-icon="event"
                        readonly
                      />
                      <v-date-picker
                        v-model="date"
                        color="green"
                        :min="minDate"
                        @input="menu = false"
                      />
                    </v-menu>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <h3
                v-if="!tableAvailable"
                style="text-align: right; color: red"
              >
                Bordet er ikke ledig for valgt tidspunkt
              </h3>
              <v-spacer />
              <v-btn
                color="red darken-1"
                flat
                @click="close"
              >
                Avbryt
              </v-btn>
              <v-btn
                color="blue darken-1"
                flat
                @click="save"
              >
                Lagre
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- ENDRING AV RESERVASJON DIALOG SLUTT -->
        <h1 style="text-align: center">
          Endre/avbestille reservasjon
        </h1>
        <h3 style="text-align: center">
          Skriv inn din email og reservasjonsnummer for reservasjonen du vil endre/avbestille.
        </h3>
        <br>
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
// Hente gettere fra vuex store
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  layout: 'frontpage',
  data () {
    return {
      email: '', // email til kunden
      reservationID: '', // reservasjonsnummeret til reservasjonen som skal endres
      snackbar: false,
      dialog: false,
      // Hver reservasjon som tilsvarer databasen
      selectedReservation: {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      },
      // For endring av entries skal det opprettes et nytt object også sendes til databasen gjennom denne
      editedSelectedReservation: {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      }
    }
  },
  // Getter for reservasjoner fra Vuex Store. Henter reservations og users fra firestore
  computed: {
    ...mapGetters({
      reservations: 'reservations',
      users: 'users',
      tables: 'tables'
    }),
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
        this.dialog = true
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
      this.$store.dispatch('fetchReservation', { email: this.email, reservationID: this.reservationID, user: this.user })
      this.numberOfPersons = this.reservation.numberOfPersons
      this.startTime = moment(this.reservation.startTime).format('H:mm')
      this.endTime = moment(this.reservation.endTime).format('H:mm')
      this.date = moment(this.reservation.startTime).format('YYYY-MM-DD')
      this.editedSelectedReservation.comments = this.reservation.comments
    },
    close () {
      this.dialog = false
      this.counter = 0
      this.editedSelectedReservation = {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      }
      /* this.endTime = ''
      this.startTime = ''
      this.numberOfPersons = 0
      this.tableID = 0 */
      this.$store.commit('clearAvailability')
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
