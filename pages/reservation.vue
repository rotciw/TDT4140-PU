<!--Denne siden gjør det mulig for kunder å legge inn reservasjon-->
<template>
  <v-container>
    <v-layout
      column
      justify-center
      align-center
    >
      <v-layout
        row
        justify-center
        align-center
      >
        <v-flex
          xs12
          sm12
          md12
        >
          <h1 style="text-align: center">
            Bordbestilling
          </h1>
          Ved å trykke bekreft, aksepterer du våre
          <a
            target="_blank"
            href="/termsAndConditions"
          >
            vilkår og betingelser.
          </a>
          <br>
          <br>
        </v-flex>
      </v-layout>
      <!--Her legger kunden inn tidspunkt, dato og antall personer-->
      <div class="loginbox">
        <v-flex
          xs12
          sm10
          md11
        >
          <!--Meny for dato-->
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
          sm10
          md11
        >
          <!--Meny for starttid-->
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
              :allowed-hours="allowedHours"
              :allowed-minutes="allowedMinutes"
              color="green"
              format="24hr"
              full-width
              :min="minStartTime"
              @click:minute="$refs.startMenu.save(startTime)"
            />
          </v-menu>
        </v-flex>
        <v-flex
          xs12
          sm12
          md11
        >
          <!--Meny for antall personer-->
          <v-text-field
            v-model="numberOfPersons"
            label="Antall gjester"
            hint="Hvor mange gjester er det?"
            prepend-icon="supervised_user_circle"
            min="1"
            type="Number"
          />
        </v-flex>
        <div class="text-xs-center">
          <v-btn
            large
            color="#6BE096"
            class="roundedCorners"
            :loading="loading"
            @keydown.enter.prevent="requestTables"
            @click="requestTables"
          >
            Bekreft
          </v-btn>
        </div>
      </div>
      <br>
    </v-layout>
    <!-- Komponent for å legge til ny reservasjon -->
    <new-reservation
      :key="reservationKey"
      :dialog-visible="newReservationVisible"
      :reservation="reservation"
      :global-step="3"
      @dialogCLosed="newReservationVisible = false; disabled = false"
    />
  </v-container>
</template>

<script>
import moment from 'moment'
import NewReservation from '../Components/NewReservation'

export default {
  name: 'CustomerReservation',
  components: { NewReservation },
  layout: 'default',
  data () {
    return {
      date: moment().add(1, 'day').toISOString().substr(0, 10), // Dagens dato
      menu: false, // Styrer synligheten til dato menyen
      menu2: false, // Styrer synligheten til tidsvelgeren
      now: moment().valueOf(), // Nåværende tidspunkt
      numberOfPersons: 1, // Antall personer som legges inn
      reservationKey: 0, // Reservasjonssnøkkel for å tvinge vue til å lage NewReservation komponenten på ny hver gang
      reservation: { // Reservasjonsobjektet
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
      },
      startTime: moment().format('H:mm'), // Starttid
      startTimeUnix: moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf(), // Starttid i Unix
      newReservationVisible: false, // Brukes for å vise/ikke vise add-reservation komponenten
      termsdialog: false
    }
  },
  computed: {
    // Henter loading fra storen
    loading () {
      return this.$store.getters.loading
    },
    // Setter minimumsdatoen til i morgen
    minDate () {
      return moment().endOf('day').toISOString()
    },
    // Setter minimum starttid til å 24 timer fram i tid hvis reservasjonen er for i morgen, evt til kl 12 hvis det er mer enn 24 timer fram i tid
    minStartTime () {
      if (this.date === moment().add(1, 'day').toISOString().substr(0, 10)) {
        if (moment().valueOf() > moment(moment().toISOString().substr(0, 10) + ' - 12:00', 'YYYY-MM-DD - HH:mm').valueOf()) {
          return moment(this.now + 86400000).format('H:mm')
        }
        else return '12:00'
      }
      else return '12:00'
    }
  },
  mounted () {
    this.$store.dispatch('mountTables')
    if (moment().valueOf() > moment(moment().toISOString().substr(0, 10) + ' - 12:00', 'YYYY-MM-DD - HH:mm').valueOf()) {
      this.startTime = moment(this.now + 86400000).format('H:mm')
    }
    else this.startTime = '12:00'
  },
  methods: {
    /* Regner ut lovlige valg for timer og minutter */
    allowedHours: v => (v >= 12 && v < 22),
    allowedMinutes: v => (v % 15 === 0),
    // Metode for å legge til reservasjon
    addReservation () {
      this.newReservationVisible = true
      this.reservationKey++
    },
    /*
      * checkCustomerTables henter tilgjengelige bord fra storen, henter et nytt reservasjonssnummer fra kontrolleren,
      * går igjennom de ledige bordene og finner det bordet med minst, men nok, kapasitet.
      * Hvis det er et ledig bord oppretter den reservasjonen. Hvis det ikke er noe ledig kommer feilmelding.
      * */
    checkCustomerTables () {
      this.$store.commit('setLoading', true)
      this.$store.commit('clearError')
      this.$controller.reservations.newReservationNumber()
        .then(reservationID => {
          this.reservation.reservationID = Number(reservationID.docs[0].id) + 1
        }).then(() => {
          const customerTables = this.$store.getters.customerRequestedTables
          let availableTable
          let mimimum = 999999
          for (let i = 0; i < customerTables.length; i++) {
            const table = customerTables[i]
            if (table) {
              if (Number(table.capacity) < mimimum && table.available === true) {
                availableTable = table
                mimimum = table.capacity
              }
            }
          }
          if (availableTable) {
            this.reservation.tableID = availableTable.tableID
            this.reservation.startTime = this.startTimeUnix
            this.reservation.endTime = moment(this.startTimeUnix).add(4, 'hours').valueOf()
            this.reservation.numberOfPersons = this.numberOfPersons
            this.$store.dispatch('createReservation', this.reservation)
            this.$store.commit('setLoading', false)
            this.addReservation()
          }
          else {
            this.$store.commit('setError', 'Prøv et annet tidspunkt eller for en mindre gruppe')
            this.$store.commit('setLoading', false)
          }
        })
    },
    // Legger inn kravene fra kunden (dato, antall personer og starttid) i en spørring til storen, som finner alle bordene som matcher kravene.
    requestTables () {
      if (this.numberOfPersons > 0) {
        this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
        this.$store.dispatch('checkCustomerRequestedTable', { numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: moment(this.startTimeUnix).add(4, 'hours').valueOf() })
        this.checkCustomerTables()
      }
      else this.$store.commit('setError', 'Velg gyldig antall personer')
    }
  }
}
</script>

<style scoped>
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }
  .loginbox{
    height:300px;
    width: 450px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }

</style>
