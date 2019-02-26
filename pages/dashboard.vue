<template>
  <div>
    <v-container>
      <v-layout row>
        <v-flex
          xs12
          sm6
          offset-sm3
        >
          <v-layout
            row
            justify-center
          >
            <v-flex xs5>
              <div style="text-align: center">
                <v-btn
                  large
                  dark
                  color="#444645"
                  block
                  class="roundedCorners"
                  @click="$router.push('/tableEditor')"
                >
                  Legge til/fjerne bord
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <v-layout
            row
            justify-center
          >
            <v-flex xs5>
              <div style="text-align: center">
                <v-btn
                  large
                  dark
                  color="#444645"
                  block
                  class="roundedCorners"
                  @click="$router.push('/allreservations')"
                >
                  Oversikt over reservasjoner
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
export default {
  middleware: ['router-check'],
  data () {
    return {
    }
  }
}

</script>

<style scoped>
  .roundedCorners {
    height:70px;
    width: 250px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
