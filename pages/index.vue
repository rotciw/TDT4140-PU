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
          Velkommen til Trippin Tacos. Vi er best på taco
        </v-card-title>
        <v-card-text>
          <p>Her skal man kunne se oversikt over hva som skjer</p>
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
  methods: {
    hello123 () {
      return 'wassop'
    }
  }
}
</script>
