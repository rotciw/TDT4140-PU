<template>
  <v-container>
    <!-- Throws error if the login is incomplete -->
    <v-layout
      v-if="error"
      row
      flex
    >
      <v-flex>
        <app-alert
          :text="error.message"
          @dismissed="onDismissed"
        >
        </app-alert>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex
        xs12
        sm6
        offset-sm3
      >
        <v-card>
          <v-card-text>
            <v-container>
              <form @submit.prevent='onSignin'>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="email"
                      label="Mail"
                      id="email"
                      v-model="email"
                      type="email"
                      required
                    />
                  </v-flex>
                </v-layout>
                <v-layout row>
                  <v-flex xs12>
                    <v-text-field
                      name="password"
                      label="Password"
                      id="password"
                      v-model="password"
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
  </v-container>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
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
