<template>
  <v-container>
    <v-layout
      flex
      justify-center
      align-center
      row
      fill-height
    >
      <v-flex
        xs12
      >
        <h2 style="text-align: center"
            class="purple--text"
        >
          Klar til å bestille taco?
        </h2>
      </v-flex>
    </v-layout>
    <v-layout
      flex
      align-center
      justify-center
      column
      fill-height
      class="my-5"
    >
      <v-flex
        xs12
      >
        <v-btn
          class="red"
          round
        >
          klar...
        </v-btn>
      </v-flex>
      <v-flex
        xs12
      >
        <v-btn
          class="yellow"
          round
        >
          ferdig...
        </v-btn>
      </v-flex>
      <v-flex
        xs12
      >
        <v-btn
          class="green"
          round
        >
          GÅ!
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Olav'
}
</script>

<style scoped>

</style>
