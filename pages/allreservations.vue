<template>
  <v-card>
    <v-card-title>
      <h2>Oversikt over reservasjoner:</h2>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        hide-details
        label="Søk"
        single-line
      ></v-text-field>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="reservations"
      :search="search"
      no-data-text="Ingen reservasjoner tilgjengelig"
    >
      <!-- Viser alle verdiene som blir hentet fra databasen -->
      <template slot="items" slot-scope="props">
        <td class="text-xs-center">{{ props.item.reservationID }}</td>
        <td class="text-xs-left">{{ props.item.user.firstName }}</td>
        <td class="text-xs-left">{{ props.item.user.lastName }}</td>
        <td class="text-xs-left">{{ props.item.user.mobile }}</td>
        <td class="text-xs-left">{{ props.item.user.email }}</td>
        <td class="text-xs-center">{{ props.item.numberOfPersons }}</td>
        <td class="text-xs-left">{{ props.item.created }}</td>
      </template>
      <template slot="pageText" slot-scope="props">
        Side {{ props.pageStart }} - {{ props.pageStop }} av {{ props.itemsLength }}
      </template>
      <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Ingen resultater for "{{ search }}".
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
// Hente gettere fra vuex store
import { mapGetters } from 'vuex'

export default {
  name: 'Allreservations',
  data () {
    return {
      key: 0,
      dialogVisible: false,
      search: null,
      // HEADERE til tabell
      headers: [
        { text: 'ReservationID', value: 'reservationID' },
        { text: 'Fornavn', value: 'user.firstName' },
        { text: 'Etternavn', value: 'user.lastName' },
        { text: 'Tlfnr', value: 'user.mobile' },
        { text: 'Epost', value: 'user.email' },
        { text: 'Antall personer', value: 'numberOfPersons' },
        { text: 'Dato', value: 'created' }
      ],
      // Hver reservasjon som tilsvarer databasen
      selectedReservation: {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  // Getter for reservasjoner fra Vuex Store
  computed: {
    ...mapGetters({
      reservations: 'reservations',
      users: 'users'
    })
  }
}
</script>

<style scoped>

</style>
