<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
      <v-card v-if="order">
        <v-toolbar dark color="purple">
          <v-toolbar-title> {{ resume ? 'Administrar la' : 'Detalles de la' }}  orden <span class="text-uppercase"> {{ order.id }} </span> </v-toolbar-title>
          <v-spacer />
          <v-toolbar-items>
            <v-btn icon dark @click="dialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-container class="mt-7">
          <!-- montos -->
          <div class="d-flex flex-column align-center justify-center">
            <span class="grey--text mb-2">Montos de la Orden</span>
            <h1 class="h6">
              {{ Number(order.amount.bs).format(0, 3, '.') }} Bs
            </h1>
            <p>
              <span class="primary--text">{{ order.amount.pesos.format(0, 3, '.') }} $</span>
              <span class="font-weight-medium mx-2">|</span>
              <span class="font-weight-medium green--text">{{ order.amount.tasa }}</span>
            </p>
          </div>

          <!-- punto de venta -->
          <div class="_section mt-5 b-shadow  purple white--text">
            <div class="overline">
              Punto de Venta
            </div>
            <div class="d-flex flex-column mt-3 text-capitalize">
              <span>
                {{ findUserPoint(order.uid).company }}
              </span>
              <p>
                <span>{{ findUserPoint(order.uid).address }}</span>
              </p>
            </div>
          </div>

          <!-- remitente -->
          <div class="_section _top b-shadow  primary white--text">
            <div class="overline">
              Remitente
            </div>
            <div class="d-flex flex-column mt-3 text-capitalize">
              <span>
                {{ `${order.remitente.name} ${order.remitente.nameSecond ? order.remitente.nameSecond : ''} ${order.remitente.surname} ${order.remitente.surnameSecond ? order.remitente.surnameSecond : ''}` }}
              </span>
              <p>
                <span>{{ `${$getId(order.remitente.tid)}${order.remitente.id}` }}</span>
                <span class="mx-2">|</span>
                <span>{{ order.remitente.phone }}</span>
              </p>
            </div>
          </div>

          <!-- destinatario -->
          <div class="_section _top b-shadow  blue white--text">
            <div class="overline">
              destinatario
            </div>
            <div class="d-flex flex-column mt-3 text-capitalize">
              <span>
                {{ order.destinatario.name }}
              </span>
              <p>
                <span>{{ `${$getId(order.destinatario.tid)}${order.destinatario.id}` }}</span>
                <span class="mx-2">|</span>
                <span>{{ order.destinatario.bank }}</span>
              </p>
              <p>
                <span> {{ order.destinatario.account }} </span>
              </p>
            </div>
          </div>

          <!-- acciones -->
          <div class="_section border-r _top white b-shadow black--text">
            <div class="overline">
              {{ resume ? 'acciones' : 'detalles' }}
            </div>

            <div v-if="resume">
              <div class="d-flex flex-column flex-lg-row justify-lg-space-between mt-5 text-capitalize">
                <v-btn depressed color="pink" class="white--text" @click="controlCancel">
                  cancelar orden
                </v-btn>
                <v-btn
                  :disabled="control.img"
                  depressed
                  color="green"
                  class="mt-3 mt-lg-0 white--text"
                  @click="controlImg"
                >
                  subir imagen de pago
                </v-btn>
                <v-btn :disabled="capture.length === 0" depressed color="green" class="mt-3 mt-lg-0 white--text" @click="orderAddNew">
                  pagar orden
                </v-btn>
              </div>

              <!-- controlador de acciones -->

              <div class="mt-5">
                <!-- file input -->
                <div v-if="control.img">
                  <v-file-input
                    ref="capture"
                    v-model="capture"
                    accept="image/*"
                    color="primary"
                    counter
                    label="Capture de pago"
                    multiple
                    placeholder="Seleccione la imagen"
                    prepend-icon="mdi-paperclip"
                    outlined
                    dense
                    :show-size="1000"
                  >
                    <template v-slot:selection="{ index, text }">
                      <v-chip
                        v-if="index < 2"
                        color="primary"
                        dark
                        label
                        small
                      >
                        {{ text }}
                      </v-chip>

                      <span
                        v-else-if="index === 2"
                        class="overline grey--text text--darken-3 mx-2"
                      >
                        +{{ files.length - 2 }} File(s)
                      </span>
                    </template>
                  </v-file-input>
                </div>

                <!-- cancel order -->
                <div v-if="control.cancel">
                  <v-textarea
                    ref="capture"
                    v-model="cancelMessage"
                    outlined
                    color="pink"
                    name="input-7-4"
                    label="Motivo"
                    placeholder="Escriba todos los motivos posibles por lo que cancela la orden"
                  />
                  <v-btn :disabled="cancelMessage.length < 5" color="pink" class="white--text" block @click="orderCancel">
                    si, cancelar orden
                  </v-btn>
                </div>
              </div>
            </div>

            <div v-else>
              <div class="d-flex flex-column mt-3">
                <span>
                  <strong class="mr-1">Fecha: </strong> {{ $moment(order.timestamp).format('DD-MM-YYYY hh:mm a') }}
                </span>
                <span>
                  <strong class="mr-1">Estado: </strong> <span class="text-capitalize">{{ order.status }}</span>
                </span>
                <span v-if="order.status !== 'cancelada'">
                  <strong class="mr-1">Porcentaje: </strong> {{ `${calcPercentage(order)}` }}
                </span>
                <p v-if="order.status !== 'pendiente'">
                  <strong class="pr-1">Definición de la orden: </strong>
                  <span class="text-capitalize"> {{ $moment(order.payout.timestamp).format('DD-MM-YYYY hh:mm a') }} </span>
                </p>
                <span v-if="order.status === 'cancelada'">
                  <strong class="mr-1">Motivo cancelacion: </strong> {{ order.payout.message }}
                </span>
                <v-btn
                  v-if="order.status === 'completada'"
                  class="mt-5"
                  :href="order.payout.img"
                  target="_blank"
                  color="#00E676"
                  dark
                  depressed
                >
                  ver capture del pago
                </v-btn>
              </div>
            </div>
          </div>
        </v-container>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      dialog: false,
      resume: null,
      order: null,
      control: {
        img: false,
        cancel: false
      },
      capture: [],
      cancelMessage: ''
    }
  },
  computed: {
    ...mapGetters('adminUsers', ['showUsers'])
  },
  mounted () {
    this.$nuxt.$on('ADMIN_ORDER_OPEN', (order, resume) => {
      this.resume = resume
      this.order = order
      this.dialog = true
      // resets
      this.control.img = false
      this.control.cancel = false
      this.capture = []
      this.cancelMessage = ''
    })
  },
  methods: {
    // dabatase actions
    orderAddNew () {
      this.$nuxt.$emit('LOADING_OPEN')
      const upload = this.$fireStorage.ref('payments').child(`${+new Date()}`).put(this.capture[0])
      upload.on('state_changed', (snapshot) => {

      },
      (e) => {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al cargar la imagen',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      },
      async () => {
        const url = await upload.snapshot.ref.getDownloadURL()
        const email = this.findUserPoint(this.order.uid).email
        try {
          const id = await this.$fireStore
            .collection('orders')
            .where('uid', '==', this.order.uid)
            .where('id', '==', this.order.id)
            .get()

          this.$fireStore.collection('orders').doc(id.docs[0].id).update({
            status: 'completada',
            'payout.payout': true,
            'payout.img': url,
            'payout.timestamp': Number(new Date())
          })
          await this.setNotification(true)
          await this.sendEmail(email, url)
          this.dialog = false
          this.$nuxt.$emit('LOADING_CLOSE')
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'La orden se marco pagada correctamente',
            color: 'success'
          })
        } catch (e) {
          this.$nuxt.$emit('LOADING_CLOSE')
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al marcar la orden como pagada',
            color: 'success'
          })
        }
      })
    },
    async orderCancel () {
      this.$nuxt.$emit('LOADING_OPEN')
      try {
        const id = await this.$fireStore
          .collection('orders')
          .where('uid', '==', this.order.uid)
          .where('id', '==', this.order.id)
          .get()

        this.$fireStore.collection('orders').doc(id.docs[0].id).update({
          status: 'cancelada',
          'payout.timestamp': Number(new Date()),
          'payout.message': this.cancelMessage
        })
        await this.setNotification()
        this.dialog = false
        this.$nuxt.$emit('LOADING_CLOSE')
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Orden cancelada correctamente',
          color: 'success'
        })
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al intentar cancelar la orden',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    async setNotification (type) {
      try {
        await this.$fireStore.collection('notifications').add({
          uid: this.order.uid,
          show: false,
          timestamp: Number(new Date()),
          type: type ? 'completada' : 'cancelada',
          idOrder: this.order.id
        })
      } catch (e) {
        if (type) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Se pago la orden, pero hubo un error al intentar enviar la notificacion',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
          return
        }
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Se cancelo la orden, pero hubo un error al intentar enviar la notificacion',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    async sendEmail (email, url) {
      try {
        await axios.post('https://us-central1-giros-venezuela-9d086.cloudfunctions.net/sendemail', {
          to: email,
          subject: '🥳 Pagamos una de tus ordenes',
          html: `
                  <h1>Acabamos e pagar una de tus ordenes</h1>
                  <p>Tu orden con el ID ${this.order.id.toLocaleUpperCase()}</p>

                  <a href="${url}">Ver capture el pago! 📷</a>
                  `
        })
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Se pago la orden, pero no se envio el email de notificacion',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    // general
    findUserPoint (uid) {
      if (this.showUsers) {
        return this.showUsers.filter(user => user.uid === uid)[0]
      }
      return ''
    },
    calcPercentage (order) {
      const a = ((order.amount.pesos * this.findUserPoint(order.uid).percentage) / 100).format(0, 3, '.')
      return `${a}$ (${this.findUserPoint(order.uid).percentage}%)`
    },
    controlImg () {
      if (!this.control.img) {
        this.control.img = true
        this.control.cancel = false
        return
      }
      this.control.img = false
      this.control.cancel = false
    },
    controlCancel () {
      if (!this.control.cancel) {
        this.control.cancel = true
        this.control.img = false
        return
      }
      this.control.cancel = false
      this.control.img = false
    }
  }
}
</script>
<style lang="scss" scoped>
._section {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  border-radius: 12px 12px 0 0;
  padding: 10px 25px;
  padding-bottom: 40px;
}
._top {
  margin-top: -25px;
}
.c-vertical {
  top: 50%;
  transform: translateY(-50%);
}
.border-r {
  border-radius: 12px !important;
  padding-bottom: 20px;
}
</style>
