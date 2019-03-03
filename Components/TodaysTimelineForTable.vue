<!-- Viser kommende reservasjoner for bordet ut dagen-->
<template>
  <v-timeline
    v-if="reservations.length > 0"
    align-top
  >
    <v-timeline-item
      v-for="(reservation, index) in reservations"
      :key="index"
      small
      :color="colors[index % colors.length]"
    >
      <v-card
        :color="colors[index % colors.length]"
        dark
      >
        <v-card-title class="h3">
          Reservasjon # {{ reservation.reservationID }}
        </v-card-title>
        <v-card-text class="white text--primary">
          <v-flex xs12>
            <!-- Konverterer tidene til lesbart format med metoden convertTime -->
            Kl: {{ convertTime(reservation.startTime) }} - {{ convertTime(reservation.endTime) }}
            <v-icon :color="colors[index % colors.length]">
              supervised_user_circle
            </v-icon>
            {{ reservation.numberOfPersons }}
          </v-flex>
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
import moment from 'moment'

export default {
  name: 'TodaysTimelineForTabel',
  props: {
    // Arver reservasjonene fra ViewTable
    reservations: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      // Litt ulike farger på reservasjonene
      colors: ['green', 'yellow darken-3', 'purple', 'grey', 'orange']
    }
  },
  methods: {
    // Konverterer unix tid til lesbart format
    convertTime (time) {
      return moment(time).format('HH:mm')
    }
  }
}
</script>

<style scoped>

</style>
