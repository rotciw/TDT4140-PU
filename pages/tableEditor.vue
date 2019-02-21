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
          Legge til/Fjerne bord
        </h1>
        <h4 style="text-align: center">
          For å legge til et bord kan du trykke på et ledig bordnummer
        </h4>
        <h4 style="text-align: center">
          For å redigere eller fjerne et bord kan du trykke på et av de eksisterende bordene
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
        <v-btn
          v-if="table"
          my-2
          color="green"
          block
          class="table"
          @click="editTable(table)"
        >
          <div class="table-text">
            <h3 class="text-xs-center">
              # {{ table.tableID }}
            </h3>
            <div class="text-xs-center">
              <h3>
                {{ table.capacity }}
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
          style="opacity: 0.7"
          block
          class="table"
          @click="addTable(index)"
        >
          <div class="table-text">
            <h4 class="text-xs-center">
              Ledig bordnummer (# {{ index + 1 }})
            </h4>
          </div>
        </v-btn>
      </v-flex>
      <v-flex
        xs12
      >
        <v-btn
          round
          color="light-blue"
          @click="addTable(index)"
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
    <add-table
      :key="key"
      :dialog-visible="dialogVisible"
      :table="selectedTable"
      @dialogClosed="dialogVisible = false"
    />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import AddTable from '../Components/AddTable'

export default {
  components: { AddTable },
  data () {
    return {
      key: 0,
      dialogVisible: false,
      selectedTable: {
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      }
    }
  },
  computed: {
    ...mapGetters({
      tables: 'tables'
    })
  },
  methods: {
    addTable (index) {
      this.selectedTable.tableID = index + 1
      this.dialogVisible = true
      this.key++
      console.log(this.tables)
    },
    editTable (table) {
      this.selectedTable = table
      this.dialogVisible = true
      this.key++
      console.log(this.tables)
    }
  }
}
</script>

<style scoped>
  .table {
    height:100px;
    width:100px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .table-text {
    word-wrap: break-word;
    overflow: hidden;
    height: 100%;
    white-space:normal;
  }
</style>
