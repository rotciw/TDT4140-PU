<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <v-card>
    <v-card-title>
      <h2>Oversikt over dagens og kommende reservasjoner:</h2>
      <v-spacer />
      <!-- Dialogen (popup) her er for endring av reservasjonen
      ENDRING AV RESERVASJON START -->
      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title>
            <span class="headline">Endre reservasjonen</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <!-- .user på de man skal hente fra users databasen -->
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedSelectedReservation.user.firstName"
                    label="Fornavn"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <!-- Her hentes data fra editedSelectedReservation som er definert under.
                  Disse henter fra users og reservations tabellene i databasen -->
                  <v-text-field
                    v-model="editedSelectedReservation.user.lastName"
                    label="Etternavn"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedSelectedReservation.user.mobile"
                    label="Tlfnr"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedSelectedReservation.user.email"
                    label="Epost"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="numberOfPersons"
                    label="Antall Personer"
                    min="1"
                    type="number"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <div class="text-xs-center">
                    <v-menu
                      top
                      offset-y
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          color="green"
                          dark
                          v-on="on"
                        >
                          Endre bord: {{ tableID }}
                        </v-btn>
                      </template>

                      <v-list>
                        <v-list-tile
                          v-for="(item, index) in tables"
                          :key="index"
                          @click="updateTable(item.tableID)"
                        >
                          <v-list-tile-title v-if="item">
                            {{ item.tableID }}
                          </v-list-tile-title>
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </div>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedSelectedReservation.comments"
                    label="Kommentarer"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
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
                    max-width="250px"
                    min-width="250px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="startTime"
                      color="green"
                      prepend-icon="access_time"
                      label="Starttid"
                      readonly
                    />
                    <v-time-picker
                      v-if="menu2"
                      v-model="startTime"
                      color="green"
                      format="24hr"
                      full-width
                      :min="minStartTime"
                      :max="tomorrow"
                      @click:minute="$refs.startMenu.save(startTime); updateMinEndTime()"
                    />
                  </v-menu>
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-menu
                    ref="leavingMenu"
                    v-model="menu1"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="endTime"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="250px"
                    min-width="250px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="endTime"
                      color="green"
                      prepend-icon="directions_walk"
                      label="Sluttid"
                      readonly
                    />
                    <v-time-picker
                      v-if="menu1"
                      v-model="endTime"
                      color="green"
                      format="24hr"
                      :min="minEndTime"
                      :max="tomorrow"
                      full-width
                      @click:minute="$refs.leavingMenu.save(endTime)"
                    />
                  </v-menu>
                </v-flex>
              </v-layout>
              <v-layout
                row
                wrap
                justify-center
              >
                <v-flex
                  xs12
                  sm6
                  md4
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
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <h3
              v-if="!tableAvailable"
              style="text-align: right; color: red"
            >
              Bordet er ikke ledig for valgt tidspunkt
            </h3>
            <v-spacer />
            <v-btn
              color="red darken-1"
              flat
              @click="close"
            >
              Avbryt
            </v-btn>
            <v-btn
              v-if="tableAvailable"
              color="blue darken-1"
              flat
              @click="save"
            >
              Lagre
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- ENDRING AV RESERVASJON DIALOG SLUTT -->
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
        <td
          v-if="props.item && props.item.user"
          class="text-xs"
        >
          <v-icon
            left
            small
            @click.stop="showAllInfo(props.item)"
          >
            <!-- .stop gjør at man kan klikke utenfor boksen for å krysse av -->
            info
          </v-icon>
          {{ props.item.reservationID }}
          <v-dialog
            v-model="dialogNote"
            max-width="800"
          >
            <v-card>
              <v-card-title
                class="headline grey lighten-2"
                primary-title
              >
                Reservasjonsnr: {{ selectedReservation.reservationID }}
              </v-card-title>
              <v-form>
                <v-container>
                  <v-layout
                    v-if="selectedReservation"
                    row
                    wrap
                  >
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.user.firstName"
                        label="Fornavn"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.user.lastName"
                        label="Etternavn"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.user.mobile"
                        label="Tlfnr"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.user.email"
                        label="Email"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.guestID"
                        label="Gjeste ID"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.uid"
                        label="Bruker ID"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.startTime"
                        label="Starttid"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.endTime"
                        label="Sluttid"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.tableID"
                        label="Bordnummer"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.numberOfPersons"
                        label="Antall Personer"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.created"
                        label="Bestillingsdato"
                        readonly
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="selectedReservation.comments"
                        label="Kommentarer"
                        readonly
                      />
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
              <v-divider />

              <v-card-actions>
                <v-spacer />
                <v-btn
                  color="red"
                  flat
                  @click.stop="dialogNote = false"
                >
                  Lukk
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <!--  Her hentes verdiene fra databasen, en etter en for hver td tag -->
        <td
          v-if="props.item && props.item.user"
          class="text-xs-left"
        >
          {{ props.item.user.firstName }}
        </td>
        <td
          v-if="props.item && props.item.user"
          class="text-xs-left"
        >
          {{ props.item.user.lastName }}
        </td>
        <td
          v-if="props.item && props.item.user"
          class="text-xs-left"
        >
          {{ props.item.user.mobile }}
        </td>
        <td
          v-if="props.item && props.item.user"
          class="text-xs-left"
        >
          {{ props.item.user.email }}
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
</template>

