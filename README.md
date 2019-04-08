# Trippin Tacos
[![pipeline status](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/badges/master/pipeline.svg)](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/commits/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Trippin Tacos](/static/logo-long.png "Trippin Tacos")


#### Et restaurantsystem for Trippin Tacos
Trippin Tacos prosjektet er en nettside for et system der man effektivt kan reservere bord, holde oversikt og se statistikk.

Prosjektet er laget etter etterspørsel fra produkteier av Trippin Tacos.
Link til prosjektet: https://pu30-5b0f9.firebaseapp.com


## Installasjon/Kommandoer
"Clone" eller "Fork" prosjektet. Deretter i terminalen kan du navigere til prosjektet.

Installer avhengigheter: 
> `npm install`

For å utvikle med hot reload: 
> `npm run dev`

For å generere statisk prosjekt: 
> `npm generate`

For å deploye hosting og functions til nettsiden: 
 * `firebase deploy`
   * Kun hosting: `firebase deploy --only hosting`
   * Kun cloud functions: `firebase deploy --only functions`
   * Teste cloud functions med f.eks Postman: `firebase serve --only functions`
    

## Testing

## Tech/Rammeverk brukt:
### Bygd med:
* Vuetify
* Firestore

## Versjoner:
Les mer om versjonene [her](CHANGELOG.md)

Laget med :heart: av Jesper Paulsen, Maria Brenna, Mathilde Tillman Hegdal, Olav Falck-Pedersen, Una Førde Schjetne og Wictor Zhao