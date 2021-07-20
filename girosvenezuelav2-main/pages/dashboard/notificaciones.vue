<template>
  <v-card
    class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
    height="100%"
  >
    <div class="d-flex justify-space-between align-center">
      <span color="black" class="body-1 font-weight-bold p-color">NOTIFICACIONES</span>
    </div>
    <div v-if="!showNotifications || showNotifications.length === 0" class="border mt-6 h-full d-flex align-center justify-center h-min">
      <v-progress-circular v-if="!showNotifications" color="grey" class="my-2" indeterminate size="34" />
      <span v-else class="body-2 text--lighten-1 grey--text text-uppercase my-10">no tienes notificaciones</span>
    </div>

    <!-- notifications -->
    <div v-else class="pb-2 mt-7 h-full">
      <div
        v-for="(e,i) in showNotifications"
        :key="i"
        class="e-panel py-3 c-hover"
      >
        <div class="body-2 px-3">
          <div class="d-flex justify-space-between align-center _resumen">
            <div>
              <div>
                <strong> {{ e.type === 'completada' ? 'Te pagamos una Orden' : 'Cancelamos una orden' }} </strong>
              </div>

              <div>
                <small class="c-chip" :class="{'pink': !e.show, 'green' : e.show}">
                  {{ e.show === true ? 'revisado' : 'no revisado' }}
                </small>
              </div>

              <div class="text-uppercase grey--text">
                <small>{{ $moment(e.timestamp).format('DD.MM.YYYY hh:mm a') }}</small> | <small>Orden ID-{{ e.idOrder.toLocaleUpperCase() }}</small>
              </div>
            </div>
            <div>
              <v-btn
                title="administrar orden pendiente"
                color="transparent"
                depressed
                dark
                small
                fab
                @click="showDetailOrder(e.idOrder, e.show)"
              >
                <v-icon color="primary">
                  mdi-email-mark-as-unread
                </v-icon>
              </v-btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapGetters('notifications', ['showNotifications', 'showOnNotifications']),
    ...mapGetters('orders', ['showOrders'])
  },
  methods: {
    ...mapActions('resumeOrder', ['setResumeOrder']),
    async showDetailOrder (id, show) {
      if (!show) {
        try {
          const doc = await this.$fireStore.collection('notifications').where('idOrder', '==', id).get()
          await this.$fireStore.collection('notifications').doc(doc.docs[0].id).update({
            show: true
          })
        } catch (e) {

        }
      }

      const order = this.showOrders.filter(e => e.id === id)[0]
      this.setResumeOrder(order)
      this.$router.push('/dashboard/resumen/orden')
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
