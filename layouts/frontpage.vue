<template>
  <v-app>
    <v-toolbar>
      <v-flex xs4>
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
          @click="$router.push('/login')"
        >
          Logg inn
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
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

</style>
