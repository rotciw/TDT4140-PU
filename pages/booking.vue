<!-- Denne filen inneholder alt av bookingsystemsiden -->
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
        <!-- Knapp for å lage ny reservasjon -->
        <v-btn
          color="green darken-4"
          dark
          large
          class="my-3; button"
          @click="addReservation"
        >
          Ny reservasjon
        </v-btn>
      </v-flex>
    </v-layout>
    <v-divider />
    <!-- Oversikt over hele restauranten. Henter bordene fra storen. Hvert bord er en knapp som kaller på ViewTable -->
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
        <!-- Hvis det er et bord på plasseringen lager vi en knapp -->
        <div v-if="table">
          <!-- Hvis bordet er opptatt viser vi info om reservasjonen -->
          <v-btn
            v-if="table.currentReservation && table.currentReservation.endTime > now"
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
          <!-- Hvis bordet ikke er opptatt viser vi når evt neste reservasjon på bordet er -->
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
    <!-- Komponenten for å vise valgt bord -->
    <view-table
      :key="key"
      :capacity="Number(selectedTable.capacity)"
      :dialog-visible="dialogVisible"
      :table="selectedTable"
      @dialogClosed="dialogVisible = false"
    />
    <!-- Komponent for å legge til ny reservasjon -->
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
  middleware: ['router-check', 'employee'], // Tillater kun personer som er logget inn og som er ansatt
  data () {
    return {
      addReservationVisible: false, // Brukes for å vise/ikke vise add-reservation komponenten
      key: 0, // Nøkkel for å kreve re-rendering av de brukte komponentene
      dialogVisible: false, // Brukes for å vise/ikke vise view-table
      interval: null, // Brukes av klokken
      now: 0, // Regner ut nåverdien. Brukes for å vise om bordene er opptatt eller ikke
      readableTime: '', // Brukes for å vise lesbar tid
      selectedTable: { // Holder valgt bord
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      },
      reservationKey: 9999 // Nøkkel for å kreve rerendering av add-reservation
    }
  },
  // Henter bordene fra storen
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
  // Konverterer tid til et lesbart format. Brukes av bordene som har / får reservasjon
  methods: {
    convertTime (time) {
      return moment(time).format('HH:mm')
    },
    // Kaller på storen
    updateReservations () {
      this.$store.dispatch('mountTodaysTablesWithReservations')
    },
    // Metode for å vise valgt bord
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
    // Metode for å legge til reservasjon
    addReservation () {
      this.addReservationVisible = true
      this.reservationKey++
    }
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0px 18px 0px 18px;
  }
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
