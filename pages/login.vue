<template>
  <v-container>
    <!-- Throws error if the login is incomplete -->
    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <!-- V-card form checking the logn -->
        <v-card xs6>
          <v-card-text>
            <v-container>
              <form @submit.prevent="onSignin">
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="email"
                      v-model="email"
                      name="email"
                      label="Mail"
                      type="email"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      id="password"
                      v-model="password"
                      name="password"
                      label="Password"
                      type="password"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-btn
                      type="submit"
                      :disabled="loading"
                      :loading="loading"
                    >
                      Sign in
                      <span
                        slot="loader"
                        class="custom-loader"
                      >
                        <v-icon light>
                          cached
                        </v-icon>
                      </span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </form>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <!-- Throws error if the login is incomplete -->
    <v-snackbar
      v-model="snackbar"
      top
    >
      {{ error }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
export default {
  layout: 'frontpage',
  name: 'login',
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
    },
    onSignin () {
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    }
  }
}
</script>

<style scoped>

</style>
