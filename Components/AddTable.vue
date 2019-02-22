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
      // Regler som definerer kapasiteten
      capacityRules: [
        v => !!v || 'Trenger kapasiteten'
      ],
      confirmDelete: 0, // Brukes for å bekrefte at en ønsker å slette et bord
      dialog: this.dialogVisible, // Brukes for å si om dialogen skal være synlig
      error: '', // Setter feilmelding
      newTable: { // Definerer et nytt bord
        tableID: '',
        capacity: '',
        currently: 0,
        occupied: false
      },
      numberRules: [ // Regel for nordnummer
        v => !!v || 'Trenger bord id'
      ],
      valid: false // Om det brukeren har skrevet er valid eller ei
    }
  },
  computed: { // Returnerer bordene fra storen
    tables () {
      return this.$store.getters.tables
    }
  },
  // Lager en kopi av bordet vi får inn for å unngå at vi redigerer bordet vi får inn direkte
  mounted () {
    if (this.table) {
      this.newTable.tableID = this.table.tableID
      this.newTable.capacity = this.table.capacity
      this.newTable.currently = this.table.currently
      this.newTable.occupoed = this.table.occupied
    }
  },
  methods: {
    // Lukker dialogen hvis vi avbryter
    cancel () {
      this.dialog = false
      this.$emit('dialogClosed')
    },
    // FJerner bordet etter å ha fått bekreftet fra brukeren at det er dette hen ønsker
    remove () {
      this.confirmDelete++
      if (this.confirmDelete === 1) {
        this.error = 'Trykk en gang til for å bekrefte at du vil slette bordet'
      }
      else if (this.confirmDelete === 2) {
        this.$store.dispatch('removeTable', this.newTable)
        this.dialog = false
        this.$emit('dialogClosed')
        this.confirmDelete = 0
      }
    },
    // Oppdaterer bordet hvis det er gyldig input
    validate () {
      if (this.$refs.form.validate()) {
        this.error = ''
        this.dialog = false
        this.$store.dispatch('updateTable', this.newTable)
        this.$emit('dialogClosed')
      }
    }
  }
}
</script>

<style scoped>

</style>
