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
                    </v-layout>
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
                  <v-layout
                    v-else-if="loading"
                  >
                    <v-progress-circular
                      indeterminate
                      color="green"
                    />
                  </v-layout>
                  <v-layout
                    v-else-if="!loading && mountedAvailableTables.length === 0"
                  >
                    <h4
                      style="text-align: center"
                      color="red"
                    >
                      Fant ingen ledige bord for valgt gruppe
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
    },
    loading () {
      return this.$store.getters.loading
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
        reservationID: 0,
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
    },
    mountAvailableTables () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.selectedTable.tableID = 0
      this.confirmButton = false
      this.$store.commit('setLoading', true)
      this.$store.dispatch('mountAvailableTables', { numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: this.endTimeUnix })
    },
    selectTable (table) {
      this.selectedTable = table
      this.confirmButton = true
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
