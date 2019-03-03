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
                <v-flex xs12>
                  <h2 style="text-align: center">
                    Legg til ny reservasjon
                  </h2>
                </v-flex>
                <v-flex xs12>
                  <h3 style="text-align: center">
                    Dato og tidspunkt
                  </h3>
                  <v-layout
                    row
                    wrap
                    justify-center
                  >
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
                    <v-flex
                      xs12
                      sm6
                      md4
                    >
                      <v-menu
                        ref="startMenu"
                        v-model="menu2"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="startTime"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="startTime"
                          label="Starttid"
                          color="green"
                          prepend-icon="access_time"
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
                          @click:minute="$refs.startMenu.save(startTime)"
                        />
                      </v-menu>
                    </v-flex>
                    <v-flex
                      xs12
                      sm6
                      md4
                    >
                      <v-menu
                        ref="endMenu"
                        v-model="menu3"
                        :close-on-content-click="false"
                        :nudge-right="40"
                        :return-value.sync="endTime"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        max-width="290px"
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="endTime"
                          label="Sluttid"
                          color="green"
                          prepend-icon="directions_walk"
                          readonly
                        />
                        <v-time-picker
                          v-if="menu3"
                          v-model="endTime"
                          color="green"
                          format="24hr"
                          full-width
                          :min="minEndTime"
                          :max="tomorrow"
                          @click:minute="$refs.endMenu.save(endTime)"
                        />
                      </v-menu>
                    </v-flex>
                    <v-flex xs12>
                      <h3 style="text-align: center">
                        Antall gjester og evt. kommentar
                      </h3>
                    </v-flex>
                    <v-form
                      ref="form"
                      v-model="valid"
                    >
                      <v-flex
                        xs12
                      >
                        <v-text-field
                          v-model="numberOfPersons"
                          label="Antall gjester"
                          hint="Hvor mange gjester er det?"
                          prepend-icon="supervised_user_circle"
                          min="1"
                          :rules="capacityRules"
                          type="Number"
                        />
                      </v-flex>
                    </v-form>
                    <v-flex
                      xs8
                    >
                      <v-text-field
                        v-model="comments"
                        label="Kommentar"
                        hint="Er det noe som bør merkes"
                      />
                    </v-flex>
                    <v-flex xs12>
                      <v-divider class="my-2" />
                    </v-flex>
                  </v-layout>
                  <!-- Hvis den ikke loader -->
                  <v-layout
                    v-if="!loading"
                    row
                    wrap
                    justify-center
                  >
                    <v-flex
                      xs12
                    >
                      <h2 style="text-align: center">
                        Ledige bord for valgt tidspunkt
                      </h2>
                    </v-flex>
                    <v-layout
                      row
                      wrap
                      justify-start
                    >
                      <!-- Viser alle bord som er ledige for valgt tidspunkt og antall gjester-->
                      <v-flex
                        v-for="(availabeTable, index) in mountedAvailableTables"
                        :key="index"
                        xs2
                        md2
                      >
                        <div v-if="availabeTable && availabeTable.available">
                          <!-- Hvis valgt bord er dette bordet, endrer den fargen til grønt for å vise hvilket bord man har valgt-->
                          <v-btn
                            v-if="index === selectedTable.tableID-1"
                            my-2
                            color="green"
                            block
                            class="table"
                            @click="selectTable(availabeTable)"
                          >
                            <div class="table-text">
                              <h3 class="text-xs-center">
                                # {{ availabeTable.tableID }}
                              </h3>
                              <div class="text-xs-center">
                                <h3>
                                  {{ availabeTable.capacity }}
                                  <v-icon color="black">
                                    person
                                  </v-icon>
                                </h3>
                              </div>
                            </div>
                          </v-btn>
                          <!-- Bordene som ikke er valgt, men ledgie, er grå-->
                          <v-btn
                            v-else
                            my-2
                            color="grey"
                            block
                            class="table"
                            @click="selectTable(availabeTable)"
                          >
                            <div class="table-text">
                              <h3 class="text-xs-center">
                                # {{ availabeTable.tableID }}
                              </h3>
                              <div class="text-xs-center">
                                <h3>
                                  {{ availabeTable.capacity }}
                                  <v-icon color="black">
                                    person
                                  </v-icon>
                                </h3>
                              </div>
                            </div>
                          </v-btn>
                        </div>
                      </v-flex>
                    </v-layout>
                    <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
                    <div v-if="confirmButton">
                      <v-flex
                        xs12
                        class="my-2"
                      >
                        <h5 style="text-align: center">
                          Fyll ut feltene under hvis du ønsker å lagre informasjon om kunden
                        </h5>
                      </v-flex>
                      <v-flex
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
                      </v-flex>
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
                  </v-layout>
                  <v-layout
                    v-else-if="loading"
                  >
                    <v-progress-circular
                      indeterminate
                      color="green"
                    />
                  </v-layout>
                  <!-- TIlbakemelding hvis det ikke er noen ledige bord -->
                  <v-layout
                    v-else-if="!loading && mountedAvailableTables.length === 0"
                  >
                    <h4
                      style="text-align: center"
                      color="red"
                    >
                      Fant ingen ledige bord for dette antallet personer for valgt tid
                    </h4>
                  </v-layout>
                </v-flex>
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
  name: 'AddReservation',
  // Props arves fra booking
  props: {
    dialogVisible: Boolean,
    table: {
      type: Object,
      default: function () {
        return {
          tableID: 0,
          capacity: '',
          currently: 0,
          occupied: false
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
      date: new Date().toISOString().substr(0, 10), // Dato
      dialog: this.dialogVisible, // Dialog synlig eller ei
      endTime: moment().format('H:mm'), // Sluttid
      endTimeUnix: '', // SLutttid omregnet til unix med hensyn på valgt dato
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
