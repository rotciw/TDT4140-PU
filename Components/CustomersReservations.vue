<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div>
    <v-card>
      <v-card-title>
        <h2>Oversikt over dine kommende reservasjoner:</h2>
        <v-spacer />
        <!-- Fra her defineres data tabellen, som har søke funksjon -->
        <v-text-field
          v-model="search"
          append-icon="search"
          hide-details
          label="Søk"
          single-line
        />
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="reservations"
        :search="search"
        no-data-text="Ingen reservasjoner tilgjengelig"
      >
        <!-- Viser alle verdiene som blir hentet fra databasen -->
        <template
          slot="items"
          slot-scope="props"
        >
          <!--  Her hentes verdiene fra databasen, en etter en for hver td tag -->
          <td
            v-if="props.item && props.item.user"
            class="text-xs-left"
          >
            {{ props.item.reservationID }}
          </td>
          <td
            v-if="props.item && props.item.user"
            class="text-xs-left"
          >
            {{ convertToDate(props.item.startTime) }}
          </td>
          <td
            v-if="props.item && props.item.user"
            class="text-xs-left"
          >
            {{ convertToTime(props.item.startTime) }}
          </td>
          <td
            v-if="props.item"
            class="text-xs-center"
          >
            {{ props.item.numberOfPersons }}
          </td>
          <td
            v-if="props.item"
            class="text-xs-center"
          >
            {{ props.item.comments }}
          </td>
          <td
            v-if="props.item"
            class="justify-center layout px-0"
          >
            <!-- IKONER FOR ENDRING OG SLETTING AV ENTRIES -->
            <v-icon
              small
              class="mr-2"
              @click="editItem(props.item)"
            >
              edit
            </v-icon>
            <v-icon
              small
              @click="deleteItem(props.item)"
            >
              delete
            </v-icon>
          </td>
        </template>
        <template
          slot="pageText"
          slot-scope="props"
        >
          {{ props.pageStart }} - {{ props.pageStop }} av {{ props.itemsLength }}
        </template>
        <v-alert
          slot="no-results"
          :value="true"
          color="error"
          icon="warning"
        >
          Ingen resultater for "{{ search }}".
        </v-alert>
      </v-data-table>
      <!-- DATA TABELL SLUTT -->
    </v-card>
    <change-reservation
      :reservation="reservation"
      :dialog-visible="dialogVisible"
      :user="true"
      @dialogClosed="dialogVisible = false"
    />
  </div>
</template>

<script>
// Hente gettere fra vuex store
import { mapGetters } from 'vuex'
// Moment er biblioteket vi bruker for tid/time picker etc.
import ChangeReservation from './ChangeReservation'
import moment from 'moment'

export default {
  components: { ChangeReservation },
  data () {
    return {
      dialogVisible: false,
      headers: [
        { text: 'Reservasjonsnr', value: 'reservationID' },
        { text: 'Dato', value: 'startTime' },
        { text: 'Tidspunkt', value: 'Tidspunkt' },
        { text: 'Antall personer', value: 'numberOfPersons' },
        { text: 'Kommentarer', value: 'comments' },
        { text: 'Handlinger', value: 'action', sortable: false }
      ],
      reservation: {},
      search: null
    }
  },
  computed: {
    ...mapGetters({
      reservations: 'customersComingReservations',
      user: 'user',
      tables: 'tables'
    })
  },
  mounted () {
    this.$store.dispatch('mountUsersReservations', this.$store.getters.user)
  },
  methods: {
    convertToDate (time) {
      return moment(time).format('YYYY-MM-DD')
    },
    convertToTime (time) {
      return moment(time).format('H:mm')
    },
    deleteItem (item) {
      if (confirm('Er du sikker på at du har lyst til å slette?')) {
        // Kaller på removeReservation fra Vuex Store som sletter en reservasjon fra databasen
        this.$store.dispatch('removeReservation', item)
        this.$store.dispatch('mountUsersReservations', this.$store.getters.user)
      }
    },
    editItem (item) {
      console.log(item)
      this.reservation = item
      this.dialogVisible = true
      console.log(item)
      console.log(this.dialogVisible)
    }
  }
}
</script>

<style scoped>

</style>
