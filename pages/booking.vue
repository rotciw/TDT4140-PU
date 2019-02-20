<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      <v-card>
        <v-card-title class="headline">
          Her kommer bookingsystemet for ansatte
        </v-card-title>
        <v-card-text>
          <p>Her skal man kunne gjøre mye rart</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  middleware: 'router-check',
  methods: {
    hello123 () {
      return 'wassop'
    }
  }
}
</script>
