# Trippin Tacos
[![pipeline status](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/badges/master/pipeline.svg)](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/commits/master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

![Trippin Tacos](/static/logo-long.png "Trippin Tacos")


#### Et restaurantsystem for Trippin Tacos
Trippin Tacos prosjektet er en nettside for et system der man effektivt kan reservere bord, holde oversikt og se statistikk.

Link til prosjektet: https://pu30-5b0f9.firebaseapp.com


## Installasjon/Kommandoer
I terminalen på et vilkårlig operativsystem, "clone" prosjektet lokalt. 
> `$ git clone https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30.git`

> `$ cd gruppe-30`

Installer avhengigheter: 
> `$ npm install`

Starte med utvikling inkludert hot reload: 
> `$ npm run dev`

Naviger til localhost:'portnr her' i nettleseren din for å se nettsiden. Standardport er 3000.

**Man trenger kun disse stegene for å kunne utvikle prosjektet lokalt.
Videre har man flere kommandoer:**


For å generere statisk prosjekt (for statisk utvikling): 
> `$ npm generate`

For å deploye hosting og functions til nettsiden: 
 * `$ firebase deploy`
   * Kun hosting: `$ firebase deploy --only hosting`
   * Kun cloud functions: `$ firebase deploy --only functions`
   * Teste cloud functions med f.eks Postman: `$ firebase serve --only functions`
    

## Database

## Testing

## Tech/Rammeverk brukt:
### Bygd med:
* Vuetify
* Firestore
* Node
* Nuxt

## Versjoner:
Les mer om versjonene [her](CHANGELOG.md)

Laget med :heart: av Jesper Paulsen, Maria Brenna, Mathilde Tillman Hegdal, Olav Falck-Pedersen, Una Førde Schjetne og Wictor Zhao