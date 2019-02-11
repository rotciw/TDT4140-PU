<template>
  <v-container>
    <v-layout
      row
      flex
      justify-center
      align-center
    >
      <v-flex
        xs12
      >
        <h2 style="text-align: center">
          Hei
        </h2>
      </v-flex>
    </v-layout>
    <v-layout
      row
      wrap
      justify-space-between
    >
      <v-flex
        xs12
        sm4
      >
        <h3>Test</h3>
        <p>
          <br>
          <br>
          <br>
          Test
        </p>
      </v-flex>
      <v-flex
        xs12
        sm4
      >
        <h3>Test</h3>
        <p>
          <br>
          <br>
          <br>
          Test
        </p>
      </v-flex>
    </v-layout>
    <v-layout
      class="my-5"
      row
      wrap
      justify-center
    >
      <jesper-v-card
        :parents-icon="icon"
        @colorChange="colorChanged"
      />
      <v-flex xs12>
        <h5>{{ text }}</h5>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import JesperVCard from '../components/tutorial/JesperVCard'

export default {
  name: 'jesper',
  components: { JesperVCard },
  data () {
    return {
      counter: 0,
      icon: null,
      text: ''
    }
  },
  beforeMount () {
    this.icon = 'local_pizza'
  },
  methods: {
    colorChanged (val) {
      this.counter++
      this.text = this.counter + '. gang fargen ble endret. Den er nå ' + val
    }
  }
}
</script>

<style scoped>

</style>
