<template>
  <v-card with="120px">
    <v-card-title>
      Hello
    </v-card-title>
    <v-card-text>
      <h4 style="text-align: center">
        Endre ikon og farge
        <v-icon
          :color="iconColor"
        >
          {{ icon }}
        </v-icon>
      </h4>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click="iconColor === 'secondary'? iconColor = 'primary' : iconColor = 'secondary'"
      >
        Endre farge
      </v-btn>
      <v-btn
        @click="changeIcon"
      >
        Endre ikon
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: 'Jesper-v-card',
  props: ['parentsIcon'],
  data () {
    return {
      icon: 'parentsIcon',
      iconColor: 'primary'
    }
  },
  methods: {
    changeIcon () {
      if (this.icon === 'local_pizza') {
        this.icon = 'local_dining'
      }
      else this.icon = 'local_pizza'
    }
  },
  watch: {
    iconColor (val) {
      console.log(val)
      this.$emit('colorChange', val)
    }
  }
}
</script>

<style scoped>

</style>
