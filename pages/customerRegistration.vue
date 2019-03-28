<template>
  <v-container>
    <v-layout
      row
      justify-center
      align-center
    >
      <div class="loginbox">
        <v-flex
          xs12
          sm10
          md11
        >
          <h1
            class="text-xs-center"
          >
            Registrer ny bruker
          </h1>
          <div class="text-xs-center">
            <a
              href="/termsAndConditions"
              target="_blank"
            >
              Vilkår og betingelser
            </a>
          </div>
          <v-form
            ref="form"
            v-model="valid"
            name="fo"
            lazy-validation
          >
            <v-text-field
              v-model="firstName"
              :rules="nameRules"
              label="Fornavn"
              required
            />
            <v-text-field
              v-model="lastName"
              :rules="nameRules"
              label="Etternavn"
              required
            />
            <v-text-field
              v-model="mobile"
              :rules="mobileRules"
              label="Telefon"
              required
            />
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-post"
              required
              type="email"
            />
            <v-text-field
              v-model="password1"
              :rules="passwordRules"
              label="Passord"
              required
              type="password"
            />
            <v-text-field
              v-model="password2"
              :rules="passwordRules"
              :error-messages="passwordConfirmationError()"
              label="Gjenta passord"
              required
              type="password"
            />
            <v-checkbox
              v-model="checkbox"
              :rules="[v => !!v || 'Du må godkjenne vilkåre og betingelser for å kunne opprette bruker']"
              label="Jeg har lest og aksepterer vilkårene og betingelsene"
              required
            />
          </v-form>
        </v-flex>
        <v-flex
          xs12
        >
          <v-btn
            :disabled="!valid"
            color="#6BE096"
            class="roundedCorners"
            @click="createUser"
          >
            Opprett bruker
          </v-btn>
          <v-btn
            color="red lighten-1"
            class="roundedCorners"
            @click="cancelRegistration"
          >
            Avbryt
          </v-btn>
        </v-flex>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/firestore'
export default {
  layout: 'frontpage',
  data: () => ({
    valid: true,
    firstName: '',
    lastName: '',
    nameRules: [
      v => !!v || 'Du må oppgi navn',
      v => (v && isNaN(v)) || 'Ugyldig navn'
    ],
    email: '',
    emailRules: [
      v => !!v || 'Du må oppgi e-post',
      v => /.+@+/.test(v) || 'Ugyldig e-post'
    ],
    mobile: '',
    mobileRules: [
      v => !!v || 'Du må oppgi telefonnummer',
      v => (v && !isNaN(v)) || 'Ugyldig telefonnummer',
      v => (v && v.length === 8) || 'Ugyldig telefonnummer'
    ],
    password1: '',
    password2: '',
    passwordRules: [
      v => !!v || 'Du må oppgi et passord',
      v => (v && v.length >= 6) || 'Passordet må bestå av minimum seks tegn'
    ],
    checkbox: false
  }),
  methods: {
    cancelRegistration () {
      this.$router.push('login')
    },
    passwordConfirmationError () {
      return (this.password1 === this.password2) ? '' : 'Passordene må være like'
    },
    createUser () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
      else {
        return
      }
      let email = this.email
      let password = this.password1
      return firebase.auth().createUserWithEmailAndPassword(email, password)
        .catch(error => {
          var errorCode = error.code
          var errorMessage = error.message
          if (errorCode === 'auth/email-already-in-use') {
            alert('Denne e-posten har allerede en bruker knyttet til seg')
          }
          else {
            alert(errorMessage)
          }
          console.log(error)
        })
        .then(() => {
          let user = firebase.auth().currentUser
          firebase.firestore().collection('users').doc(user.uid + '').set({
            firstName: this.firstName,
            lastName: this.lastName,
            mobile: this.mobile,
            email: this.email,
            admin: false,
            employee: false,
            customer: true,
            uid: user.uid
          }).catch(error => {
            console.log('klarte ikke opprette bruker')
            console.log(error)
          })
        })
        .then(this.$router.push('/dashboard'))
    }
  }
}

</script>
<style scoped>
  .loginbox{
    height:650px;
    width: 800px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }

</style>
