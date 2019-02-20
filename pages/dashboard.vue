<template>
  <div>
    <v-container>
      <v-layout row>
        <v-flex
          xs12
          sm6
          offset-sm3
        >
          <v-layout row>
            <v-flex xs12>
              <v-img
                src="logo-long.png"
                height="225"
                contain
              />
            </v-flex>
          </v-layout>
          <v-layout
            row
            justify-center
          >
            <v-flex xs5>
              <div style="text-align: center">
                <v-btn
                  dark
                  large
                  color="#444645"
                  block
                  class="roundedCorners"
                >
                  Legge til/fjerne bord
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
  data () {
    return {
    }
  },
  mounted () {
    console.log(this.$store.state)
  }
}
</script>

<style scoped>
  .roundedCorners {
    height:150px;
    width:250px;
    border-radius: 0px 18px 0px 18px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
</style>
