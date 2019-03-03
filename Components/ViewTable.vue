<!-- Denne komponenten viser info om valgt bord -->
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
      <!-- Denne delen er i bruk hvis det er en aktiv reservasjon på bordet-->
      <div v-if="table.currentReservation">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout
                row
                justify-center
                wrap
              >
                <v-flex
                  xs12
                >
                  <!-- Hvis reservasjonen er aktiv viser vi gjenstående tid -->
                  <div
                    v-if="now < table.currentReservation.endTime"
                    class="text-xs-center"
                  >
                    <v-progress-circular
                      :size="100"
                      :width="15"
                      :value="value"
                      color="green"
                    >
                      {{ remainingTime }} left
                    </v-progress-circular>
                  </div>
                  <!-- Hvis reservasjonen er ferdi kommer det opp en melding om at den er ferdig -->
                  <div v-else>
                    <h2
                      style="text-align: center; color: red"
                    >
                      Denne reservasjonen er ferdig. Lukk denne dialogen eller oppdater tiden.
                    </h2>
                  </div>
                  <!-- Felter som viser informasjon om kunden og om reservasjonen -->
                  <h3
                    style="text-align: center"
                    class="mt-2"
                  >
                    Bord # {{ table.tableID }}
                  </h3>
                  <v-divider />
                  <h5
                    style="text-align: center"
                    class="mt-2"
                  >
                    Reservasjon # {{ table.currentReservation.reservationID }}
                  </h5>
                  <div v-if="user">
                    <h3 style="text-align: center; color: green">
                      Kunde:
                    </h3>
                    <h4 style="text-align: center">
                      {{ user.firstName }} {{ user.lastName }}
                    </h4>
                    <h5
                      v-if="user.mobile"
                      style="text-align: center"
                    >
                      Mobil: {{ user.mobile }}
                    </h5>
                    <h5
                      v-if="user.email"
                      style="text-align: center"
                    >
                      E-post: {{ user.email }}
                    </h5>
                    <h5
                      v-if="table.currentReservation.comments"
                      style="text-align: center"
                    >
                      Kommentar: {{ table.currentReservation.comments }}
                    </h5>
                  </div>
                </v-flex>
              </v-layout>
              <v-layout
                row
                justify-center
                wrap
              >
                <v-flex
                  xs4
                >
                  <!-- Form for å oppdatere antall gjester. Sjekker samtidig at man ikke oppdaterer til mer enn det er plass til på bordet -->
                  <v-form
                    ref="form1"
                    v-model="valid1"
                  >
                    <v-text-field
                      v-model="currentGuests"
                      label="Antall gjester"
                      hint="Hvor mange gjester er det?"
                      prepend-icon="supervised_user_circle"
                      :rules="capacityRules"
                      min="1"
                      type="Number"
                    />
                  </v-form>
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs12>
                  <!-- Viser slutttid til reservasjonen. Kan oppdateres ved drop-down meny -->
                  <h4 style="text-align: center">
                    Sluttid
                  </h4>
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs4>
                  <v-menu
                    ref="leavingMenu"
                    v-model="menu4"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="leavingTime"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="290px"
                    min-width="290px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="leavingTime"
                      label="Sluttid"
                      color="green"
                      prepend-icon="directions_walk"
                      readonly
                    />
                    <v-time-picker
                      v-if="menu4"
                      v-model="leavingTime"
                      color="green"
                      format="24hr"
                      full-width
                      :min="minStartTime"
                      :max="tomorrow"
                      @click:minute="$refs.leavingMenu.save(leavingTime)"
                    />
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs12>
                  <!-- Knapp for å oppdatere reservasjonen, hvis man har endret slutttid eller antall gjester. Kaller på updateReservation () -->
                  <div class="text-xs-center">
                    <v-btn
                      color="green"
                      class="button"
                      large
                      @click="updateReservation"
                    >
                      Oppdater reservasjonen
                    </v-btn>
                  </div>
                </v-flex>
                <v-flex xs12>
                  <!-- Knapp for å si at kunden gikk. Kaller på customerLeft ()-->
                  <div class="text-xs-center">
                    <v-btn
                      color="red"
                      class="button"
                      @click="customerLeft"
                    >
                      Kunden har gått
                    </v-btn>
                  </div>
                  <v-divider
                    class="my-2"
                  />
                </v-flex>
              </v-layout>
              <!-- Komponent som viser de kommende reservasjonen på dette bordet -->
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs12>
                  <div v-if="table.reservations && table.reservations.length > 0">
                    <h3 style="text-align: center">
                      Kommende reservasjoner på dette bordet i dag
                    </h3>
                    <v-flex xs12>
                      <todays-timeline-for-table
                        :reservations="table.reservations"
                      />
                    </v-flex>
                  </div>
                  <div v-else>
                    <h3 style="text-align: center">
                      Ingen andre registrerte reservasjoner på dette bordet i dag.
                    </h3>
                  </div>
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
      <!-- Denne delen vises hvis det ikke er noen aktiv reservasjon på bordet -->
      <div v-else>
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs12>
                  <h2
                    style="text-align: center"
                    class="mb-2"
                  >
                    Legg til ny reservasjon for bord # {{ table.tableID }}
                  </h2>
                </v-flex>
                <v-flex xs12>
                  <!-- Velger dato og tidspunkt. Maks og min blir regnet ut ved mounting av komponenten -->
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
                          :min="minDate"
                          color="green"
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
                    <!-- TODO: Ikke kunne legge inn sluttid som er etter starttid-->
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
                    <!-- Valg for antall gjester og kommentar -->
                    <v-flex xs12>
                      <h3 style="text-align: center">
                        Antall gjester og evt. kommentar
                      </h3>
                    </v-flex>
                    <v-flex
                      xs4
                    >
                      <v-form
                        ref="form"
                        v-model="valid"
                      >
                        <v-text-field
                          v-model="numberOfPersons"
                          label="Antall gjester"
                          min="1"
                          hint="Hvor mange gjester er det?"
                          prepend-icon="supervised_user_circle"
                          :rules="capacityRules"
                          type="Number"
                        />
                      </v-form>
                    </v-flex>
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
                      <div class="text-xs-center">
                        <!--<v-btn
                          color="green"
                          class="button"
                          @click="checkTableAvailability()"
                        >
                          Se om bordet er ledig
                        </v-btn>-->
                      </div>
                      <v-divider class="my-2" />
                    </v-flex>
                  </v-layout>
                  <!-- Del som viser om bordet er ledig for valgt tidspunkt -->
                  <v-layout
                    v-if="!loading"
                    row
                    wrap
                    justify-center
                  >
                    <!-- TableAvailable er en computed variabel som konstant oppdateres ut i fra hva storen returnerer-->
                    <div v-if="tableAvailable">
                      <v-flex
                        xs12
                        class="my-2"
                      >
                        <h3 style="text-align: center; color: green">
                          Bordet er ledig for valgte tidspunkt
                        </h3>
                        <!-- Hvis man ønsker å lagre informasjon om kunden kan dette gjøres her. Enten så må firstName eller lastName til kunden være fylt ut for at dette skal skje-->
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
                        <!-- Knapp som kaller på confirmReservation -->
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
                    <!-- Tilbakemelding hvis ikke bordet er ledig for valgt tidspunkt-->
                    <div v-else>
                      <h4
                        style="text-align: center"
                        color="red"
                      >
                        Bordet er opptatt for valgt tid. Prøv en annen tid eller søk på alle bord ved å trykke på "lukk" og "ny reservasjon".
                      </h4>
                    </div>
                  </v-layout>
                  <!-- Komponent som viser kommende reservasjoner på bordet i dag -->
                  <v-layout
                    row
                    wrap
                    justify-center
                  >
                    <v-flex xs12>
                      <v-divider class="my-3" />
                      <div v-if="table.reservations && table.reservations.length > 0">
                        <h3 style="text-align: center">
                          Kommende reservasjoner på dette bordet i dag
                        </h3>
                        <v-flex xs12>
                          <todays-timeline-for-table
                            :reservations="table.reservations"
                          />
                        </v-flex>
                      </div>
                      <div v-else>
                        <h3 style="text-align: center">
                          Ingen andre registrerte reservasjoner på dette bordet i dag.
                        </h3>
                      </div>
                    </v-flex>
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
import TodaysTimelineForTable from './TodaysTimelineForTable'

