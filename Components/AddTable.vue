<template>
  <v-layout
    row
    justify-center
  >
    <v-dialog
      v-model="dialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span
            v-if="!table"
            class="headline"
          >
            Legg til bord
          </span>
          <span
            v-else
            class="headline"
          >
            Endre/fjern bord
          </span>
        </v-card-title>
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="newTable.tableID"
                    label="Bordnummer"
                    :rules="numberRules"
                    required
                  />
                </v-flex>
                <v-flex
                  xs12
                  sm6
                  md4
                >
                  <v-text-field
                    v-model="newTable.capacity"
                    label="Antall plasser"
                    hint="Hvor mange plasser har bordet?"
                    :rules="capacityRules"
                  />
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <p style="color: red">
              {{ error }}
            </p>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              flat
              @click="dialog = false"
            >
              Lukk
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              @click="validate"
            >
              Lagre
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: 'AddTable',
  props: ['dialogVisible', 'table', 'tableNumber'],
  data () {
    return {
      capacityRules: [
        v => !!v || 'Trenger kapasiteten'
      ],
      dialog: this.dialogVisible,
      error: '',
      newTable: {
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      },
      numberRules: [
        v => !!v || 'Trenger bord id'
      ],
      valid: false
    }
  },
  computed: {
    tables () {
      return this.$store.getters.tables
    }
  },
  mounted () {
    if (this.table) {
      this.newTable = this.table
    }
    console.log(this.newTable)
  },
  methods: {
    cancel () {
      this.dialog = false
      this.$emit('dialogClosed')
    },
    validate () {
      console.log(this.tables)
      if (this.$refs.form.validate() && !this.tables[this.newTable.tableID - 1]) {
        // this.$store.dispatch('addTable', this.newTable)
        this.error = ''
        this.dialog = false
        this.$emit('dialogClosed')
      }
      else if (this.tables[this.newTable.tableID - 1]) {
        this.error = 'Det finnes allerede et bord med dette nummeret'
      }
    }
  }
}
</script>

<style scoped>

</style>
