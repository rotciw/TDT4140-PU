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
                  <div v-else>
                    <h2
                      style="text-align: center; color: red"
                    >
                      Denne reservasjonen er ferdig. Lukk denne dialogen eller oppdater tiden.
                    </h2>
                  </div>
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
                  <v-text-field
                    v-model="currentGuests"
                    label="Antall gjester"
                    hint="Hvor mange gjester er det?"
                    prepend-icon="supervised_user_circle"
                  />
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex xs12>
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
                          @click:minute="$refs.endMenu.save(endTime)"
                        />
                      </v-menu>
                    </v-flex>
                    <v-flex xs12>
                      <h3 style="text-align: center">
                        Antall gjester og evt. kommentar
                      </h3>
                    </v-flex>
                    <v-flex
                      xs4
                    >
                      <v-text-field
                        v-model="numberOfPersons"
                        label="Antall gjester"
                        hint="Hvor mange gjester er det?"
                        prepend-icon="supervised_user_circle"
                      />
                    </v-flex>
                    <v-flex
                      xs8
                    >
                      <v-text-field
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
                  <v-layout
                    v-if="!loading"
                    row
                    wrap
                    justify-center
                  >
                    <div v-if="tableAvailable">
                      <v-flex
                        xs12
                        class="my-2"
                      >
                        <h3 style="text-align: center; color: green">
                          Bordet er ledig for valgte tidspunkt
                        </h3>
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
                    <div v-else>
                      <h4
                        style="text-align: center"
                        color="red"
                      >
                        Bordet er opptatt for valgt tid. Prøv en annen tid eller søk på alle bord ved å trykke på "avbryt" og "ny reservasjon".
                      </h4>
                    </div>
                  </v-layout>
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
      availableTables: [],
      confirmButton: false,
      comments: '',
      currentGuests: 0,
      // TODO: Legge inn gyldige tidsvalg
      date: new Date().toISOString().substr(0, 10),
      dialog: this.dialogVisible,
      endTime: moment().format('H:mm'),
      endTimeUnix: '',
      guestUser: {
        firstName: '',
        lastName: '',
        mobile: '',
        email: ''
      },
      interval: 0,
      leavingTime: null,
      newTable: {
        tableID: 0,
        capacity: '',
        currentReservation: null,
        currently: 0,
        occupied: false,
        reservations: []
      },
      numberOfPersons: 0,
      menu: false,
      menu2: false,
      menu3: false,
      menu4: false,
      newQuerry: true,
      now: 0,
      remainingTime: 0,
      selectedTable: {
        tableID: 0
      },
      showTables: false,
      startTime: moment().format('H:mm'),
      startTimeUnix: '',
      user: null,
      value: 0
    }
  },
  computed: {
    tables () {
      return this.$store.getters.tables
    },
    tableAvailable () {
      return this.$store.getters.tableAvailable
    },
    loading () {
      return this.$store.getters.loading
    }
  },
  watch: {
    startTime () {
      this.checkTableAvailability()
    },
    endTime () {
      this.checkTableAvailability()
    },
    numberOfPersons () {
      this.checkTableAvailability()
    },
    date () {
      this.checkTableAvailability()
    }
  },
  beforeDestroy () {
    this.checkTableAvailability()
  },
  mounted () {
    // Denne løsningen oppdaterer bare referansen.
    if (this.table) {
      this.newTable = this.tables[this.table.tableID - 1]
      if (this.table.currentReservation) {
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
  },
  methods: {
    cancel () {
      this.newTable = null
      this.confirmButton = true
      this.dialog = false
      this.$emit('dialogClosed')
      this.$store.commit('clearAvailableTables')
      this.$store.dispatch('mountTodaysTablesWithReservations')
    },
    checkTableAvailability () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.newQuerry = true
      this.$store.dispatch('checkAvailability', { tableID: this.table.tableID, numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: this.endTimeUnix })
      this.newQuerry = false
    },
    confirmReservation () {
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
            if (this.guestUser.firstName !== '' && this.guestUser.lastName !== '') {
              this.$controller.users.createGuestUser(this.guestUser)
                .then(guestID => {
                  reservationObject.guestID = guestID
                  this.$store.dispatch('createReservation', reservationObject)
                  this.cancel()
                })
            }
            else {
              reservationObject.uid = this.$store.getters.user.uid
              this.$store.dispatch('createReservation', reservationObject)
              this.cancel()
            }
          })
        })
    },
    customerLeft () {
      const updateObject = this.table.currentReservation
      updateObject.numberOfPersons = this.currentGuests
      updateObject.endTime = moment().valueOf()
      this.$store.dispatch('updateLiveReservation', updateObject)
      this.cancel()
    },
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
    selectTable (table) {
      this.selectedTable = table
      this.confirmButton = true
    },
    updateReservation () {
      const updateObject = this.table.currentReservation
      updateObject.numberOfPersons = this.currentGuests
      updateObject.endTime = moment(moment().format('YYYY-MM-DD') + ' - ' + this.leavingTime, 'YYYY-MM-DD - HH:mm').valueOf()
      this.$store.dispatch('updateLiveReservation', updateObject)
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
