<template>
  <v-navigation-drawer
    v-model="drawer"
    class="_drawer nd-main d-flex"
    :mini-variant="miniVariant"
    fixed
    app
  >
    <div class="d-flex justify-space-center">
      <img class="_logo mx-auto my-6" src="/3.png" alt="Logo Giros-Venezuela">
    </div>
    <v-list shaped class="flex-auto">
      <v-list-item-group v-model="el" color="white">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon color="white">
              {{ item.icon }}
            </v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title class="white--text" v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item-group />
      </v-list-item-group>
    </v-list>
    <div class="pa-2">
      <v-btn
        color="primary"
        depressed
        block
        @click="exitApp"
      >
        Cerrar sesion
      </v-btn>
    </div>
  </v-navigation-drawer>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  data () {
    return {
      el: 1,
      drawer: true,
      miniVariant: false,
      right: true,
      items: [
        {
          icon: 'mdi-view-dashboard',
          title: 'Inicio',
          to: '/admin'
        },
        {
          icon: 'mdi-telegram',
          title: 'Ordenes',
          to: '/admin/ordenes'
        },
        {
          icon: 'mdi-bank-transfer',
          title: 'Remitentes',
          to: '/admin/remitentes'
        },
        {
          icon: 'mdi-account',
          title: 'Puntos de Ventas',
          to: '/admin/puntos'
        },
        {
          icon: 'mdi-calculator',
          title: 'Calculadora',
          to: '/admin/calculator'
        }
      ]
    }
  },
  mounted () {
    // EVENT FOR CLOSE DRAWER
    this.$nuxt.$on('DRAWER_MAIN_CLOSE', () => {
      this.drawer = !this.drawer
    })
  },
  methods: {
    ...mapActions('user', ['closeSesionAdmin']),
    async exitApp () {
      this.$nuxt.$emit('LOADING_OPEN')
      await this.closeSesionAdmin()
      this.$nuxt.$emit('LOADING_CLOSE')
    }
  }
}
</script>
<style lang="scss" scoped>
.nd-main {
  background: rgb(21,52,98);
  background: linear-gradient(0deg, #01224E 60%, #0B85EB 99%)
}
._logo {
  max-width: 150px;
}
</style>
