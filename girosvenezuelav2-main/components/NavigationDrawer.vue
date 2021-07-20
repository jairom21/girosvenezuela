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
          <v-list-item-action v-if="item.title === 'Notificaciones' && notiPending">
            <v-chip v-if="notiPending > 0" small color="pink" dark>
              {{ notiPending }}
            </v-chip>
          </v-list-item-action>
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
import { mapActions, mapGetters } from 'vuex'
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
          to: '/dashboard'
        },
        {
          icon: 'mdi-telegram',
          title: 'Reportar Pago',
          to: '/dashboard/reportar'
        },
        {
          icon: 'mdi-bank-transfer',
          title: 'Movimientos',
          to: '/dashboard/movimientos'
        },
        {
          icon: 'mdi-account',
          title: 'Cuenta',
          to: '/dashboard/cuenta'
        },
        {
          icon: 'mdi-bell',
          title: 'Notificaciones',
          to: '/dashboard/notificaciones'
        }
      ]
    }
  },
  computed: {
    ...mapGetters('notifications', ['showNotifications', 'showOnNotifications']),
    notiPending () {
      if (this.showNotifications) {
        return this.showNotifications.filter(e => !e.show).length
      }
      return null
    }
  },
  mounted () {
    // EVENT FOR CLOSE DRAWER
    this.$nuxt.$on('DRAWER_MAIN_CLOSE', () => {
      this.drawer = !this.drawer
    })
  },
  methods: {
    ...mapActions('user', ['closeSesion']),
    async exitApp () {
      this.$nuxt.$emit('LOADING_OPEN')
      await this.closeSesion()
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
