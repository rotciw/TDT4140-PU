<template>
  <v-container style="text-align: center">
    <v-layout
      column
      align-center
      justify-start
    >
      <v-flex
        xs12
      >
        <div class="margin">
          <h1>
            Lojalitetsprogram
          </h1>
          <h4>
            Her hos Trippin Tacos verdsetter vi kundene våre. Du får derfor hvert 8 måltid helt gratis!
          </h4>
          <h4>
            Du mangler bare {{ stampsLeftBeforeDiscount }} stempel for å få et gratis måltid.
          </h4>
        </div>
        <v-divider></v-divider>
      </v-flex>
      <v-flex
        xs12
      >
        <table class="margin" id="loyaltytable">
          <tr>
            <td>
              <v-flex xs2>
                <img v-if="numOfStamps >= 1" src="logo-clean.png" class="logo">
                <h4 v-else>1</h4>
              </v-flex>
            </td>
            <td class="td">
              <img v-if="numOfStamps >= 2" src="logo-clean.png" class="logo">
              <h4 v-else>2</h4>
            </td>
            <td><img v-if="numOfStamps >= 3" src="logo-clean.png" class="logo">
              <h4 v-else>3</h4>
            </td>
            <td><img v-if="numOfStamps >= 4" src="logo-clean.png" class="logo">
              <h4 v-else>4</h4>
            </td>
          </tr>
          <tr>
            <td>
              <img v-if="numOfStamps >= 5" src="logo-clean.png" class="logo">
              <h4 v-else>5</h4>
            </td>
            <td><img v-if="numOfStamps >= 6" src="logo-clean.png" class="logo">
              <h4 v-else>6</h4>
            </td>
            <td><img v-if="numOfStamps >= 7" src="logo-clean.png" class="logo">
              <h4 v-else>7</h4>
            </td>
            <td><img src="free-st.png" class="logo">
            </td>
          </tr>
        </table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import moment from 'moment'

export default {
  name: 'loyaltyprogram',
  middleware: ['router-check', 'customer'],
  data () {
    return {
      reservationsArray: [],
      customerStamps: 0,
      numStampsBeforeDiscount: 8
    }
  },
  computed: {
    stampsLeftBeforeDiscount () {
      return (this.numStampsBeforeDiscount - this.customerStamps - 1)
    },
    numOfStamps () {
      return this.customerStamps
    },
    reservations () {
      return this.reservationsArray
    }
  },
  mounted () {
    this.calculateStamps()
    console.log(this.customerStamps)
    console.log(this.reservationsArray)
  },
  methods: {
    calculateStamps () {
      this.$store.getters.customerReservations.forEach(reservation => {
        if (reservation.endTime < moment().valueOf()) {
          if (!this.reservationsArray.includes(reservation.reservationID)) {
            this.reservationsArray.push(reservation.reservationID)
          }
        }
      })
      this.customerStamps = (this.reservationsArray.length % 8)
    }
  }
}

</script>

<style scoped>

  #loyaltytable{
    border-collapse: collapse;
    align-content: center;
    overflow: auto;
    background-color: whitesmoke;
    margin: 70px;
  }
  #loyaltytable td{
    padding: 10px;
    border: 2px solid black;
    text-align: center;
    font-size: 30px;
    width: 150px;
  }
  .logo{
    display: block;
    margin-left: auto;
    margin-right: auto;
    border: 3px;
    height: 60px;
    width: auto;
    margin: 15px;
  }
  .margin {
    margin: 15px
  }
</style>
