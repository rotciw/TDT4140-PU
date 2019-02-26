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
          color="grey"
          style="opacity: 0.7"
          block
          class="table"
          @click="addTable(index)"
        >
          <div class="table-text">
            <div class="text-xs-center">
              <h3>
                # {{ index + 1 }}
              </h3>
              <h3>
                <v-icon color="black">
                  add
                </v-icon>
              </h3>
            </div>
          </div>
        </v-btn>
      </v-flex>
      <v-flex
        xs2
        md2
      >
        <v-btn
          my-2
          color="green accent-3"
          style="opacity: 0.7"
          block
          class="table"
          @click="addTable(tables.length)"
        >
          <div class="table-text">
            <div class="text-xs-center">
              <h3>
                <v-icon color="black">
                  add
                </v-icon>
              </h3>
            </div>
          </div>
        </v-btn>
      </v-flex>
    </v-layout>
    <!--<v-layout
      column
      justify-center
      align-center
    >
      <v-flex
        xs12
      >
        <div class="box">
          <v-btn
            class="roundedCorners"
            color="#6BE096"
            @click="addTable(table)"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-btn
            class="roundedCorners"
            color="#E06B6B"
          >
            <v-icon>remove</v-icon>
          </v-btn>
        </div>
      </v-flex>
    </v-layout>-->
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
  middleware: 'admin',
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
      this.selectedTable = {
        tableID: index + 1,
        capacity: '',
        currently: 0,
        occupied: false
      }
      this.dialogVisible = true
      this.key++
    },
    editTable (table) {
      this.selectedTable = table
      this.dialogVisible = true
      this.key++
    }
  }
}
</script>

<style scoped>
  .table {
    height:100px;
    width:100px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .table-text {
    word-wrap: break-word;
    overflow: hidden;
    height: 100%;
    white-space:normal;
  }
  .roundedCorners {
    height:80px;
    width: 80px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedBoxes {
    margin: 0px 0px 50px 0px;
    height:110px;
    width: 110px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .box{
    margin-top:-30px;
    height:130px;
    width: 280px;
    padding:15px;
    text-align: center;
    display: inline-block;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
