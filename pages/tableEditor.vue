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
        <h1
          class="my-3"
        >
          Legge til/Fjerne bord
        </h1>
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
        v-for="i in 10"
        :key="{i}"
        xs4
        md2
      >
        <v-card
          class="roundedBoxes"
          color="#707070"
        >
          <v-card-text class="black--text">
            <h3 class="text-xs-center">
              #12
            </h3>
            <div class="text-xs-center">
              4
              <v-icon color="black">
                person
              </v-icon>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout
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
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data () {
    return {
      tables: []
    }
  },
  methods: {
    addTable (table) {
      this.tables.append(table)
    }
  }
}
</script>

<style scoped>
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
