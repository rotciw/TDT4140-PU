<template>
  <v-container>
    <v-layout
      column
      align-center
      justify-start
    >
      <v-flex
      xs12
      >
        <v-img
          src="logo.png"
          height="175"
          contain
        >
        </v-img>
        <h1 class="my-3"
        >
          Legge til/Fjerne bord
        </h1>
      </v-flex>
      <v-flex
        xs12
      >
      </v-flex>
    </v-layout>
    <v-layout
      row
      align-start
      justify-space-around
      class="my-4"
    >
      <v-flex
        v-for="i in 3"
        :key="{i}"
        xs3
      >
        <v-card
          width="100"
          height="100"
          dark color="green"
          class="white--text"
        >
          <v-card-text
          >
            <h3 class="text-xs-center">#12</h3>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'TableEditor'
}
</script>

<style scoped>

</style>
