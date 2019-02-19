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
        />
        <h1
          class="my-3"
        >
          Legge til/Fjerne bord
        </h1>
      </v-flex>
      <v-flex
        xs12
      />
    </v-layout>
    <v-layout
      row
      wrap
      align-start
      justify-start
      class="my-4"
    >
      <v-flex
        v-for="i in 7"
        :key="{i}"
        xs4
        md2
      >
        <v-card
          width="100"
          height="100"
          dark
          color="green"
          class="my-2"

        >
          <v-card-text class="black--text">
            <h3 class="text-xs-center">
              #12
            </h3>
            <div class="text-xs-center">4
              <v-icon color="black">
                person
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex
        xs12
      >
        <v-btn
          @click="addTable(table)"
          round
          color="light-blue"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn
          round
          color="red"
        >
          <v-icon>remove</v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      tables: []
    }
  },
  methods: {
    addTable (table) {
      this.tables.append(table)
    }
  }
}
</script>

<style scoped>

</style>
