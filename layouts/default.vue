<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      dark
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-toolbar
        flat
        class="transparent"
      >
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="https://api.adorable.io/avatars/85/trippinT.png">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ firstName }} {{ lastName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
          class="tile"
          active-class="background-color: green"
          to="/dashboard"
        >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Oversikt'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="admin"
          class="tile"
          active-class="background-color: green"
          to="/tableEditor"
        >
          <v-list-tile-action>
            <v-icon>add_to_queue</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Legge til/Fjerne bord'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="admin || employee"
          class="tile"
          active-class="background-color: green"
          to="/booking"
        >
          <v-list-tile-action>
            <v-icon>local_dining</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Bookingsystem'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="admin || employee"
          class="tile"
          active-class="background-color: green"
          to="/allreservations"
        >
          <v-list-tile-action>
            <v-icon>view_list</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Alle Reservasjoner'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="admin"
          class="tile"
          active-class="background-color: green"
          to="/statistics"
        >
          <v-list-tile-action>
            <v-icon>trending_up</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Statistikk'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="customer"
          class="tile"
          active-class="background-color: green"
          to="/reservation"
        >
          <v-list-tile-action>
            <v-icon>local_dining</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Bordbestilling'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-if="customer"
          class="tile"
          active-class="background-color: green"
          to="/loyalty-program"
        >
          <v-list-tile-action>
            <v-icon>favorite_border</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Lojalitetsprogram'" />
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-side-icon @click="drawer = !drawer" />
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>{{ `chevron_${miniVariant ? 'right' : 'left'}` }}</v-icon>
      </v-btn>
      <v-flex xs2>
        <nuxt-link
          to="/dashboard"
        >
          <v-img
            src="logo-long.png"
            height="50px"
            position="left left"
            contain
          />
        </nuxt-link>
      </v-flex>      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          @click="signOut"
        >
          Logg ut
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content class="bgColor">
      <v-container>
        <v-layout>
          <v-snackbar
            v-model="snackbar"
            top
          >
            {{ error }}
            <v-btn
              color="green"
              flat
              @click="onDismissed"
            >
              Lukk
            </v-btn>
          </v-snackbar>
        </v-layout>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
      height="auto"
      color="#f5f5f5"
      inset
    >
      <v-layout
        row
        flex
        justify-center
      >
        <v-flex
          py-3
          text-xs-center
          xs12
        >
          <div class="text-xs-center">
            <b>Lagd med
              <v-icon class="red--text">
                favorite
              </v-icon>
              av PU-Gruppe 30</b>
          </div>
        </v-flex>
      </v-layout>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data () {
    return {
      clipped: false,
      drawer: null,
      fixed: false,
      miniVariant: false,
      right: true,
      rightDrawer: false,
      snackbar: false,
      test: false,
      title: 'Trippin Tacos'
    }
  },
  computed: {
    firstName () {
      if (this.$store.getters.user) return this.$store.getters.user.firstName
      else return 'Test'
    },
    lastName () {
      if (this.$store.getters.user) return this.$store.getters.user.lastName
      else return 'Testesen'
    },
    admin () {
      return this.$store.getters.admin
    },
    employee () {
      return this.$store.getters.employee
    },
    customer () {
      return this.$store.getters.customer
    },
    error () {
      return this.$store.getters.error
    }
  },
  watch: {
    error (val) {
      this.snackbar = !!(val && val.length > 1)
    }
  },
  methods: {
    onDismissed () {
      this.$store.commit('clearError')
      this.snackbar = false
    },
    signOut () {
      if (this.admin || this.employee) this.$router.push('/ansatt')
      else this.$router.push('/login')
      this.$store.dispatch('signUserOut')
    }
  }
}
</script>

<style>
  .bgColor {
    background-color: #D1DFD2;
  }
  .tile {
    margin: 5px;
    border-radius: 4px;
  }
  .tile:hover {
    background-color: green;
  }
  .tile:active {
    background-color: green;
    color: green;
  }
</style>
