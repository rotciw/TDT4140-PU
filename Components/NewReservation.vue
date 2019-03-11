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
              <v-layout
                row
                wrap
                justify-center
              >
                <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
                <div v-if="confirmButton">
                  <v-flex
                    xs12
                    class="my-2"
                  >
                    <h5 style="text-align: center">
                      Fyll ut informasjon om deg selv under
                    </h5>
                  </v-flex>
                  <v-layout
                    xs12
                  >
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
                  </v-layout>
                </div>
              </v-layout>
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
      confirmButton: false, // Brukes til å vise neste steg etter at bord er valgt
      // Regler for antall personer man prøver å legge inn
      capacityRules: [
        v => !!v || 'Trenger antall',
        v => (v > 0 && v < 75) || 'Må være mellom 0 og 75'
      ],
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
      numberOfPersons: 1, // ANtall personer
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
    },
    // Mimimumsvalg for tid og dato
    minStartTime () {
      if (this.date === new Date().toISOString().substr(0, 10)) return moment().format('H:mm')
      else return '8:00'
    },
    minEndTime () {
      return this.startTime
    },
    minDate () {
      return new Date().toISOString().substr(0, 10)
    }
  },
  watch: {
    // Overvåker starttiden. Hvis den endres sjekker vi om bordet er ledig fortløpende. Hvis sluttiden er etter starttiden, oppdaterer vi sluttiden
    startTime () {
      this.mountAvailableTables()
      if (this.endTime < this.startTime) {
        this.updateEndTime()
      }
    },
    // Overvåker feltene. Hvis noen av de endres oppdaterer vi ledige bord.
    endTime () {
      this.mountAvailableTables()
    },
    numberOfPersons () {
      this.mountAvailableTables()
    },
    date () {
      this.mountAvailableTables()
    }
  },
  beforeDestroy () {
    this.mountAvailableTables()
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
    },
    // Mounter ledige bord for valgt tidsperiode igjennom storen
    mountAvailableTables () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.selectedTable.tableID = 0
      this.confirmButton = false
      this.$store.commit('setLoading', true)
      this.$store.dispatch('mountAvailableTables', {
        numberOfPersons: this.numberOfPersons,
        startTime: this.startTimeUnix,
        endTime: this.endTimeUnix
      })
    },
    // Velger bord
    selectTable (table) {
      this.selectedTable = table
      this.confirmButton = true
    },
    // Kalles når starttid er større enn sluttid
    updateEndTime () {
      this.endTime = this.startTime
    }
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0px 18px 0px 18px;
  }
  .table {
    height:90px;
    width:90px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .table-text {
    word-wrap: break-word;
    overflow: hidden;
    height: 100%;
    white-space:normal;
  }
</style>
