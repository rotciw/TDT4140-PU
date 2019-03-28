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
          <h1 style="text-align: center">
            Statistikk
          </h1>
          <div class="button">
            <v-btn
              v-if="statisticsType==='monthlyCostumers'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Månedlige kundebesøk
            </v-btn>
            <v-btn
              v-else
              dark
              large
              class="button"
              color="#707070"
              @click="fillData('monthlyCostumers')"
            >
              Månedlige kundebesøk
            </v-btn>
            <v-btn
              v-if="statisticsType==='monthlyReservations'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Månedlige reservasjoner
            </v-btn>
            <v-btn
              v-else
              color="#707070"
              dark
              large
              class="button"
              @click="fillData('monthlyReservations')"
            >
              Månedlige reservasjoner
            </v-btn>
            <v-btn
              v-if="statisticsType==='dailyCostumers'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Daglige kundebesøk
            </v-btn>
            <v-btn
              v-else
              color="#707070"
              dark
              large
              class="button"
              @click="fillData('dailyCostumers')"
            >
              Daglige kundebesøk
            </v-btn>
            <v-btn
              v-if="statisticsType==='dailyReservations'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Daglige reservasjoner
            </v-btn>
            <v-btn
              v-else
              color="#707070"
              dark
              large
              class="button"
              @click="fillData('dailyReservations')"
            >
              Daglige reservasjoner
            </v-btn>
            <v-btn
              v-if="statisticsType==='hourlyCostumers'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Tidspunkt kundebesøk
            </v-btn>
            <v-btn
              v-else
              color="#707070"
              dark
              large
              class="button"
              @click="fillData('hourlyCostumers')"
            >
              Tidspunkt kundebesøk
            </v-btn>
            <v-btn
              v-if="statisticsType==='hourlyReservations'"
              dark
              large
              class="button"
              color="green darken-4"
            >
              Tidspunkt reservasjoner
            </v-btn>
            <v-btn
              v-else
              color="#707070"
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
              v-if="!loaded"
              :loading="!loaded"
              depressed
              class="loading"
            />
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
  mounted () {
    this.fillData('monthlyCostumers')
  },
  methods: {
    fillData (statisticsType) {
      this.statisticsType = statisticsType
      console.log(this.statisticsType)
      if (statisticsType === 'monthlyCostumers') {
        this.showData('https://us-central1-pu30-5b0f9.cloudfunctions.net/monthlyNumberOfPersons')
          .then(() => {
            this.datacollection = {
              labels: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
              datasets: [
                {
                  label: 'Gjennomsnittlig antall kunder per mnd',
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
                  label: 'Gjennomsnittlig antall reservasjoner per mnd',
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
                  label: 'Gjennomsnittlig antall kunder per dag',
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
                  label: 'Gjennomsnittlig antall reservasjoner per dag',
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
                  label: 'Gjennomsnittlig antall kunder per klokkeslett',
                  backgroundColor: '#6BE096',
                  data: this.datacollection // TODO: Splice array
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
              labels: ['12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
              datasets: [
                {
                  label: 'Gjennomsnittlig antall reservasjoner per klokkeslett',
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
  }
}
</script>

<style>
  .button {
    border-radius: 0px 18px 0px 18px;
    width: 300px;
  }

  .activeButton {
    border-radius: 0px 18px 0px 18px;
    width: 300px;
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
