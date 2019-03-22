<!-- Brukes for å legge til ny reservasjon-->
<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="800px"
    >
      <div v-if="step === 1">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <!-- Fyller ut informasjon om reservasjonen-->
              <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
              <div>
                <v-flex
                  xs12
                  class="my-2"
                >
                  <v-flex xs12>
                    <h2
                      style="text-align: center; color: green"
                    >
                      Reservasjonen er bekreftet
                    </h2>
                  </v-flex>
                  <h3 style="text-align: center">
                    Hva er eposten din?
                  </h3>
                </v-flex>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex
                    xs6
                  >
                    <v-form
                      ref="emailForm"
                      v-model="validEmail"
                    >
                      <v-text-field
                        v-model="guestUser.email"
                        prepend-icon="mail"
                        :rules="emailRules"
                        label="E-post"
                      />
                    </v-form>
                  </v-flex>
                </v-layout>
                <v-flex
                  xs12
                  mt-3
                >
                  <!-- Lagrer info om kunden -->
                  <div class="text-xs-center">
                    <v-btn
                      color="grey"
                      class="button"
                      large
                      @click="cancel"
                    >
                      Avbryt
                    </v-btn>
                    <v-btn
                      color="green"
                      class="button"
                      large
                      :loading="loading"
                      @click="confirmEmail"
                    >
                      Neste
                    </v-btn>
                  </div>
                </v-flex>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="step === 2">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <!-- Fyller ut informasjon om reservasjonen-->
              <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
              <div>
                <v-flex
                  xs12
                  class="my-2"
                >
                  <v-flex xs12>
                    <h2
                      style="text-align: center; color: green"
                    >
                      Reservasjonen er bekreftet
                    </h2>
                  </v-flex>
                  <h3 style="text-align: center">
                    Hva er mobilnummeret ditt?
                  </h3>
                </v-flex>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex
                    xs6
                  >
                    <v-form
                      ref="mobileForm"
                      v-model="validMobile"
                    >
                      <v-text-field
                        v-model="guestUser.mobile"
                        prepend-icon="phone"
                        :rules="mobileRules"
                        label="Mobil"
                      />
                    </v-form>
                  </v-flex>
                </v-layout>
                <v-flex
                  xs12
                  mt-3
                >
                  <!-- Lagrer info om kunden -->
                  <div class="text-xs-center">
                    <v-btn
                      color="grey"
                      class="button"
                      large
                      @click="cancel"
                    >
                      Avbryt
                    </v-btn>
                    <v-btn
                      color="green"
                      class="button"
                      large
                      :loading="loading"
                      @click="confirmMobile"
                    >
                      Neste
                    </v-btn>
                  </div>
                </v-flex>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="step === 3">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <!-- Fyller ut informasjon om reservasjonen-->
              <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
              <div>
                <v-flex
                  xs12
                  class="my-2"
                >
                  <v-flex xs12>
                    <h2
                      style="text-align: center; color: green"
                    >
                      Nå trenger vi litt informasjon fra deg
                    </h2>
                  </v-flex>
                  <h3 style="text-align: center">
                    Fyll ut informasjon om deg selv under
                  </h3>
                </v-flex>
                <v-form
                  ref="reservationForm"
                  v-model="validReservation"
                >
                  <v-layout
                    row
                    wrap
                    justify-center
                  >
                    <v-flex xs6>
                      <v-text-field
                        v-model="guestUser.firstName"
                        label="Fornavn"
                        :rules="nameRules"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="guestUser.lastName"
                        label="Etternavn"
                        :rules="nameRules"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout
                    row
                    wrap
                    justify-center
                  >
                    <v-flex xs6>
                      <v-text-field
                        v-model="guestUser.email"
                        label="E-post"
                        :rules="emailRules"
                      />
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field
                        v-model="guestUser.mobile"
                        label="Mobil"
                        :rules="mobileRules"
                      />
                    </v-flex>
                  </v-layout>
                  <v-layout
                    row
                    wrap
                    justify-center
                  >
                    <v-flex xs12>
                      <v-text-field
                        v-model="comments"
                        label="Kommentar"
                        hint="Er det noe som bør merkes"
                      />
                    </v-flex>
                  </v-layout>
                </v-form>
                <v-flex
                  xs12
                  mt-3
                >
                  <!-- Lagrer info om kunden -->
                  <div class="text-xs-center">
                    <v-btn
                      color="grey"
                      class="button"
                      large
                      @click="cancel"
                    >
                      Avbryt
                    </v-btn>
                    <v-btn
                      color="green"
                      class="button"
                      large
                      @click="confirmReservation"
                    >
                      Lagre informasjon
                    </v-btn>
                  </div>
                </v-flex>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </div>
      <div v-if="step === 4">
        <v-card>
          <v-card-text>
            <v-container grid-list-md>
              <!-- Fyller ut informasjon om reservasjonen-->
              <!-- Hvis man har trykket på et bord får man valget og lagre informasjon om kunden og å opprette bord -->
              <div>
                <v-flex
                  xs12
                  class="my-2"
                >
                  <v-flex xs12>
                    <h2
                      style="text-align: center; color: green"
                    >
                      Reservasjonen er bekreftet
                    </h2>
                  </v-flex>
                  <h3 style="text-align: center">
                    Vi gleder oss til å se deg {{ guestUser.firstName }}!
                  </h3>
                </v-flex>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs12>
                    <h4 style="text-align: center">
                      Reservasjonssnummer: {{ reservation.reservationID }}
                    </h4>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs12>
                    <h4 style="text-align: center">
                      Tidspunkt: {{ dateAndTime }}. Antall personer: {{ reservation.numberOfPersons }}
                    </h4>
                  </v-flex>
                </v-layout>
                <v-layout
                  row
                  wrap
                  justify-center
                >
                  <v-flex xs8>
                    <p style="text-align: center">
                      Vi har sendt en mail til {{ guestUser.email }}. Hvis du ønsker å endre reservasjonen kan du
                      følge linken i mailen eller ta kontakt med oss.
                    </p>
                    <v-img
                      src="Logo.png"
                      contain
                      height="70px"
                    />
                    <p style="text-align: center">
                      Hilsen oss i Trippin Tacos
                    </p>
                  </v-flex>
                </v-layout>
                <!-- Lagrer info om kunden -->
                <div class="text-xs-center">
                  <v-btn
                    color="green"
                    class="button"
                    large
                    @click="close"
                  >
                    Avslutt
                  </v-btn>
                </div>
              </div>
            </v-container>
          </v-card-text>
        </v-card>
      </div>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

