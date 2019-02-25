<template>
  <v-timeline align-top>
    <v-timeline-item
      v-for="(reservation, index) in reservations"
      :key="reservation.reservationID"
      :color="colors[index % colors.length]"
      :icon="book"
    >
      <v-card
        :color="colors[index % colors.length]"
        dark
      >
        <v-card-title class="title">
          Reservasjon # {{ reservation.reservationID }}
        </v-card-title>
        <v-card-text class="white text--primary">
          Kl: {{ convertTime(reservation.startTime) }} - {{ convertTime(reservation.endTime) }}
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
    reservations: {
      default: function () {
        return []
      },
      type: Array
    }
  },
  data () {
    return {
      colors: ['green', 'yellow', 'purple', 'grey', 'orange']
    }
  },
  methods: {
    convertTime (time) {
      moment(time).format('HH:mm:ss')
    }
  }
}
</script>

<style scoped>

</style>
