<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <img
      src="logo-long.png"
      height="200px"
      contain
      style="margin-bottom:50px"
    >
    <v-flex
      xs12
      sm5
      md5
    >
      <!-- Kommentar -->
      <div class="loginbox">
        <v-card-text>
          <v-form>
            <v-text-field
              id="username"
              class="roundedCorners"
              prepend-inner-icon="person"
              name="login"
              label="Brukernavn"
              type="text"
            />
            <v-text-field
              id="password"
              class="roundedCorners"
              prepend-inner-icon="lock"
              name="password"
              label="Passord"
              type="password"
            />
          </v-form>
        </v-card-text>
        <div class="text-xs-center">
          <v-btn
            large
            color="#6BE096"
            class="roundedCorners"
          >
            Logg inn
          </v-btn>
        </div>
      </div>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {
  }
}
</script>

<style scoped>
  .loginbox{
    height:300px;
    width: 450px;
    padding:30px;
    background-color: #f5f5f5;
    border-radius: 0px 36px 0px 36px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  }
  .roundedCorners {
    border-radius: 0px 18px 0px 18px;
  }
</style>
