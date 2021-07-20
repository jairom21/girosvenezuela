<template>
  <v-app>
    <!-- LOADING APP -->
    <v-overlay v-model="lapp" z-index="1000" opacity="1" color="blue">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <!-- LOADING -->
    <v-overlay v-model="loading" z-index="1000">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>

    <!-- SNACKBAR -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="3000"
      :color="snackbar.color"
      bottom
      right
    >
      {{ snackbar.text }}
    </v-snackbar>

    <!-- CONTENT -->
    <v-content>
      <NavigationDrawer v-if="showOnlyDashboard()" />
      <NavHeader v-if="showOnlyDashboard()" />
      <AdminNavigationDrawer v-if="showOnlyAdmin()" />
      <AdminNavHeader v-if="showOnlyAdmin()" />
      <v-container class="mt-5">
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>
<script>
import { mapActions } from 'vuex'
import NavigationDrawer from '~/components/NavigationDrawer'
import NavHeader from '~/components/NavHeader'
import AdminNavigationDrawer from '~/components/AdminNavigationDrawer'
import AdminNavHeader from '~/components/AdminNavHeader'
export default {
  name: 'GeneralDefaultTemplate',
  middleware: ['admin', 'user'],
  components: {
    NavigationDrawer, NavHeader, AdminNavigationDrawer, AdminNavHeader
  },
  data: () => ({
    lapp: true,
    loading: false,
    snackbar: {
      show: false,
      text: 'este es el mensaje',
      color: 'primary'
    }
  }),
  mounted () {
    // LOADING
    this.$nuxt.$on('LOADING_OPEN', () => (this.loading = true))
    this.$nuxt.$on('LOADING_CLOSE', () => (this.loading = false))

    // SNACKBAR
    this.$nuxt.$on('SNACKBAR_OPEN', (d) => {
      this.snackbar.show = true
      this.snackbar.color = d.color
      this.snackbar.text = d.text
    })

    // SET TIME
    this.$store.commit('time/SET_TIME', Number(new Date()))
    setInterval(() => {
      if (this.$moment(Number(new Date())).tz('America/Bogota').format('ss') === '00') {
        this.$store.commit('time/SET_TIME', Number(new Date()))
      }
    }, 1000)

    // CLIENT CHECK - TOKEN USER
    if (process.browser) {
      // call taas global
      this.getTasas()

      window.onNuxtReady((app) => {
        const path = this.$route.path

        if (path === '/calculador') {
          this.$router.push({ path: '/calculador' })
          this.lapp = false
          return
        }

        this.$fireAuth.onAuthStateChanged(async (user) => {
          if (!user) {
            if (path.includes('dashboard')) {
              this.$router.push('/login')
            }
            if (path.includes('admin')) {
              this.$router.push('/login')
            }
            this.lapp = false
            return
          }

          const token = await this.$fireAuth.currentUser.getIdTokenResult()
          const uid = token.claims.user_id

          // admin -
          if (token.claims.admin) {
            await this.setAdmin(true)

            this.$router.push({ path: '/admin' })
            this.lapp = false
            return
          }

          // user general
          if (!path.includes('dashboard')) {
            this.$router.push({ path: '/dashboard' })
          }
          this.setUser(uid)
          this.getOrders(uid)
          this.getRemitentes()
          this.getMessage()
          this.getNotifications(uid)
          this.lapp = false
        })
      })
    }
  },
  methods: {
    ...mapActions('tasas', ['getTasas']),
    ...mapActions('user', ['setUser', 'setAdmin']),
    ...mapActions('orders', ['getOrders']),
    ...mapActions('remitentes', ['getRemitentes']),
    ...mapActions('message', ['getMessage']),
    ...mapActions('notifications', ['getNotifications']),
    showOnlyDashboard () {
      if (this.$route.path.includes('dashboard')) {
        return true
      }
      return false
    },
    showOnlyAdmin () {
      if (this.$route.path.includes('admin')) {
        return true
      }
      return false
    }
  }
}
</script>
