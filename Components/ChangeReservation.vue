<template>
  <!-- Dialogen (popup) her er for endring av reservasjonen
  KOMPONENT FOR customerChangeReservation. Er ikke helt lik som i allreservations
    ENDRING AV RESERVASJON START -->
  <v-dialog
    v-model="dialog"
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Endre reservasjonen din her:</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md v-if="reservation && reservation.user">
          <v-layout wrap>
            <!-- .user. på de man skal hente fra users databasen -->
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
                :nudge-left="40"
                :return-value.sync="startTime"
                lazy
                transition="scale-transition"
                offset-x
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
                offset-x
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
        <v-btn
          color="red"
          @click="cancelReservation"
        >
          Avbestill bord
        </v-btn>
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
</template>

<script>
import moment from 'moment'

export default {
  name: 'ChangeReservation',
  props: {
    dialogVisible: Boolean,
    reservation: {
      type: Object,
      default: function () {
        return {
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
  },
  data () {
    return {
      // Hver reservasjon som tilsvarer databasen
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      menu1: false,
      menu2: false,
      minEndTime: moment().format('H:mm'),
      endTime: '',
      startTime: '',
      numberOfPersons: 1,
      tomorrow: moment().endOf('day').format('H:mm'),
      dialog: this.dialogVisible,
      selectedReservation: this.reservation,
      editedSelectedReservation: this.reservation
      // For endring av entries skal det opprettes et nytt object også sendes til databasen gjennom denne
      /* editedSelectedReservation: {
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
      } */
    }
  },
  computed: {
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
    // Hvis verdien ikke er null så kommer dialog
    reservation (val) {
      if (val !== null) {
        this.dialog = true
      }
    }
  },
  methods: {
    close () {
      this.dialog = false
      // Nytt reservasjonsobjekt for å ikke overskride elementet vi henter inn
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
      this.$emit('dialogClosed')
    },
    save () {
      // Lagre nye endringer til reservasjonen
      this.close()
    },
    cancelReservation () {
      // Avbestille reservasjon
    },
    updateMinEndTime () {
      // Del av funksjonen som skal finne ut av sluttid ikke er før starttid
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
