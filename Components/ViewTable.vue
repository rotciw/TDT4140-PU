<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
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
      dialog: this.dialogVisible,
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
      minutes: [0, 10, 20, 30, 40, 50],
      now: 0,
      remainingTime: 0,
      user: null,
      value: 0
    }
  },
  computed: {
    tables () {
      return this.$store.getters.tables
    }
  },
  mounted () {
    console.log(this.table)
    // Denne løsningen oppdaterer bare referansen.
    if (this.table) {
      this.newTable = this.tables[this.table.tableID - 1]
    }
    if (this.table.currentReservation) {
      this.mountUser()
      this.interval = setInterval(() => {
        this.now = moment().unix()
        // TODO: Fikse value og remainingTime
        this.value = (this.now / this.table.currentReservation.endTime) * 100
        this.remainingTime = moment(this.table.currentReservation.endTime).toNow(true)
      }, 1000)
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
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0px 18px 0px 18px;
  }
</style>