<script>
// Hente gettere fra vuex store
import { mapGetters } from 'vuex'
// Moment er biblioteket vi bruker for tid/time picker etc.
import moment from 'moment'

export default {
  // Middleware passer på hvem som har tilgang til denne siden
  middleware: ['router-check', 'employee'],
  name: 'Allreservations',
  // Her kommer all data som blir brukt for denne undersiden
  data () {
    return {
      key: 0,
      counter: 0,
      dialog: false,
      date: new Date().toISOString().substr(0, 10),
      search: null,
      dialogNote: false,
      editedIndex: -1,
      endTimeUnix: 0,
      minEndTime: moment().format('H:mm'),
      menu: false,
      menu1: false,
      menu2: false,
      numberOfPersons: 1,
      reservationID: 0,
      startTime: '',
      startTimeUnix: 0,
      endTime: '',
      tableID: 0,
      tomorrow: moment().endOf('day').format('H:mm'),
      // HEADERE til tabell. Value må korrespondere med text field v-model
      headers: [
        { text: 'Reservasjonsnr', value: 'reservationID' },
        { text: 'Fornavn', value: 'user.firstName' },
        { text: 'Etternavn', value: 'user.lastName' },
        { text: 'Tlfnr', value: 'user.mobile' },
        { text: 'Epost', value: 'user.email' },
        { text: 'Antall personer', value: 'numberOfPersons' },
        { text: 'Kommentarer', value: 'comments' },
        { text: 'Handlinger', value: 'action', sortable: false }
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
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      },
      // For endring av entries skal det opprettes et nytt object også sendes til databasen gjennom denne
      editedSelectedReservation: {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      }
    }
  },
  // Getter for reservasjoner fra Vuex Store. Henter reservations og users fra firestore
  computed: {
    ...mapGetters({
      reservations: 'reservations',
      users: 'users',
      tables: 'tables'
    }),
    minStartTime () {
      return moment().format('H:mm')
    },
    minDate () {
      return new Date().toISOString().substr(0, 10)
    },
    tableAvailable () {
      return !this.$store.getters.tableAvailable.includes(false)
    }
  },
  watch: {
    endTime () {
      this.checkTableAvailability()
    },
    numberOfPersons () {
      this.checkTableAvailability()
    },
    date () {
      this.checkTableAvailability()
    },
    startTime () {
      this.checkTableAvailability()
    },
    tableID () {
      this.checkTableAvailability()
    }
  },
  // Når siden mounter(er lastet inn) skal den hente alle reservasjonene fra firestore
  mounted () {
    this.$store.dispatch('mountReservations')
  },
  // Her kommer alle metodene/funksjonene
  methods: {
    // item sender ned info om hvilket objekt som er trykket. Denne dataen blir så lagt inn i selectedReservation objekt
    showAllInfo (item) {
      this.dialogNote = true
      this.selectedReservation.reservationID = item.reservationID
      this.selectedReservation.user.firstName = item.user.firstName
      this.selectedReservation.user.lastName = item.user.lastName
      this.selectedReservation.user.email = item.user.email
      this.selectedReservation.user.mobile = item.user.mobile
      this.selectedReservation.numberOfPersons = item.numberOfPersons
      this.selectedReservation.comments = item.comments
      this.selectedReservation.tableID = item.tableID
      this.selectedReservation.created = moment(item.created).format('H:mm - dddd DD MMM YYYY')
      this.selectedReservation.duration = item.duration
      this.selectedReservation.startTime = moment(item.startTime).format('H:mm - DD MMMM YYYY')
      this.selectedReservation.endTime = moment(item.endTime).format('H:mm - DD MMMM YYYY')
      this.selectedReservation.guestID = item.guestID
      this.selectedReservation.uid = item.uid
    },
    // Endret items sendes inn i editedSelectedReservation objekt
    editItem (item) {
      this.$store.commit('clearAvailability')
      this.dialog = true
      this.date = moment(item.startTime).format('YYYY-MM-DD')
      this.reservationID = item.reservationID
      this.editedSelectedReservation.user.firstName = item.user.firstName
      this.editedSelectedReservation.user.lastName = item.user.lastName
      this.editedSelectedReservation.user.email = item.user.email
      this.editedSelectedReservation.user.mobile = item.user.mobile
      this.numberOfPersons = item.numberOfPersons
      this.editedSelectedReservation.comments = item.comments
      this.tableID = item.tableID
      this.editedSelectedReservation.created = item.created
      this.editedSelectedReservation.duration = item.duration
      this.startTime = moment(item.startTime).format('H:mm')
      this.endTime = moment(item.endTime).format('H:mm')
      this.editedSelectedReservation.guestID = item.guestID
      this.editedSelectedReservation.uid = item.uid
    },

    deleteItem (item) {
      if (confirm('Er du sikker på at du har lyst til å slette?')) {
        // Kaller på removeReservation fra Vuex Store som sletter en reservasjon fra databasen
        this.$store.dispatch('removeReservation', item)
      }
    },
    checkTableAvailability () {
      this.startTimeUnix = moment(this.date + ' - ' + this.startTime, 'YYYY-MM-DD - HH:mm').valueOf()
      this.endTimeUnix = moment(this.date + ' - ' + this.endTime, 'YYYY-MM-DD - HH:mm').valueOf()
      this.$store.dispatch('checkAvailabilityWithReservation', { tableID: this.tableID, numberOfPersons: this.numberOfPersons, startTime: this.startTimeUnix, endTime: this.endTimeUnix, reservationID: this.reservationID })
    },
    close () {
      this.dialog = false
      this.counter = 0
      this.editedSelectedReservation = {
        reservationID: '',
        tableID: '',
        userID: '',
        guestID: '',
        numberOfPersons: '',
        created: '',
        duration: '',
        comments: '',
        startTime: '',
        endTime: '',
        user: {
          firstName: '',
          lastName: '',
          mobile: '',
          email: ''
        }
      }
      /* this.endTime = ''
      this.startTime = ''
      this.numberOfPersons = 0
      this.tableID = 0 */
      this.$store.commit('clearAvailability')
    },
    save () {
      // Kaller på updateReservation fra vuex store som skal oppdatere hver reservasjon med dataen fra editedSelectedReservation
      if (Number(this.$store.getters.tables[this.tableID - 1].capacity) >= Number(this.numberOfPersons)) {
        console.log(this.$store.getters.tables[this.tableID - 1].capacity)
        this.editedSelectedReservation.startTime = this.startTimeUnix
        this.editedSelectedReservation.endTime = this.endTimeUnix
        this.editedSelectedReservation.numberOfPersons = this.numberOfPersons
        this.editedSelectedReservation.tableID = this.tableID
        this.editedSelectedReservation.reservationID = this.reservationID
        this.$store.dispatch('updateReservation', this.editedSelectedReservation)
        this.close()
      }
      else {
        this.$store.commit('setError', 'Bordet har ikke kapasitet til så mange. Prøv et annet')
      }
    },
    updateMinEndTime () {
      this.minEndTime = this.startTime
      if (this.startTime > this.endTime) {
        this.endTime = this.startTime
      }
    },
    updateTable (table) {
      this.tableID = table
    }
  }
}
</script>

<style scoped>

</style>
