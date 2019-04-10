# Trippin Tacos
[![pipeline status](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/badges/master/pipeline.svg)](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/commits/master)
[![Vue Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://eslint.vuejs.org/rules/)

![Trippin Tacos](/static/logo-long.png "Trippin Tacos")


#### Et restaurantsystem for Trippin Tacos
Trippin Tacos prosjektet er en nettside for et system der man effektivt kan reservere bord, holde oversikt og se statistikk.

Link til prosjektet: https://pu30-5b0f9.firebaseapp.com


## Installasjon/Kommandoer
I terminalen på et vilkårlig operativsystem, "clone" prosjektet lokalt. 
> `$ git clone https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30.git`

> `$ cd gruppe-30`

Hvis du ikke har node installert må du installere dette. Det kan du gjøre [her](https://nodejs.org/en/)

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
  * Teste cloud functions lokalt med f.eks Postman: `$ firebase serve --only functions`
  
  
## Kode stil
Vi bruker streng ESLint for å sørge for at all kode følger den samme konvensjonen. Konvensjonen som blir benyttet er
Vue sine anbefalte konvensjoner (A, B, C og ukategorisert) https://eslint.vuejs.org/rules/.

## Kodeeksempler

#### Spørringer til databasen
```JavaScript
// Eksempel som viser hvordan man kan gjøre spørringer til databasen. Denne koden oppretter en gjestebruker
createGuestUser (payload) {
    const userObject = {
      firstName: payload.firstName || '',
      lastName: payload.lastName || '',
      email: payload.email || '',
      mobile: payload.mobile || ''
    }
    return fs.collection('guestUsers').add(userObject)
      .then(guestID => {
        userObject.guestID = guestID.id
        return fs.collection('guestUsers').doc(userObject.guestID + '').set(userObject)
          .then(() => {
            console.log(guestID)
            return guestID.id
          })
      })
      .catch(error => {
        console.log('Klarte ikke å lage gjestebruker')
        console.log(error)
      })
  },
```
#### Bruke storen
Dette eksempelet viser de ulike delene som går med på å bruke storen til å logge inn en bruker.

**pages/login.vue:**
```JavaScript
// Kaller på storen for å logge oss inn
    onSignin () {
    // Man kaller på async funksjonene i storen, kalt actions, slik som dette:
      this.$store.dispatch('signUserIn', { email: this.email, password: this.password })
    }

```

**store/index.js:**
```JavaScript
// Kaller på sotren for å logge oss inn
    /* signUserIn brukes av login for å logge inn brukeren. Først autentiserers den hos google, før vi henter dataene
  * vi har lagret på brukeren */
  signUserIn ({ commit }, payload) {
    commit('setLoading', true)
    commit('clearError')
    firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
      .then(user => {
        commit('setLoading', false)
        firebase.firestore().collection('users').doc(user.user.uid).get()
          .then(user => {
            user = user.data()
            commit('setUser', user)
          })
      })
      .catch(error => {
        commit('setLoading', false)
        commit('setError', error)
        console.log(error)
      })
  },

```
Etter at denne metoden har kjørt, ser vi at den har kalt på commit flere ganger. Commit er metoder i storen som er sync og som endrer staten (mutations):
**store/index.js:**
```JavaScript
  // Setter brukeren og om han er admin og/eller employee
  setUser (state, payload) {
    state.user = payload
    state.admin = payload.admin
    state.employee = payload.employee
    state.customer = payload.customer
  },

```
Denne oppdaterer staten som blir initalisert når storen bygges:
**store/index.js:**
```JavaScript
export const state = () => ({
  admin: false, // Sier om brukeren er admin eller ikke
  customer: false, // Sier ifra om brukeren er kunde eller ikke
  employee: false, // Sier om brukeren er ansatt eller ikke
  error: null, // Holder feilmeldingen vår
  loading: false, // Brukes ved logg inn i det vi begynner autentiseringen
  user: null // Holder brukeren
})

```

Disse attributtene kan vi så bruke ved hjelp av getters.

**pages/login.vue:**
```JavaScript
// Henter vaiabler fra storen
  computed: {
    user () {
      return this.$store.getters.user
    },
    error () {
      return this.$store.getters.error
    },
    loading () {
      return this.$store.getters.loading
    }
  },
```





## Database
Databasen som blir brukt er Googles Firestore. Dette er en rask NoSQL database. Les mer om databasen vår [her](https://gitlab.stud.idi.ntnu.no/programvareutvikling-v19/gruppe-30/wikis/about/firestore)
Spørringer mot databasen krever ikke inlogging hvis man kjører programmet lokalt, da access tokens settes opp når prosjektet initaliseres.
Ønsker man å administrere databasen via UI kreves en google bruker. Send mail til jespergp@stud.ntnu.no, så fikses tilgang :rocket:
UI kan så aksesseres via https://console.firebase.google.com/u/0/project/pu30-5b0f9/overview


## Tech/Rammeverk brukt:

### Bygd med:
* [JavaScript ES6](http://ecma-international.org/publications/standards/Ecma-006.htm)
* [Vue](https://vuejs.org)
* [Vuetify](https://vuetifyjs.com/en/getting-started/why-vuetify)
* [NPM](https://www.npmjs.com/)
* [Firestore](https://firebase.google.com/docs/firestore/)
* [Node](https://nodejs.org/en/)
* [Nuxt](https://nuxtjs.org/)
* [Cloud functions](https://cloud.google.com/functions/)
* [ChartJS](https://www.chartjs.org/)
* [Nodemailer](https://nodemailer.com/about/)
* [Jest](https://jestjs.io/)

## Features:
* Moderne nettside
* Kunde kan legge inn, endre og slette reservasjoner
* Kunder kan opprette brukere
* Admin kan administrere oppsettet for restauranten
* Ansatte kan enkelt opprette, endre, slette og se reservasjoner, samt statusen til restauranten til enhver tid
* Sjef kan se statistikk over besøkende for å se hvilke måneder, dager og tidspunkt som er mest attraktive og tilpasse driften etter dette

## Tester:
Vi benytter oss av Jest for rammeverk av testing.
For å kjøre testene kreves følgende (Hopp til steg 3 hvis du har kjørt npm install):
1. `$ npm install -g jest`
2. `$ npm install -g vue-jest`
3. `$ npm test -- 'tests'`

Du får så tilbakemelding i konsollen om testene fungerte eller ei.
Nye tester kan enkelt legges til under test-mappen.

Eks på test:
```JavaScript
test('Updates table when setTable is called with table', () => {
  const store = new Vuex.Store(cloneDeep(Store))
  const testTable = {
    tableID: 1,
    capacity: 2,
    currently: 3,
    occupied: true
  }
  expect(store.getters.tables.length).toBe(0)
  store.commit('setTable', testTable)
  expect(store.state.tables[0]).toBe(testTable)
})
```

## Gitflow
#### Feature
Vi benytter oss av Gitflow som workflow. Alle nye features lages i en feature branch fra develop, som merges tilbake til develop når den er ferdig. Når vi har nok features lager vi en release branch
som går igjennom testing, før denne merges inn i master og tilbake til develop.

#### Hotfix
Hvis vi fikser bugs lages disse i hotfix branches ut fra hvilken branch man fikser, og merges tilbake til den respektive branchen. Unntak er hvis det er feil i master branchen, da må hotfixen merges inn i både master
og develop. 


## Versjoner:
Les mer om versjonene [her](CHANGELOG.md)

Laget med :heart: av Jesper Paulsen, Maria Brenna, Mathilde Tillman Hegdal, Olav Falck-Pedersen, Una Førde Schjetne og Wictor Zhao