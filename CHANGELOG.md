# Changelog
Alle store endringer på prosjektet vil bli dokumentert her,

# v1.1.0 21.02.2019
### Lagt til
* Nytt layout
* Ny forside
* Firebase
* Mulighet for å logge inn
* Mulighet for å logge ut
* Mulighet for å legge til bord
* Mulighet for å fjerne bord

### Hotfixes
* La til kommentarer
* Fikset problem hvor login knappen forsvant pga v-if="!user"
* Fikset problem hvor bord ble mutert i stedet for å bli kopiert i AddTable. Dette løste at man ikke lenger fikk feilmelding når man endret bordet, og at det ikke er mulig å opprette bord uten å oppgi bordnummer eller kapasitet.

# v1.0.9
Storen blir nå testet

# v1.0.8
Brukere med admin tilgang kan nå slette og legge til bord.
Bordene lastes og slettes via storen.

# v1.0.7 21.02.2019
* Mulighet for å logge ut

# v1.0.6 21.02.2019
Nuxt generate og ci/cd fungerer
### Lagt til
* Ryddet i mappestrukturen
* Bygget prosjektet fra bunnen av på nytt
