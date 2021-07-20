<template>
  <v-app-bar
    color="white"
  >
    <v-app-bar-nav-icon color="black" @click="closeDrawer" />

    <small class="body-2 grey--text font-weight-medium">
      {{ setTime }}
    </small>

    <v-spacer />

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on }">
        <v-btn icon width="auto" height="auto" v-on="on">
          <v-icon size="large" color="black">
            mdi-location-exit
          </v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item
          @click="() => {}"
        >
          <v-list-item-title @click="exitApp">
            Cerrar sesion
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('time', ['showTime']),
    setTime () {
      if (this.showTime) {
        return this.$moment(this.time).tz('America/Bogota').format('LL -  h:mm a')
      } else {
        return null
      }
    }
  },
  methods: {
    ...mapActions('user', ['closeSesion']),
    async exitApp () {
      this.$nuxt.$emit('LOADING_OPEN')
      await this.closeSesion()
      this.$nuxt.$emit('LOADING_CLOSE')
    },
    closeDrawer () {
      this.$nuxt.$emit('DRAWER_MAIN_CLOSE')
    }
  }
}
</script>