export default {
  name: 'ViewTable',
  components: { TodaysTimelineForTable },
  // Props arves fra bookingsiden
  props: {
    capacity: {
      type: Number,
      default: 25
    },
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
      // Regler som brukes for å sjekke at antall personer skrevet inn på bordet er riktig
      capacityRules: [
        v => !!v || 'Trenger kapasiteten',
        v => (v > 0 && v <= this.capacity) || 'Må være mellom 0 og ' + this.capacity
      ],
      comments: '', // Lagrer kommentarene som blir skrevet inn
      currentGuests: 0, // Antall gjester som sitter på bordet hvis det er en aktiv reservasjon
      date: new Date().toISOString().substr(0, 10), // Holder valgt dato
      dialog: this.dialogVisible,
      endTime: moment().format('H:mm'), // Holder valgt sluttid.
      endTimeUnix: '', // Regner om valgt slutttid og dato til unix og millisekunder
      // Objekt som brukes hvis det lagres informasjon om kunden
      guestUser: {
        firstName: '',
        lastName: '',
        mobile: '',
        email: ''
      },
      interval: 0, // Brukes til å oppdatere tiden som er igjen
      leavingTime: null, // Hvis gjestene drar lagres det her
      // Kopi av valgt bord for å ikke få feilmelding i storen
      newTable: {
        tableID: 0,
        capacity: '',
        currentReservation: null,
        currently: 0,
        occupied: false,
        reservations: []
      },
      // Anall personer på bordet
      numberOfPersons: 1,
      // Holder styr på synligheten til de ulike drop down menyene for tid og dato
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      now: 0, // Holder nåtid
      remainingTime: 0, // TId som gjenstår på reservasjonen
      startTime: moment().format('H:mm'), // Holder starttid på reservasjon
      startTimeUnix: '', // Brukes for å regne om til unix tid
      tomorrow: moment().endOf('day').format('H:mm'), // Brukes som maks verdi på klokke og datovelger
      user: null, // Holder informasjon om brukeren reservasjonen står på
      valid: false, // Holder styr på om formene er gyldige
      valid1: false,
      value: 0 // Brukes hvis det er en pågående reservasjon til å regne ut hvor langt circular-progress har kommet
    }
  },
  computed: {
    // Henter bordene fra storen
    tables () {
      return this.$store.getters.tables
    },
    // Sjekker om bordet er ledig
    tableAvailable () {
      return !this.$store.getters.tableAvailable.includes(false)
    },
    // Brukes til å si om storen jobber eller ikke
    loading () {
      return this.$store.getters.loading
    },
    // Minimum starttid på reservasjonen er nå
    minStartTime () {
      if (this.date === new Date().toISOString().substr(0, 10)) return moment().format('H:mm')
      else return '8:00'
    },
    // Mimumslutttid er startttiden
    minEndTime () {
      return this.startTime
    },
    // Mimum dato er i dag
    minDate () {
      return new Date().toISOString().substr(0, 10)
    }
  },
  watch: {
    // Overvåker starttiden. Hvis den endres sjekker vi om bordet er ledig fortløpende. Hvis sluttiden er etter starttiden, oppdaterer vi sluttiden
    startTime () {
      this.checkTableAvailability()
      if (this.endTime < this.startTime) {
        this.updateEndTime()
      }
    },
    // Overvåker feltene. Hvis noen av de endres oppdaterer vi sjekken.
    endTime () {
      this.checkTableAvailability()
    },
    // Her sjekker vi i tillegg at antall personer skrevet inn er gyldig valg
    numberOfPersons () {
      if (this.$refs.form.validate()) this.checkTableAvailability()
    },
    date () {
      this.checkTableAvailability()
    }
  },
  beforeDestroy () {
    this.checkTableAvailability()
  },
  mounted () {
    // Denne løsningen oppdaterer bare referansen, men fungerer for øyeblikket.
    /* Sjekker om vi har et bord, henter i såfall bordet, og sjekker at reservasjonen fortsatt er gyldig.
     Hvis den ikke er gyldig kalles customerLeft(), hvis den er gyldig mounter vi informasjon om reservasjonen og oppdaterer tidsverdiene,
     samt at vi lager en timer som oppdaterer gjenstående tid
     */
    if (this.table) {
      this.newTable = this.tables[this.table.tableID - 1]
      if (this.table.currentReservation) {
        if (this.table.currentReservation.endTime < this.now) {
          this.customerLeft()
        }
        else {
          this.mountUser()
          this.leavingTime = moment(this.table.currentReservation.endTime).format('HH:mm')
          this.currentGuests = this.table.currentReservation.numberOfPersons
          this.interval = setInterval(() => {
            this.now = moment().valueOf()
            this.value = ((this.now - this.table.currentReservation.startTime) / (this.table.currentReservation.endTime - this.table.currentReservation.startTime)) * 100
            this.remainingTime = moment(this.table.currentReservation.endTime).toNow(true)
          }, 1000)
        }
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
      if (this.table.currentReservation && (this.table.currentReservation.endTime > this.now)) {
        this.$store.dispatch('mountTodaysTablesWithReservations')
      }
    },
    /*
    checkTableAvailability sjekker om bordet er ledig for valgt tidspunkt. Må regne om til unix ved å ta hensyn til valgt dato
     */
    checkTableAvailability () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.$store.dispatch('checkAvailability', { tableID: this.table.tableID, numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: this.endTimeUnix })
    },
    /*
    confirmReservation brukes for å lagre en reservasjon. Først sjekkes det at formet har gyldige inputs, deretter lages
    en gjestebruker hvis det er lagt inn informasjon om kunden, og gjesteIDen kobles til reservasjonen.
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
          tableID: this.table.tableID
        }
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
    /*
    customerLeft () brukes hvis kunden forlater restauranten. Oppdaterer også med data fra feltene.
     */
    customerLeft () {
      const updateObject = this.table.currentReservation
      updateObject.numberOfPersons = this.currentGuests
      updateObject.endTime = moment().valueOf()
      this.$store.dispatch('updateLiveReservation', updateObject)
      this.cancel()
    },
    // Mounter informasjon om brukeren som er koblet til reservasjonen, enten user eller guestUser
    async mountUser () {
      if (this.table.currentReservation.uid) {
        this.user = await this.$fs.collection('users').doc(this.table.currentReservation.uid + '').get()
          .then(user => {
            user = user.data()
            return user
          })
          .catch(error => {
            console.log('Klarte ikke å hente bruker med uid: ' + this.table.currentReservation.uid)
            console.log(error)
          })
      }
      else if (this.table.currentReservation.guestID) {
        this.user = await this.$fs.collection('guestUsers').doc(this.table.currentReservation.guestID + '').get()
          .then(user => {
            user = user.data()
            return user
          })
          .catch(error => {
            console.log('Klarte ikke å hente gjest med guestID: ' + this.table.currentReservation.guestID)
            console.log(error)
          })
      }
    },
    // Oppdaterer pågående reservasjon
    updateReservation () {
      if (this.$refs.form1.validate()) {
        const updateObject = this.table.currentReservation
        updateObject.numberOfPersons = this.currentGuests
        updateObject.endTime = moment(moment().format('YYYY-MM-DD') + ' - ' + this.leavingTime, 'YYYY-MM-DD - HH:mm').valueOf()
        this.$store.dispatch('updateLiveReservation', updateObject)
      }
    },
    // Oppdaterer slutttid hvis starttiden er større en slutttiden
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
</style>
