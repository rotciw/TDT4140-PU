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
          Info om reservasjon og bruker
        </v-card-text>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script>
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
  }
}
</script>

<style scoped>

</style>
