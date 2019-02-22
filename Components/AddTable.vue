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
            v-if="!table.capacity"
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
              v-if="tables.includes(table)"
              color="red"
              round
              dark
              flat
              @click="remove"
            >
              <v-icon dark>
                delete
              </v-icon>
              Slett
            </v-btn>
            <v-btn
              color="blue darken-1"
              dark
              round
              flat
              @click="cancel"
            >
              Avbryt
            </v-btn>
            <v-btn
              color="blue darken-1"
              flat
              round
              dark
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
  props: {
    dialogVisible: Boolean,
    table: {
      type: Object,
      default: function () {
        return {
          tableID: '',
          capacity: '',
          currently: 0,
          occupied: false
        }
      }
    },
    tableNumber: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      capacityRules: [
        v => !!v || 'Trenger kapasiteten'
      ],
      confirmDelete: 0,
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
  },
  methods: {
    cancel () {
      this.dialog = false
      this.$emit('dialogClosed')
    },
    remove () {
      this.confirmDelete++
      if (this.confirmDelete === 1) {
        this.error = 'Trykk en gang til for å bekrefte at du vil slette bordet'
      }
      else if (this.confirmDelete === 2) {
        if (this.tables.includes(this.table)) {
          this.$store.dispatch('removeTable', this.table)
          this.dialog = false
          this.$emit('dialogClosed')
        }
        else this.error = 'Klarte ikke å finne bordet du ville slette'
        this.confirmDelete = 0
      }
    },
    validate () {
      if (this.$refs.form.validate()) {
        // this.$store.dispatch('addTable', this.newTable)
        this.error = ''
        this.dialog = false
        this.$store.dispatch('updateTable', this.table)
        this.$emit('dialogClosed')
      }
      else if (this.tables[this.newTable.tableID - 1].occupied) {
        this.error = 'Bord # ' + this.newTable.tableID + ' er i bruk'
      }
    }
  }
}
</script>

<style scoped>

</style>
