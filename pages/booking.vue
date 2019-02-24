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
        <h1 style="text-align: center">
          Oversikt over restauranten
        </h1>
        <h2 style="text-align: center">
          <v-icon>access_time</v-icon> {{ readableTime }}
        </h2>
        <h4 style="text-align: center">
          Endre status på bordene ved å trykke på dem
        </h4>
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
        v-for="(table, index) in tables"
        :key="index"
        xs2
        md2
      >
        <div v-if="table">
          <v-btn
            v-if="table.currently > 0"
            my-2
            color="red"
            block
            class="table"
            @click="viewTable(table)"
          >
            <div class="table-text">
              <h3 class="text-xs-center">
                # {{ table.tableID }}
              </h3>
              <div class="text-xs-center">
                <h3>
                  {{ table.currently }}/{{ table.capacity }}
                  <v-icon color="black">
                    person
                  </v-icon>
                </h3>
              </div>
            </div>
          </v-btn>
          <v-btn
            v-else
            my-2
            color="green"
            block
            class="table"
            @click="viewTable(table)"
          >
            <div class="table-text">
              <h3 class="text-xs-center">
                # {{ table.tableID }}
              </h3>
              <div class="text-xs-center">
                <h3>
                  {{ table.curently }}/{{ table.capacity }}
                  <v-icon color="black">
                    person
                  </v-icon>
                </h3>
              </div>
            </div>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>
    <view-table
      :key="key"
      :dialog-visible="dialogVisible"
      :table="selectedTable"
      @dialogClosed="dialogVisible = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import ViewTable from '../Components/ViewTable'

export default {
  components: { ViewTable },
  // TODO: Legge til middleware
  data () {
    return {
      key: 0,
      dialogVisible: false,
      interval: null,
      now: 0,
      readableTime: '',
      selectedTable: {
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      },
      updateInterval: null
    }
  },
  computed: {
    ...mapGetters({
      tables: 'tables'
    })
  },
  mounted () {
    // Oppdaterer reservasjoner. Hver gang det skjer en endring i databasen på reservations, vil dette automatisk oppdateres
    this.updateReservations()
    // Oppdaterer klokken hvert sekund
    this.interval = setInterval(() => {
      this.now = moment().unix()
      this.readableTime = moment().format('HH:mm:ss')
    }, 1000)
  },
  methods: {
    // Kaller på storen
    updateReservations () {
      this.$store.dispatch('mountTodaysTablesWithReservations')
    },
    viewTable (table) {
      this.selectedTable = table
      this.dialogVisible = true
      this.key++
    }
  }
}
</script>

<style scoped>
  .table {
    height:120px;
    width:120px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .table-text {
    word-wrap: break-word;
    overflow: hidden;
    height: 100%;
    white-space:normal;
  }
</style>
