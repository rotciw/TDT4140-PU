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
                <v-flex xs3>
                  <v-overflow-btn
                    label="Timer"
                    :items="hours"
                  />
                </v-flex>
                <v-flex xs3>
                  <v-overflow-btn
                    label="Minutter"
                    :items="minutes"
                  />
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
                    >
                      Arkiver reservasjonen
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
                <todays-timeline-for-table
                  :reservations="table.reservations"
                />
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
                      <div class="text-xs-center">
                        <v-btn
                          color="green"
                          @click="mountAvailableTables()"
                        >
                          Søk
                        </v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                  {{ availableTables }}
                  <v-layout
                    v-if="availableTables.length > 0"
                    row
                    wrap
                    justify-center
                  >
                    <v-flex
                      v-for="(availabeTable, index) in availableTables"
                      :key="index"
                      xs2
                      md2
                    >
                      <div v-if="availabeTable">
                        <v-btn
                          v-if="table.currently > 0"
                          my-2
                          color="green"
                          block
                          class="table"
                          @click="viewTable(table)"
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
      // TODO: Legge inn gyldige tidsvalg
      date: new Date().toISOString().substr(0, 10),
      dialog: this.dialogVisible,
      endTime: moment().format('HH:mm'),
      hours: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
      interval: 0,
      newTable: {
        tableID: 0,
        capacity: '',
        currentReservation: null,
        currently: 0,
        occupied: false,
        reservations: []
      },
      menu: false,
      menu2: false,
      menu3: false,
      minutes: [0, 10, 20, 30, 40, 50],
      now: 0,
      remainingTime: 0,
      showTables: false,
      startTime: moment().format('HH:mm'),
      user: null,
      value: 0
    }
  },
  computed: {
    tables () {
      return this.$store.getters.tables
    },
    mountedAvailableTables () {
      return this.$controller.reservations.availableTables(this.startTime, this.endTime)
    }
  },
  watch: {
    mountedAvailableTables (val) {
      this.availableTables = val
      console.log(this.availableTables)
    }
  },
  mounted () {
    console.log(this.table)
    // Denne løsningen oppdaterer bare referansen.
    if (this.table) {
      this.newTable = this.tables[this.table.tableID - 1]
      if (this.table.currentReservation) {
        this.mountUser()
        this.interval = setInterval(() => {
          this.now = moment().unix()
          // TODO: Fikse value og remainingTime
          this.value = (this.now / this.table.currentReservation.endTime) * 100
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
      this.dialog = false
      this.$emit('dialogClosed')
    },
    async mountUser () {
      // TODO: Endre til uid
      this.user = await this.$fs.collection('users').doc(this.table.currentReservation.userID + '').get()
        .then(user => {
          user = user.data()
          console.log(user)
          return user
        })
        .catch(error => {
          console.log('Klarte ikke å hente bruker med uid: ' + this.table.currentReservation.userID)
          console.log(error)
        })
    }
    /* mountAvailableTables () {
      this.mountedAvailableTables = this.$controller.reservations.availableTables(this.startTime, this.endTime)
      console.log(this.availableTables)
      this.showTables = true
    } */
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0px 18px 0px 18px;
  }
</style>
