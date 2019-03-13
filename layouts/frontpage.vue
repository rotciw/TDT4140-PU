<template>
  <v-app>
    <v-toolbar>
      <v-flex xs2>
        <nuxt-link
          to="/"
        >
          <v-img
            src="logo-long.png"
            height="50px"
            position="left left"
            contain
          />
        </nuxt-link>
      </v-flex>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          @click="$router.push('/customer-reservation')"
        >
          Bordbestilling
        </v-btn>
      </v-toolbar-items>
      <v-toolbar-items>
        <v-btn
          flat
          @click="$router.push('/login')"
        >
          Logg inn
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content class="bgColor">
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
}
</script>

<style scoped>
  .bgColor {
    background-color: #D1DFD2;
  }
</style>
