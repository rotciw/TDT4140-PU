<template>
  <v-layout
    row
    wrap
    justify-center
  >
    <v-flex
      xs6
    >
      <div class="loginbox">
        <form @submit.prevent="resetPassword">
          <v-card-text>
            <v-text-field
              id="username"
              v-model="email"
              class="roundedCorners"
              prepend-inner-icon="person"
              name="login"
              label="Email"
              type="email"
              required
            />
          </v-card-text>
          <div class="text-xs-center">
            <v-btn
              id="loginBtn"
              type="submit"
              large
              color="#6BE096"
              class="roundedCorners"
            >
              Få nytt passord
            </v-btn>
          </div>
        </form>
        <div class="text-xs-center">
          <v-btn
            color="grey"
            class="roundedCorners"
            @click="$router.push('/login')"
          >
            Logg inn
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  layout: 'frontpage',
  data () {
    return {
      email: ''
    }
  },
  methods: {
    resetPassword () {
      this.$controller.users.sendResetEmail(this.email)
        .then(res => {
          if (res === true) {
            this.$store.commit('setError', 'Sjekk mailen din for instruksjoner')
          }
          else this.$store.commit('setError', 'Det skjedde en feil. Dobbeltsjekkmailen din.')
        })
    }
  }
}
</script>

<style scoped>
  .loginbox{
    height:300px;
    width: 450px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }
</style>
