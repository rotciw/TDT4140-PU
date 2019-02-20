<template>
  <v-container>
    <v-layout
      column
      justify-center
      align-center
    >
      <img
        src="logo-long.png"
        height="200px"
        contain
        style="margin-bottom:50px"
      >
      <v-flex
        xs12
        sm5
        md5
      >
        <!-- Kommentar -->
        <div class="loginbox">
          <form @submit.prevent="onSignin">
            <v-card-text>
              <v-text-field
                id="username"
                v-model="email"
                class="roundedCorners"
                prepend-inner-icon="person"
                name="login"
                label="email"
                type="email"
                required
              />
              <v-text-field
                id="password"
                v-model="password"
                class="roundedCorners"
                prepend-inner-icon="lock"
                name="password"
                label="Passord"
                type="password"
                required
              />
            </v-card-text>
            <div class="text-xs-center">
              <v-btn
                type="submit"
                :disabled="loading"
                :loading="loading"
                large
                color="#6BE096"
                class="roundedCorners"
              >
                Logg inn
              </v-btn>
            </div>
          </form>
        </div>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-snackbar
        v-model="snackbar"
        top
      >
        {{ error }}
        <v-btn
          color="pink"
          flat
          @click="onDismissed"
        >
          Lukk
        </v-btn>
      </v-snackbar>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  layout: 'frontpage',
  data () {
    return {
      email: '',
      password: '',
      loading: false,
      snackbar: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    user (val) {
      if (val !== null && val !== undefined) {
        this.$router.push('/dashboard')
      }
    },
    error () {
      this.snackbar = true
    }
  },
  mounted () {
    console.log(this.$store.state)
  },
  methods: {
    onDismissed () {
      this.$store.dispatch('clearError')
      this.snackbar = false
    },
    onSignin () {
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
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
