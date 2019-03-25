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
          <div class="content" id="style-1">
            <h1 style="text-align: center">
              Vilkår & Betingelser
            </h1>
            <br>
            <div class="title">
              1 - Personvern
            </div>
            <div class="text">
              All personlig informasjon eller materiale som sendes
              til Trippin Tacos nettsteder er underlagt Trippin Tacos policy om personvern.
            </div>
            <br>
            <div class="title">
              2 - Nøyaktighet, fullstendighet og aktualitet
            </div>
            <div class="text">
              Vi er ikke ansvarlige dersom den informasjonen vi gjør tilgjengelig på dette nettstedet ikke er
              korrekt eller komplett. Din tillit til materialet på dette nettstedet er din personlige.
              Du samtykker i at det er ditt ansvar å overvåke eventuelle endringer i materialet og informasjonen
              som finnes på dette nettstedet.
            </div>
            <br>
            <div class="title">
              3 - Oppdateringer angående ansvarserklæring
            </div>
            <div class="text">
              Vi forbeholder oss retten til å gjøre eventuelle endringer og rettelser på
              denne beskjeden. Vennligst kom tilbake til denne siden fra tid til annen for å
              gjennomgå disse og nye tilleggsopplysninger.
            </div>
            <br>
            <div class="title">
              4 - IP & Cookies
            </div>
            <div class="text">
              Når du besøker oss, lagrer vi din IP nummer hos oss og noen tilfeller bruker vi en liten Cookies­fil på
              datamaskinen for å forbedre service. De opplysningene hverken videre gis eller selges.
            </div>
            <br>
            <div class="title">
              5 - Angrerett
            </div>
            <div class="text">
              Det er ingen angrerett ved bestilling av mat, regnet fra tidspunktet for bekreftelse av bestillingen i restauranten.
              Enhver bestilling går direkte til kokken og anses derfor som å være påbegynt etter bestilling i restauranten.
            </div>
            <div class="text">
              Når du besøker oss, lagrer vi din IP nummer hos oss og noen tilfeller bruker vi en liten Cookies­fil på
              datamaskinen for å forbedre service. De opplysningene hverken videre gis eller selges.
            </div>
            <br>
            <div class="title">
              6 - Priser
            </div>
            <div class="text">
              Alle priser er dagspriser og kun gjeldende på bestillingsdagen. Det kan derfor forekomme prisendringer.
              Vi forbeholder oss retten til å endre priser uten varsel på grunn av trykkfeil og evt. prisendringer.
            </div>
            <br>
            <div class="title">
              7 - Misbruk
            </div>
            <div class="text">
              Misbruk av vår hjemmeside vil medføre til politianmeldelse.
              IP adresser vil bli lagret som hjelp til en evt. etterforskning.
            </div>
            <br>
            <div class="title">
              8 - Sikkerhet
            </div>
            <div class="text">
              Vi er opptatt av å håndtere personopplysninger på en trygg måte. Vi samler inn og oppbevarer loggdata
              som hvilke tider kunder kikker eller søker på,
              for å lære hva våre kunder er opptatt av, samt forbedre restauranten og tilbud.
              Denne informasjonen benyttes også for å kunne gjøre det mulig å tilby deg relevante
              matretter, eller sende deg relaterte tilbud (dersom du har bedt om dette). Informasjonen
              benyttes også for å produsere trafikkstatistikker for bl.a. kapasitetsplanlegging.
            </div>
          </div>
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
  .box {
    height: 500px;
    width: 550px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .content {
    height: 430px;
    width: 500px;
    overflow: auto;
    background: #F5F5F5;
    overflow-y: scroll;
  }
  #style-1::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  #style-1::-webkit-scrollbar
  {
    width: 10px;
    background-color: #F5F5F5;
  }

  #style-1::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #555;
  }

  .text {
    text-align: left;
  }
  .title {
    text-align: left;
  }
</style>
