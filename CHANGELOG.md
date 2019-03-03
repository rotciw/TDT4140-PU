# Changelog
Alle store endringer på prosjektet vil bli dokumentert her,

# v1.1.9 28.02.2019
Denne versjonen inneholder den ferdige brukerhistorien #7 (Issue #18):
07: Ansatte endre reservasjon
* Reservasjonsoversikt
* Endre reservasjon
* Slette reservasjon

### Hotfixes 
#### 01.03.2019:
* Alle reservasjoner viser nå kun reservasjoner fra og med starten av dagen og fram i tid
* Reservasjoner kan nå endre dato
* Allreservations sjekker nå om bordet er ledig før det kan bookes
* Bookingsystemet tillater ikke lenger flere gjester enn det er kapasitet til på bordet
* Fikset feil hvor ViewTable tillot booking tilbake i tid.
* FIkset feil hvor ViewTable ikke slo ut på alle tall i antall personer
#### 03.03.2019:
* Fikset feil som gjorde at functions mappen ikke ville bli deployet

# v1.1.8 26.02.2019
Inneholder brukerhistoriene 4, 5, 6, 7 og 8 (Issues: #10, #15, #16, #18 og #19):
## Nytt i denne versjonen:
* 04: Ansatte kan logge inn
  * Store riktig state
  * Middleware på employee sider
* 05: Ansatte kan logge ut
* 06: Ansatte kan reservere bord:
  * Booking oversikt
  * Dialog for å opprette reservasjon
  * Dialog for å endre reservasjon
* 07: **WIP**: Ansatte endre reservasjon
  * Reservasjonsoversikt
  * Endre reservasjon
* 08: Ansatte slette reservasjon

# v1.1.4
Denne versjonen gjør det mulig for å ansatte og se statusen til restauranten, og de inviduelle bordene.
* Bookingsystem som viser grønn farge for ledige bord, og rød for opptatt.
* Info om de ulike bordene, og evt. om aktiv reservasjon
* Oppdatere pågående reservasjoner
* Opprette nye versjoner

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
