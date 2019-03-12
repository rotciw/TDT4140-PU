<!-- Brukes for å legge til ny reservasjon-->
<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
    >
      <div>
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <!-- Fyller ut informasjon om reservasjonen-->
              <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
              <div>
                <v-flex
                  xs12
                  class="my-2"
                >
                  <v-flex xs12>
                    <h2
                      style="text-align: center; color: green"
                    >
                      Bordet er ledig for valgt tidspunkt
                    </h2>
                  </v-flex>
                  <h3 style="text-align: center">
                    Fyll ut informasjon om deg selv under
                  </h3>
                </v-flex>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs6>
                    <v-text-field
                      v-model="guestUser.firstName"
                      label="Fornavn"
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="guestUser.lastName"
                      label="Etternavn"
                    />
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs6>
                    <v-text-field
                      v-model="guestUser.email"
                      label="E-post"
                    />
                  </v-flex>
                  <v-flex xs6>
                    <v-text-field
                      v-model="guestUser.mobile"
                      label="Mobil"
                    />
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs12>
                    <v-text-field
                      v-model="comments"
                      label="Kommentar"
                      hint="Er det noe som bør merkes"
                    />
                  </v-flex>
                </v-layout>
                <v-flex
                  xs12
                  mt-3
                >
                  <!-- Lagrer info om kunden -->
                  <div class="text-xs-center">
                    <v-btn
                      color="green"
                      class="button"
                      large
                      @click="confirmReservation"
                    >
                      Lagre reservasjon
                    </v-btn>
                  </div>
                </v-flex>
              </div>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              dark
              round
              flat
              @click="cancel"
            >
              Lukk
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from 'moment'

export default {
  name: 'NewReservation',
  props: {
    dialogVisible: Boolean,
    reservation: {
      type: Object,
      default: function () {
        // TODO: Legge inn alle feltene reservasjon skal ha
        return {
          comments: '',
          created: 0,
          dropIn: false,
          duration: 0,
          endTime: 0,
          guestID: '',
          numberOfPersons: '',
          reservationID: 0,
          startTime: 0,
          tableID: 0,
          uid: ''
        }
      }
    }
  },
  data () {
    return {
      availableTables: [], // Holder alle ledige bord
      // Regler for antall personer man prøver å legge inn
      comments: '', // Kommentarer
      dialog: this.dialogVisible,
      guestUser: { // Gjestebruker
        firstName: '',
        lastName: '',
        mobile: '',
        email: ''
      },
      interval: 0, // Brukes for å opppdatere timeren
      newTable: { // Holder bordet som blir kopiert
        tableID: 0,
        capacity: '',
        currentReservation: null,
        currently: 0,
        occupied: false,
        reservations: []
      },
      numberOfPersons: 1, // Antall personer
      // Styrer synligheten av dropdown menyene
      menu: false,
      menu2: false,
      menu3: false,
      now: 0, // Holder nå-tid
      selectedTable: { // Valgt bord, brukes for å opprette reservasjon og for å vise valgt bord i grønn farge
        tableID: 0
      },
      startTime: moment().format('H:mm'), // Starttid
      startTimeUnix: '', // Starttid med hensyn på valgt dato i unix
      tomorrow: moment().endOf('day').format('H:mm'), // I morgen brukes som maks verdi på tidsvalg
      user: null, // Valgt bruker
      valid: false // Styrer om input er gyldig eller ei
    }
  },
  // Verdier hentet fra storen.
  computed: {
    // bordene i restauranten
    tables () {
      return this.$store.getters.tables
    },
    // Ledige bord for valgt søkeområde
    mountedAvailableTables () {
      return this.$store.getters.availableTables
    },
    // loading
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    // Overvåker starttiden. Hvis den endres sjekker vi om bordet er ledig fortløpende. Hvis sluttiden er etter starttiden, oppdaterer vi sluttiden
    startTime () {
      this.mountAvailableTables()
      if (this.endTime < this.startTime) {
        this.updateEndTime()
      }
    }
  },
  methods: {
    /*
      cancel() lukker dialogen
       */
    cancel () {
      this.newTable = null
      this.confirmButton = true
      this.dialog = false
      this.$emit('dialogClosed')
      this.$store.commit('clearAvailableTables')
    },
    /*
      confirmReservation () lagrer reservasjonen hvis input er gyldig
       */
    confirmReservation () {
      if (this.$refs.form.validate()) {
        const reservationObject = {
          comments: this.comments,
          created: moment().valueOf(),
          duration: this.endTimeUnix - this.startTimeUnix,
          endTime: this.endTimeUnix,
          numberOfPersons: this.numberOfPersons,
          reservationID: 0,
          startTime: this.startTimeUnix,
          tableID: this.selectedTable.tableID
        }
        // SJekker om vi oppretter for kunde eller bruker
        this.$controller.reservations.newReservationNumber()
          .then(reservations => {
            reservations.forEach(reservation => {
              reservation = reservation.data()
              reservationObject.reservationID = reservation.reservationID + 1
              if (this.guestUser.firstName !== '' || this.guestUser.lastName !== '') {
                this.$controller.users.createGuestUser(this.guestUser)
                  .then(guestID => {
                    reservationObject.guestID = guestID
                    reservationObject.uid = ''
                    this.$store.dispatch('createReservation', reservationObject)
                    this.cancel()
                  })
              }
              else {
                reservationObject.uid = this.$store.getters.user.uid
                reservationObject.guestID = ''
                this.$store.dispatch('createReservation', reservationObject)
                this.cancel()
              }
            })
          })
      }
    }
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0px 18px 0px 18px;
  }
</style>
