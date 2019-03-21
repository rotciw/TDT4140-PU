<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-dialog
      v-model="termsdialog"
      max-width="800px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Vilkår og betingelser</span>
        </v-card-title>
        <v-card-text>
          Hehe
        </v-card-text>
      </v-card>
    </v-dialog>
    <img
      src="logo-long.png"
      height="150px"
      contain
      style="margin-bottom:50px"
    >
    <v-spacer>
    </v-spacer>
    <v-btn
      color="red darken-1"
      flat
      @click="close"
    >
      Avbryt
    </v-btn>
  </v-layout>
</template>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style scoped>
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }
</style>
