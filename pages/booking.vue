<template>
  <v-container>
    <v-layout
      column
      align-center
      justify-start
    >
      <v-flex
        xs12
      >
        <h1 style="text-align: center">
          Oversikt over restauranten
        </h1>
        <h2 style="text-align: center">
          <v-icon>access_time</v-icon> {{ readableTime }}
        </h2>
        <h4 style="text-align: center">
          Endre status på bordene ved å trykke på dem
        </h4>
      </v-flex>
      <v-flex
        xs12
      >
        <v-btn
          color="green darken-4"
          dark
          large
          class="my-3"
          @click="addReservation"
        >
          Ny reservasjon
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider />
    <v-layout
      row
      wrap
      align-start
      justify-start
      class="my-4"
    >
      <v-flex
        v-for="(table, index) in tables"
        :key="index"
        xs2
        md2
      >
        <div v-if="table">
          <v-btn
            v-if="table.currentReservation"
            my-2
            color="red"
            block
            class="table"
            @click="viewTable(table)"
          >
            <v-flex class="mt-2">
              <div class="table-text">
                <h3 class="text-xs-center">
                  # {{ table.tableID }}
                </h3>
                <div class="text-xs-center">
                  <h3>
                    {{ table.currentReservation.numberOfPersons }}/{{ table.capacity }}
                    <v-icon color="black">
                      person
                    </v-icon>
                  </h3>
                  <h3 style="padding-bottom: 0">
                    {{ convertTime(table.currentReservation.endTime) }}
                    <v-progress-linear
                      :value=" ((now - table.currentReservation.startTime) / (table.currentReservation.endTime - table.currentReservation.startTime)) * 100"
                      style="padding: 0; margin: 0"
                      color="black"
                    />
                  </h3>
                </div>
              </div>
            </v-flex>
          </v-btn>
          <v-btn
            v-else
            my-2
            color="green"
            block
            class="table"
            @click="viewTable(table)"
          >
            <v-flex class="mt-2">
              <div class="table-text">
                <h3 class="text-xs-center">
                  # {{ table.tableID }}
                </h3>
                <div class="text-xs-center">
                  <h3>
                    {{ table.curently }}/{{ table.capacity }}
                    <v-icon color="black">
                      person
                    </v-icon>
                  </h3>
                  <h3 v-if="table.reservations && table.reservations.length > 0">
                    <v-icon>access_time</v-icon> {{ convertTime(table.reservations[0].startTime) }}
                  </h3>
                </div>
              </div>
            </v-flex>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <view-table
      :key="key"
      :dialog-visible="dialogVisible"
      :table="selectedTable"
      @dialogClosed="dialogVisible = false"
    />
    <add-reservation
      :key="reservationKey"
      :dialog-visible="addReservationVisible"
      @dialogCLosed="addReservationVisibled = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import ViewTable from '../Components/ViewTable'
import AddReservation from '../Components/AddReservation'

export default {
  components: { AddReservation, ViewTable },
  // TODO: Legge til middleware
  data () {
    return {
      addReservationVisible: false,
      key: 0,
      dialogVisible: false,
      interval: null,
      now: 0,
      readableTime: '',
      selectedTable: {
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      },
      reservationKey: 9999,
      updateInterval: null
    }
  },
  computed: {
    ...mapGetters({
      tables: 'tables'
    })
  },
  mounted () {
    // Oppdaterer reservasjoner. Hver gang det skjer en endring i databasen på reservations, vil dette automatisk oppdateres
    this.updateReservations()
    // Oppdaterer klokken hvert sekund
    this.interval = setInterval(() => {
      this.now = moment().valueOf()
      this.readableTime = moment().format('HH:mm:ss')
    }, 1000)
  },
  methods: {
    convertTime (time) {
      return moment(time).format('HH:mm')
    },
    // Kaller på storen
    updateReservations () {
      this.$store.dispatch('mountTodaysTablesWithReservations')
    },
    viewTable (table) {
      if (table === null) {
        this.selectedTable = {
          tableID: 0
        }
      }
      else this.selectedTable = table
      this.dialogVisible = true
      this.key++
    },
    addReservation () {
      this.addReservationVisible = true
      this.reservationKey++
    }
  }
}
</script>

<style scoped>
  .table {
    height:120px;
    width:120px;
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
