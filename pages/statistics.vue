<template>
  <v-container
    fluid
  >
    <v-layout
      row
      justify-space-around
    >
      <v-flex>
        <v-layout
          column
          align-center
          justify-space-around
          fill-height
        >
          <div class="button">
            <v-btn
              dark
              large
              class="button"
              color="green darken-4"
              :class="{activeButton: statisticsType === 'monthlyCostumers'}"
              @click="fillData('monthlyCostumers')"
            >
              Månedlige kundebesøk
            </v-btn>
            <v-btn
              color="green darken-4"
              dark
              large
              class="button"
              @click="fillData('monthlyReservations')"
            >
              Månedlige reservasjoner
            </v-btn>
            <v-btn
              color="green darken-4"
              dark
              large
              class="button"
              @click="fillData('dailyCostumers')"
            >
              Ukedager kundebesøk
            </v-btn>
            <v-btn
              color="green darken-4"
              dark
              large
              class="button"
              @click="fillData('dailyReservations')"
            >
              Ukedager reservasjoner
            </v-btn>
            <v-btn
              color="green darken-4"
              dark
              large
              class="button"
              @click="fillData('hourlyCostumers')"
            >
              Tidspunkt kundebesøk
            </v-btn>
            <v-btn
              color="green darken-4"
              dark
              large
              class="button"
              @click="fillData('hourlyReservations')"
            >
              Tidspunkt reservasjoner
            </v-btn>
          </div>
        </v-layout>
      </v-flex>
      <v-flex>
        <div
          class="chartbox"
        >
          <v-layout
            column
            justify-center
          >
            <v-btn
              :loading="!loaded"
              v-if="!loaded"
              depressed
              class="loading"
            >
            </v-btn>
          </v-layout>
          <bar-chart
            v-if="loaded"
            :chart-data="datacollection"
          />
        </div>
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
    statisticsType: 'monthlyCostumers',
    loaded: false
  }),
  methods: {
    fillData (statisticsType) {
      if (statisticsType === 'monthlyCostumers') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons')
          .then(() => {
            this.datacollection = {
              labels: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
              datasets: [
                {
                  label: 'Kunder pr mnd',
                  backgroundColor: '#6BE096',
                  data: this.datacollection
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
      else if (statisticsType === 'monthlyReservations') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfReservations')
          .then(() => {
            this.datacollection = {
              labels: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
              datasets: [
                {
                  label: 'Reservasjoner pr mnd',
                  backgroundColor: '#6BE096',
                  data: this.datacollection
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
      else if (statisticsType === 'dailyCostumers') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/dailyNumberOfPersons')
          .then(() => {
            this.datacollection = {
              labels: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
              datasets: [
                {
                  label: 'Kunder pr dag',
                  backgroundColor: '#6BE096',
                  data: this.datacollection
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
      else if (statisticsType === 'dailyReservations') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/dailyNumberOfReservations')
          .then(() => {
            this.datacollection = {
              labels: ['man', 'tir', 'ons', 'tor', 'fre', 'lør', 'søn'],
              datasets: [
                {
                  label: 'Reservasjoner pr dag',
                  backgroundColor: '#6BE096',
                  data: this.datacollection
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
      else if (statisticsType === 'hourlyCostumers') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/hourlyNumberOfPersons')
          .then(() => {
            this.datacollection = {
              labels: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
              datasets: [
                {
                  label: 'Kunder pr klokkeslett',
                  backgroundColor: '#6BE096',
                  data: this.datacollection // Splice array
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
      else if (statisticsType === 'hourlyReservations') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/hourlyNumberOfReservations')
          .then(() => {
            this.datacollection = {
              labels: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11',
                '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
              datasets: [
                {
                  label: 'Reservasjoner pr klokkeslett',
                  backgroundColor: '#6BE096',
                  data: this.datacollection
                }
              ]
            }
            console.log(this.datacollection)
          })
      }
    },
    showData (string) {
      this.loaded = false
      return axios.get(string)
        .then(response => {
          this.datacollection = response.data
          console.log(response)
          this.loaded = true
          return 'loaded'
          // this.fillData()
        })
        .catch(e => {
          console.error(e)
        })
    }
  },
  mounted () {
    this.fillData('monthlyCostumers')
  }
}
</script>

<style>
  .button {
    border-radius: 0px 18px 0px 18px;
    width: 300px;
    color: orangered;
  }

  .activeButton {
    background-color: darkblue;
  }

  .loading {
    height: 200px;
    margin-top: 150px;
  }

  .chartbox{
    height:500px;
    width: 500px;
    padding:30px;
    background-color: #f5f5f5;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
