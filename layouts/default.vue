<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
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
              <img src="https://randomuser.me/api/portraits/men/85.jpg">
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title>{{ firstName }} {{ lastName }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>
      <v-list>
        <v-list-tile
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
          to="/tableEditor"
        >
          <v-list-tile-action>
            <v-icon>dashboard</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'bordoversikt'" />
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          to="/booking"
        >
          <v-list-tile-action>
            <v-icon>local_dining</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="'Bookingsystem'" />
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
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          @click="signOut"
        >
          Logg ut
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
    <v-footer
      :fixed="fixed"
      app
    >
      <span>
        <v-layout
          row
          flex
          justify-center
        >
          <v-flex
            xs12
            sm12
            style="text-align: center"
          >
            &copy; PU-Gruppe 30 2019
          </v-flex>
        </v-layout>
      </span>
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
    }
  },
  methods: {
    signOut () {
      this.$store.dispatch('signUserOut')
      this.$router.push('/login')
      // TODO: Make sure it signs out
      // this.$store.dispatch('clearState')
      console.log(this.$store.state)
    }
  }
}
</script>

<style>
  .bgColor{
    background-color: #D1DFD2;
  }
</style>
