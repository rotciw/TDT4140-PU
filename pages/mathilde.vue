<template>
  <v-container>
    <v-layout
      align-space-around
      justify-space-around
      row
      fill-height
    >
      <v-flex
        xs4
        lg4
      >
        <div class="red">
          <h2 style="text-align: center">
            :))))
          </h2>
        </div>
      </v-flex>
      <v-flex
        xs4>
        <div class="blue">
          <h2 style="...">
            Taco
          </h2>
        </div>
      </v-flex>
      <v-flex
        xs4>
        <div class="green">
          <h2 style="...">
            Guacamole
          </h2>
        </div>
      </v-flex>
    </v-layout>
    <div class="text-xs-center">
      <v-btn
        large
        color="success"
        fab
        raised
      />
      <v-icon dark>list</v-icon>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Mathilde'
}
</script>

<style scoped>

</style>