export default {
  name: 'NewReservation',
  /*
  * Props som vi arver fra customer-reservation
  * */
  props: {
    dialogVisible: Boolean,
    reservation: {
      type: Object,
      default: function () {
        return {
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
        }
      }
    }
  },
  data () {
    return {
      // Regler for antall personer man prøver å legge inn
      comments: '', // Kommentarer
      dateAndTime: moment(this.reservation.startTime).format('H:mm - DD-MM-YYYY'), // Lesbart format på tidspunkt for reservasjonen
      dialog: this.dialogVisible, // Styrer synligheten til dialogen
      emailRules: [ // Regler for mail
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      guestUser: { // Gjestebruker
        firstName: '',
        lastName: '',
        mobile: '',
        email: '',
        uid: ''
      },
      // Regler for mobil
      mobileRules: [
        v => !!v || 'Mobile is required',
        v => (v.length === 8 && v > 0) || 'Mobilenumber should be 8 digits'
      ],
      // Regler for fornavn og etternavn
      nameRules: [
        v => !!v || 'Name is required'
      ],
      step: 1, // Styrer hvilket steg i komponenten som skal vises
      user: false, // Om det er bruker eller gjest vi henter
      /*
      * De neste tre brukes av formene til å sjekke om det er gyldig input
      * */
      validEmail: false,
      validMobile: false,
      validReservation: false
    }
  },
  // Verdier hentet fra storen.
  computed: {
    // bordene i restauranten
    tables () {
      return this.$store.getters.tables
    },
    // Ledige bord for valgt søkeområde
    mountedAvailableTables () {
      return this.$store.getters.availableTables
    },
    // loading
    loading () {
      return this.$store.getters.loading
    }
  },
  methods: {
    /*
    * Brukes hvis kunden avbryter bookingen før informasjon er lagt inn
    * */
    cancel () {
      if (confirm('Reservasjonen din slettes hvis du avbryter nå')) {
        this.$controller.reservations.deleteReservation(this.reservation)
        this.$emit('dialogClosed')
        this.dialog = false
        this.user = false
      }
    },
    /*
      cancel() lukker dialogen
       */
    close () {
      this.$emit('dialogClosed')
      this.dialog = false
      this.user = false
    },
    /*
    * Kalles på når email er bekreftet. Sjekker så om det finnes en bruker i databasen med denne emailen.
    * Hvis det finnes en bruker med denne emailen hentes den.
    * Hvis denne brukeren i tillegg har lagret mobilen sin, hopper vi to steg videre.
    * */
    confirmEmail () {
      if (this.$refs.emailForm.validate()) {
        this.email = this.guestUser.email
        this.$store.commit('setLoading', true)
        this.$fs.collection('guestUsers').where('email', '==', this.guestUser.email)
          .limit(1)
          .get()
          .then(guestUser => {
            if (guestUser.docs.length === 0) {
              this.$fs.collection('users').where('email', '==', this.guestUser.email)
                .limit(1)
                .get()
                .then(user => {
                  if (user.docs.length > 0) {
                    this.guestUser = user.docs[0].data()
                    this.user = true
                  }
                  this.$store.commit('setLoading', false)
                  if (this.guestUser.mobile) this.step = this.step + 2
                  else this.step++
                })
            }
            else {
              this.guestUser = guestUser.docs[0].data()
              this.$store.commit('setLoading', false)
              if (this.guestUser.mobile) this.step = this.step + 2
              else this.step++
            }
          })
      }
    },
    /*
    * Kalles på når mobil er bekreftet. Sjekker så om det finnes noe bruker på dette mobilnummeret i databasen, enten som bruker eller gjest.
    * */
    confirmMobile () {
      if (this.$refs.mobileForm.validate()) {
        this.$store.commit('setLoading', true)
        this.$fs.collection('guestUsers').where('mobile', '==', this.guestUser.mobile)
          .limit(1)
          .get()
          .then(guestUser => {
            if (guestUser.docs.length === 0) {
              this.$fs.collection('users').where('mobile', '==', this.guestUser.mobile)
                .limit(1)
                .get()
                .then(user => {
                  if (user.docs.length > 0) {
                    this.guestUser = user.docs[0].data()
                    this.user = true
                  }
                  this.$store.commit('setLoading', false)
                  this.step++
                })
            }
            else {
              this.guestUser = guestUser.docs[0].data()
              if (!this.guestUser.email) this.guestUser.email = this.email
              this.$store.commit('setLoading', false)
              this.step++
            }
          })
      }
    },
    /*
      confirmReservation () lagrer reservasjonen hvis input er gyldig
       */
    confirmReservation () {
      if (this.$refs.reservationForm.validate()) {
        console.log('hallo')
        const reservationObject = {
          comments: this.comments,
          created: moment().valueOf(),
          duration: this.reservation.endTime - this.reservation.startTime,
          dropIn: false,
          endTime: this.reservation.endTime,
          numberOfPersons: this.reservation.numberOfPersons,
          reservationID: this.reservation.reservationID,
          startTime: this.reservation.startTime,
          tableID: this.reservation.tableID
        }
        // SJekker om vi oppretter for kunde eller bruker, kaller så på kontrolleren
        if (this.user) {
          reservationObject.guestID = ''
          reservationObject.uid = this.guestUser.uid
          this.$controller.reservations.createReservation(reservationObject)
            .then(answer => {
              console.log(answer)
              if (answer === true) axios.post('https://us-central1-pu30-5b0f9.cloudfunctions.net/sendWelcomeEmail', { 'reservationID': this.reservation.reservationID, 'email': this.guestUser.email, 'displayName': this.guestUser.firstName, 'startTime': reservationObject.startTime })
            })
        }
        else {
          if (this.guestUser && this.guestUser.guestID && this.guestUser.guestID.length > 0) {
            reservationObject.guestID = this.guestUser.guestID
            reservationObject.uid = ''
            this.$controller.users.updateGuestUser(this.guestUser)
            this.$controller.reservations.createReservation(reservationObject)
              .then(answer => {
                console.log(answer)
                if (answer === true) axios.post('https://us-central1-pu30-5b0f9.cloudfunctions.net/sendWelcomeEmail', { 'reservationID': this.reservation.reservationID, 'email': this.guestUser.email, 'displayName': this.guestUser.firstName, 'startTime': reservationObject.startTime })
              })
          }
          else {
            this.$controller.users.createGuestUser(this.guestUser)
              .then(guestID => {
                reservationObject.guestID = guestID
                reservationObject.uid = ''
                this.$controller.reservations.createReservation(reservationObject)
                  .then(answer => {
                    console.log(answer)
                    if (answer === true) axios.post('https://us-central1-pu30-5b0f9.cloudfunctions.net/sendWelcomeEmail', { 'reservationID': this.reservation.reservationID, 'email': this.guestUser.email, 'displayName': this.guestUser.firstName, 'startTime': reservationObject.startTime })
                  })
              })
          }
        }
        this.step++
      }
      else {
        this.$store.commit('setError', 'Fyll ut feltene')
      }
    }
  }
}
</script>

<style scoped>
  .button {
    border-radius: 0 18px 0 18px;
  }
</style>
