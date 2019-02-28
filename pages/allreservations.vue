<template>
  <v-card>
    <v-card-title>
      <h2>Oversikt over reservasjoner:</h2>
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
                    v-model="editedSelectedReservation.numberOfPersons"
                    label="Antall Personer"
                    type="number"
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="editedSelectedReservation.tableID"
                    label="Bordnr"
                    type="number"
                  />
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
                    :return-value.sync="editedSelectedReservation.startTime"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="250px"
                    min-width="250px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="editedSelectedReservation.startTime"
                      color="green"
                      prepend-icon="access_time"
                      label="Starttid"
                      readonly
                    />
                    <v-time-picker
                      v-if="menu2"
                      v-model="editedSelectedReservation.startTime"
                      color="green"
                      format="24hr"
                      full-width
                      @click:minute="$refs.startMenu.save(editedSelectedReservation.startTime)"
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
                    :return-value.sync="editedSelectedReservation.endTime"
                    lazy
                    transition="scale-transition"
                    offset-y
                    full-width
                    max-width="250px"
                    min-width="250px"
                  >
                    <v-text-field
                      slot="activator"
                      v-model="editedSelectedReservation.endTime"
                      color="green"
                      prepend-icon="directions_walk"
                      label="Sluttid"
                      readonly
                    />
                    <v-time-picker
                      v-if="menu1"
                      v-model="editedSelectedReservation.endTime"
                      color="green"
                      format="24hr"
                      full-width
                      @click:minute="$refs.leavingMenu.save(editedSelectedReservation.endTime)"
                    />
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="red darken-1"
              flat
              @click="close"
            >
              Avbryt
            </v-btn>
            <v-btn
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
          v-if="props.item"
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
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <!--  Her hentes verdiene fra databasen, en etter en for hver td tag -->
        <td
          v-if="props.item"
          class="text-xs-left"
        >
          {{ props.item.user.firstName }}
        </td>
        <td
          v-if="props.item"
          class="text-xs-left"
        >
          {{ props.item.user.lastName }}
        </td>
        <td
          v-if="props.item"
          class="text-xs-left"
        >
          {{ props.item.user.mobile }}
        </td>
        <td
          v-if="props.item"
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
      dialog: false,
      search: null,
      dialogNote: false,
      editedIndex: -1,
      menu1: false,
      menu2: false,
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
      users: 'users'
    })
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
      this.selectedReservation.created = moment(item.created).format('HH:mm - dddd DD MMM')
      this.selectedReservation.duration = item.duration
      this.selectedReservation.startTime = moment(item.startTime).format('HH:mm')
      this.selectedReservation.endTime = moment(item.endTime).format('HH:mm')
      this.selectedReservation.guestID = item.guestID
      this.selectedReservation.uid = item.uid
    },
    // Endret items sendes inn i editedSelectedReservation objekt
    editItem (item) {
      // console.log(this.editedSelectedReservation)
      this.dialog = true
      this.editedSelectedReservation.reservationID = item.reservationID
      this.editedSelectedReservation.user.firstName = item.user.firstName
      this.editedSelectedReservation.user.lastName = item.user.lastName
      this.editedSelectedReservation.user.email = item.user.email
      this.editedSelectedReservation.user.mobile = item.user.mobile
      this.editedSelectedReservation.numberOfPersons = item.numberOfPersons
      this.editedSelectedReservation.comments = item.comments
      this.editedSelectedReservation.tableID = item.tableID
      this.editedSelectedReservation.created = item.created
      this.editedSelectedReservation.duration = item.duration
      this.editedSelectedReservation.startTime = moment(item.startTime).format('HH:mm')
      this.editedSelectedReservation.endTime = moment(item.endTime).format('HH:mm')
      this.editedSelectedReservation.guestID = item.guestID
      this.editedSelectedReservation.uid = item.uid
    },

    deleteItem (item) {
      confirm('Er du sikker på at du har lyst til å slette?')
      // Kaller på removeReservation fra Vuex Store som sletter en reservasjon fra databasen
      this.$store.dispatch('removeReservation', item)
    },
    close () {
      this.dialog = false
    },
    save () {
      // Kaller på updateReservation fra vuex store som skal oppdatere hver reservasjon med dataen fra editedSelectedReservation
      this.$store.dispatch('updateReservation', this.editedSelectedReservation)
      this.close()
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
    }
  }
}
</script>

<style scoped>

</style>
