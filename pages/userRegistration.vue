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
              v-model="email"
              :rules="emailRules"
              label="E-post"
              required
            />
            <v-text-field
              v-model="mobile"
              :rules="mobileRules"
              label="Telefon"
              required
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
              :rules="[v => !!v || 'Du må godkjenne vilkårene for å kunne opprette bruker']"
              label="Jeg har lest og aksepterer vilkårene"
              required
            />
          </v-form>
        </v-flex>
        <v-flex
          xs12
        >
          <v-btn
            :disabled="!valid"
            color="success"
            @click="validate"
          >
            Opprett bruker
          </v-btn>
          <v-btn
            color="error"
            @click="createUser"
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
    name: '',
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
      v => !!v || 'Du må oppgi et passord'
    ],
    checkbox: false
  }),
  methods: {
    passwordConfirmationError () {
      return (this.password1 === this.password2) ? '' : 'Passordene må være like'
    },
    validate () {
      if (this.$refs.form.validate()) {
        this.snackbar = true
      }
    },
    createUser () {
      let email = this.email
      let password = this.password1
      return firebase.auth.createUserWithEmailAndPassword(email, password)
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
        .then(updateUser(firebase.auth().currentUser))
    },
    updateUser (user) {
      if (user !== null) {
        user.update
      }
    }
  }
}

</script>
<style scoped>
  .loginbox{
    height:600px;
    width: 650px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }

</style>
