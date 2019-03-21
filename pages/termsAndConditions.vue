<template>
  <v-container
    bg
    fill-height
    grid-list-md
    text-xs-center
  >
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        xs6
      >
        <div class="box">
          <h1 style="text-align: center">
            Vilkår & Betingelser
          </h1>
          <v-scroll>
            <br>
            <div class="title">1 Personvern</div>
            <div class="text">
              All personlig informasjon eller materiale som sendes
              til Trippin Tacos nettsteder er underlagt Trippin Tacos policy om personvern.
            </div>
            <br>
            <div class="title">2 Nøyaktighet, fullstendighet og aktualitet</div>
            <div class="text">
              Vi er ikke ansvarlige dersom den informasjonen vi gjør tilgjengelig på dette nettstedet ikke er
              korrekt eller komplett. Din tillit til materialet på dette nettstedet er din personlige.
              Du samtykker i at det er ditt ansvar å overvåke eventuelle endringer i materialet og informasjonen
              som finnes på dette nettstedet.
            </div>
            <br>
            <div class="title">3 Oppdateringer angående ansvarserklæring</div>
            <div class="text">
              Vi forbeholder oss retten til å gjøre eventuelle endringer og rettelser på
              denne beskjeden. Vennligst kom tilbake til denne siden fra tid til annen for å
              gjennomgå disse og nye tilleggsopplysninger.
            </div>
          </v-scroll>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

export default {
  layout: 'frontpage',
  data () {
    return {
    }
  },
  methods: {
  }
}
</script>

<style scoped>
  .box{
    height: 500px;
    width: 550px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .text {
    text-align: left;
  }
  .title {
    text-align: left;
  }
</style>
