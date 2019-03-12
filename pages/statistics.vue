<template>
  <v-container
    fluid
    grid-list-md>
    {{ datacollection }}
    <v-layout
      row
      wrap
    >
      <v-flex
        xs6
      >
        <div class="button">
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Månedlige kundebesøk
          </v-btn>
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Månedlige reservasjoner
          </v-btn>
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Ukedager kundebesøk
          </v-btn>
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Ukedager reservasjoner
          </v-btn>
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Tidspunkt kundebesøk
          </v-btn>
          <v-btn
            color="green darken-4"
            dark
            large
            class="button"
            @click="fillData"
          >
            Tidspunkt reservasjoner
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <v-layout
      row wrap
    >
      <v-flex
        xs6
      >
        <bar-chart v-if="loaded" :chart-data="datacollection" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BarChart from '../Components/BarChart.js'
import axios from 'axios'

export default {
  components: {
    BarChart
  },
  middleware: ['router-check', 'admin'],
  data: () => ({
    datacollection: null,
    title: 'Kundetrafikk',
    loaded: false
  }),
  computed: {
    monthlyNumberOfPersons () {
      return axios.get('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons')
    },
    monthlyNumberofReservations () {
      return axios.get('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons')
    }
  },
  async mounted () {
    this.loaded = false
    try {
      // const { monthly } = await fetch('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons')
      axios.get('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons').then(response => {
        response.data.then(array => { array.map.this.datacollection(response) })
        console.log(this.datacollection)
        console.log(typeof this.datacollection)
      })
      this.loaded = true
      this.fillData()
    }
    catch (e) {
      console.error(e)
    }
  },
  methods: {
    fillData () {
      this.datacollection = {
        labels: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        datasets: [
          {
            label: 'Kunder pr time',
            backgroundColor: '#6BE096',
            data: this.datacollection
          }
        ]
      }
    }
  }
}
</script>

<style>
  .small {
    max-width: 1000px;
    margin:  100px auto;
  }
  .button {
    border-radius: 0px 18px 0px 18px;
    width: 300px;
  }
</style>
