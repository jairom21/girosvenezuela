<template>
  <v-card class="_card pa-6 pb-4 b-shadow">
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">CONFIRMACION DE LA ORDEN</span>
    </div>

    <div class="_box">
      <div class="overline mb-1">
        remitente
      </div>
      <div class="body-2">
        <v-row>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Nombre:</strong>
            <span v-if="remitente" class="text-capitalize"> {{ `${remitente.name} ${remitente.nameSecond ? remitente.nameSecond : ''} ${remitente.surname} ${remitente.surnameSecond ? remitente.surnameSecond : ''}` }} </span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Identificacion:</strong>
            <span v-if="remitente"> {{ `${$getId(remitente.tid)}${remitente.id}` }} </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <strong>Telefono:</strong>
            <span v-if="remitente"> {{ remitente.phone }} </span>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="_box">
      <div class="overline mb-1">
        destinatario
      </div>
      <div class="body-2">
        <v-row>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Nombre:</strong>
            <span v-if="destinatario" class="text-capitalize"> {{ destinatario.name }} </span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Identificacion:</strong>
            <span v-if="destinatario"> {{ `${$getId(destinatario.tid)}${destinatario.id}` }} </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Banco: </strong>
            <span v-if="destinatario" class="text-capitalize"> {{ destinatario.bank }} </span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Cuenta: </strong>
            <span v-if="destinatario"> {{ destinatario.account }} </span>
          </v-col>
        </v-row>
      </div>
    </div>
    <div class="_box">
      <div class="overline mb-1">
        monto
      </div>
      <div class="body-2">
        <v-row>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Envia: </strong> <span v-if="amount"> {{ Number(amount.pesos).format(0, 3, '.') }} $</span>
          </v-col>
          <v-col cols="12" lg="6" class="py-0 pb-1">
            <strong>Recibe:</strong>  <span v-if="amount"> {{ Number(amount.bs).format(0, 3, '.') }}  Bs</span>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <strong>Tasa: </strong> <span v-if="amount"> {{ amount.tasa }} </span>
          </v-col>
        </v-row>
      </div>
    </div>
    <div>
      <v-checkbox
        v-model="aproved"
        :disabled="disabled"
        label="Todos los datos estan correctos"
        @change="checkboxAction($event)"
      />
      <v-btn
        :disabled="send"
        block
        color="primary"
        depressed
        @click="setOrderOnDatabase"
      >
        enviar orden
      </v-btn>
    </div>
  </v-card>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data () {
    return {
      remitente: null,
      destinatario: null,
      amount: null,
      disabled: true,
      aproved: false,
      send: true
    }
  },
  computed: {
    ...mapState('user', ['uid'])
  },
  mounted () {
    this.$nuxt.$on('REMITENTE_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.remitente = d
        return
      }
      this.remitente = null
      this.destinatario = null
      this.amount = null
      this.disabled = true
      this.aproved = false
    })
    this.$nuxt.$on('DESTINATARIO_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.destinatario = d
        return
      }
      this.destinatario = null
      this.disabled = true
      this.amount = null
      this.send = true
      this.aproved = false
    })
    this.$nuxt.$on('AMOUNT_SET_DETAILS_ORDER', (d) => {
      if (d) {
        this.amount = d
        return
      }
      this.disabled = true
      this.amount = null
      this.send = true
      this.aproved = false
    })
    this.$nuxt.$on('AMOUNT_APPROVE_ORDER', (d) => {
      if (d) {
        this.disabled = false
        return
      }
      this.disabled = true
      this.aproved = false
    })
  },
  methods: {
    ...mapActions('resumeOrder', ['setResumeOrder']),
    async setOrderOnDatabase () {
      this.$nuxt.$emit('LOADING_OPEN')

      this.amount.pesos = Number(this.amount.pesos)
      this.amount.tasa = Number(this.amount.tasa)

      const order = {
        id: this.$generateToken(7),
        timestamp: Number(new Date()),
        status: 'pendiente',
        uid: this.uid,
        payout: {
          img: null,
          timestamp: null,
          payout: null,
          message: null
        },
        amount: this.$parseObject(this.amount),
        remitente: this.$parseObject(this.remitente),
        destinatario: this.$parseObject(this.destinatario)
      }
      try {
        await this.$fireStore.collection('orders').add(order)
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Order Creada Satisfactoriamente',
          color: 'success'
        })
        await this.setResumeOrder(order)
        await this.$router.push('/dashboard/resumen/orden')
        this.$nuxt.$emit('LOADING_CLOSE')
      } catch (e) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'Error al enviar la orden',
          color: 'pink'
        })
        this.$nuxt.$emit('LOADING_CLOSE')
      }
    },
    checkboxAction () {
      if (this.aproved) {
        this.$nuxt.$emit('ORDER_APROVE', 1)
        this.send = false
        return
      }
      this.send = true
      this.$nuxt.$emit('ORDER_APROVE', false)
    }
  }
}
</script>
<style lang="scss" scoped>
._box {
  padding: 15px 10px;
  margin-bottom: 16px;
  border: 1px dashed #B7C5D0;
}
</style>
