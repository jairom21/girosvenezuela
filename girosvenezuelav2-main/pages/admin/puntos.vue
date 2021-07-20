<template>
  <v-card class="pa-6 b-shadow">
    <div class="d-flex flex-column flex-lg-row justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">PUNTOS DE VENTA</span>
      <v-btn small color="primary" depressed @click="adminPuntoVenta(null)">
        agregar punto de venta
      </v-btn>
    </div>

    <div v-if="!showUsers || showUsers.length === 0" class="border mt-6 h-full d-flex align-center justify-center py-10">
      <v-progress-circular v-if="!showUsers" color="grey" class="my-2" indeterminate size="34" />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase">no tienes ordenes pendientes</span>
    </div>

    <!-- users -->
    <div v-else class="pb-2 mt-7 h-full">
      <div
        v-for="(e,i) in showUsers.filter(e => e.active)"
        :key="i"
        class="e-panel py-3 c-hover"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong class="text-capitalize">{{ e.company }}</strong>
              </div>

              <div>
                <small class="c-chip purple">{{ `${$getId(e.tid)}${e.id}` }}</small>
                <small class="text-capitalize grey--text"> {{ e.name }} </small>
              </div>

              <div class="text-capitalize grey--text">
                <small> {{ e.city }} </small>
                |
                <small>usuario desde {{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm A') }}</small>
              </div>
            </div>
            <div>
              <v-btn
                title="eliminar punto de venta"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="openDeletePuntoVenta(e.uid)"
              >
                <v-icon color="pink">
                  mdi-account-cancel
                </v-icon>
              </v-btn>
              <v-btn
                title="ver punto de venta"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="adminPuntoVenta(e)"
              >
                <v-icon color="primary">
                  mdi-account
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modalPuntoVenta />
    <v-dialog v-model="dialogDelete" persistent max-width="400px">
      <v-card>
        <v-card-title class="mb-10 primary text-center">
          <p class="text-center white--text w-full headline">
            ELIMINAR PUNTO DE VENTA
          </p>
        </v-card-title>
        <v-card-text>
          Seguro que desea eliminar este punto de venta? No podras deshacer esta accion.
        </v-card-text>
        <v-card-actions class="d-flex justify-end">
          <v-btn color="pink" text @click="dialogDelete = false">
            cancelar
          </v-btn>
          <v-btn color="primary" text @click="confirmDeletePuntoVenta()">
            si, eliminar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import modalPuntoVenta from '~/components/admin/modalPuntoVenta'
export default {
  components: {
    modalPuntoVenta
  },
  data: () => ({
    dialogDelete: false,
    uidDelete: null
  }),
  computed: {
    ...mapGetters('adminUsers', ['showUsers'])
  },
  methods: {
    adminPuntoVenta (punto) {
      return this.$nuxt.$emit('MODAL_PUNTO_OPEN', punto)
    },
    openDeletePuntoVenta (uid) {
      this.uidDelete = uid
      this.dialogDelete = true
    },
    confirmDeletePuntoVenta () {
      this.deletePuntoVenta()
    },
    async deletePuntoVenta () {
      this.$nuxt.$emit('LOADING_OPEN')
      try {
        await axios.post('https://us-central1-giros-venezuela-9d086.cloudfunctions.net/deleteUser', { uid: this.uidDelete })
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Punto de Venta Eliminado',
          color: 'success'
        })
        this.dialogDelete = false
        this.$nuxt.$emit('LOADING_CLOSE')
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al eliminar el Punto de Venta',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.e-panel {
  border-bottom: 1px solid rgba($color: #000000, $alpha: 0.1);
}
._resumen {
  width: 100%;
}
._resumen .col {
  padding-left: 5px;
  padding-right: 5px;
  padding: 4px 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.c-chip {
  border-radius: 7px;
  padding: 0 14px;
  color: #fff;
  font-size: 9px;
}
</style>
