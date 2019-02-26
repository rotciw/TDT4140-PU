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
                  <div class="text-xs-center">
                    <v-progress-circular
                      :size="100"
                      :width="15"
                      :value="value"
                      color="green"
                    >
                      {{ remainingTime }}
                    </v-progress-circular>
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
                <h3 style="text-align: center">
                  Kommende reservasjoner på dette bordet i dag
                </h3>
                <v-flex xs12>
                  <todays-timeline-for-table
                    :reservations="table.reservations"
                  />
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
              Avbryt
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              round
              dark
            >
              Lagre
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
                        <v-btn
                          color="green"
                          class="button"
                          @click="mountAvailableTables()"
                        >
                          Søk
                        </v-btn>
                      </div>
                      <v-divider class="my-2" />
                    </v-flex>
                  </v-layout>
                  <v-layout
                    v-if="mountedAvailableTables.length > 0"
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
                    <v-flex
                      v-for="(availabeTable, index) in mountedAvailableTables"
                      :key="index"
                      xs2
                      md2
                    >
                      <div v-if="availabeTable && availabeTable.available">
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
              Avbryt
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              round
              dark
            >
              Lagre
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
      hours: [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
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
      minutes: [0, 15, 30, 45],
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
    mountedAvailableTables () {
      return this.$store.getters.availableTables
    }
  },
  watch: {
    startTime () {
      this.mountAvailableTables()
    },
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
  mounted () {
    console.log(this.table)
    // Denne løsningen oppdaterer bare referansen.
    if (this.table) {
      this.newTable = this.tables[this.table.tableID - 1]
      if (this.table.currentReservation) {
        this.mountUser()
        console.log(this.table.currentReservation.endTime)
        this.leavingTime = moment(this.table.currentReservation.endTime).format('HH:mm')
        console.log(moment(this.table.currentReservation.endTime))
        this.currentGuests = this.table.currentReservation.numberOfPersons
        this.interval = setInterval(() => {
          this.now = moment().valueOf()
          // TODO: Fikse at en mer representativ verdi blir vist
          this.value = ((this.now - 90000000000) / (this.table.currentReservation.endTime)) * 100
          this.remainingTime = moment(this.table.currentReservation.endTime).toNow(true)
        }, 1000)
      }
    }
    // For å kopiere bordet og få nye referanser er det nødvendig å kopiere feltene sånn som under.
    /* this.newTable.tableID = this.table.tableID
      this.newTable.capacity = this.table.capacity
      this.newTable.currently = this.table.currently
      this.newTable.occupied = this.table.occupied
      if (this.table.currentReservation) {
        this.newTable.currentReservation = this.table.currentReservation
        this.user = this.$controller.users.getUser(this.table.currentReservation.userID)
      }
      if (this.table.reservations) {
        this.table.reservations.forEach(reservation => {
          this.newTable.reservations.push(reservation)
        })
      }
    } */
  },
  methods: {
    cancel () {
      this.newTable = null
      this.confirmButton = true
      this.dialog = false
      this.$emit('dialogClosed')
      this.$store.commit('clearAvailableTables')
    },
    confirmReservation () {
      const reservationObject = {
        comments: this.comments,
        created: moment().valueOf(),
        duration: this.endTimeUnix - this.startTimeUnix,
        endTime: this.endTimeUnix,
        numberOfPersons: this.numberOfPersons,
        reservationID: this.$controller.reservations.newReservationNumber(),
        startTime: this.startTimeUnix,
        tableID: this.selectedTable.tableID
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
    async mountUser () {
      // TODO: Endre til uid
      if (this.table.currentReservation.uid) {
        this.user = await this.$fs.collection('users').doc(this.table.currentReservation.uid + '').get()
          .then(user => {
            user = user.data()
            console.log(user)
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
            console.log(user)
            return user
          })
          .catch(error => {
            console.log('Klarte ikke å hente gjest med guestID: ' + this.table.currentReservation.guestID)
            console.log(error)
          })
      }
    },
    mountAvailableTables () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.$store.dispatch('mountAvailableTables', { numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: this.endTimeUnix })
    },
    selectTable (table) {
      this.selectedTable = table
      console.log(table)
      this.confirmButton = true
    },
    updateReservation () {
      const updateObject = this.table.currentReservation
      updateObject.numberOfPersons = this.currentGuests
      updateObject.endTime = moment(moment().format('YYYY-MM-DD') + ' - ' + this.leavingTime, 'YYYY-MM-DD - HH:mm').valueOf()
      this.$store.dispatch('updateReservation', updateObject)
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
