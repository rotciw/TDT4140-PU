<template>
  <v-container>
    <v-layout
      column
      justify-center
      align-center
    >
      <div class="loginbox">
        <v-flex
          xs12
          sm10
          md11
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
          sm10
          md11
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
    </v-layout>
    <!-- Komponent for å legge til ny reservasjon -->
    <new-reservation
      :key="reservationKey"
      :dialog-visible="newReservationVisible"
      :reservation="reservation"
      @dialogCLosed="newReservationVisibled = false; disabled = false"
    />
  </v-container>
</template>

<script>
import moment from 'moment'
import NewReservation from '../Components/NewReservation'

export default {
  name: 'CustomerReservation',
  components: { NewReservation },
  layout: 'frontpage',
  data () {
    return {
      date: moment().add(1, 'day').toISOString().substr(0, 10),
      disabled: false,
      menu: false,
      menu2: false,
      now: moment().valueOf(),
      numberOfPersons: 1,
      reservationKey: 0,
      reservation: {
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
      startTime: moment().format('H:mm'),
      startTimeUnix: moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf(),
      newReservationVisible: false // Brukes for å vise/ikke vise add-reservation komponenten
    }
  },
  computed: {
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    },
    minDate () {
      return moment().endOf('day').toISOString()
    },
    minStartTime () {
      if (this.date === moment().add(1, 'day').toISOString().substr(0, 10)) {
        return moment(this.now + 86400000).format('H:mm')
      }
      else return '12:00'
    }
  },
  watch: {
    error () {
      this.disabled = false
    }
  },
  mounted () {
    this.$store.dispatch('mountTables')
  },
  methods: {
    allowedHours: v => (v >= 12 && v < 22),
    allowedMinutes: v => (v % 15 === 0),
    // Metode for å legge til reservasjon
    addReservation () {
      this.newReservationVisible = true
      this.reservationKey++
    },
    checkCustomerTables () {
      this.$store.commit('setLoading', true)
      this.$controller.reservations.newReservationNumber()
        .then(reservationID => {
          this.reservation.reservationID = Number(reservationID.docs[0].id) + 1
        })
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
    },
    requestTables () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - H:mm').valueOf()
      this.$store.dispatch('checkCustomerRequestedTable', { numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: moment(this.startTimeUnix).add(4, 'hours').valueOf() })
      this.checkCustomerTables()
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
