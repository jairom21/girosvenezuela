<template>
  <v-card
    class="pa-6 pb-4 b-shadow d-flex flex-column justify-space-between"
    height="100%"
  >
    <div class="d-flex justify-space-between align-center mb-4">
      <span color="black" class="body-1 font-weight-bold p-color">Seleccione el Destinatario</span>
    </div>

    <div v-if="items.length === 0" class="border py-5 px-2 mb-5">
      <p v-if="userSelect" class="text-center body-2 gray--text">
        Seleccione un remitente
      </p>
      <p v-if="zero" class="text-center body-2 gray--text">
        El remitente seleccionado no tiene destinatarios agregados
      </p>
    </div>
    <div v-else>
      <v-autocomplete
        v-model="accountSelect"
        :items="items"
        chips
        clearable
        hide-details
        hide-selected
        item-text="id"
        item-value="account"
        label="Escriba el numero de identidad"
        class="mb-5"
        no-data-text="No hay resultados para la busqueda"
      >
        <template v-slot:no-data>
          <v-list-item>
            <v-list-item-title>
              No hay
              <strong>Destinatarios</strong> con este ID
            </v-list-item-title>
          </v-list-item>
        </template>
        <template v-slot:selection="{ attr, on, item, selected }">
          <v-chip
            v-bind="attr"
            :input-value="selected"
            color="primary"
            class="white--text"
            small
            v-on="on"
          >
            <v-icon left>
              mdi-coin
            </v-icon>
            <span class="text-capitalize" v-text="`${item.name} - ${item.bank} `" />
          </v-chip>
        </template>
        <template v-slot:item="{ item }">
          <v-list-item-avatar
            color="primary"
            class="headline font-weight-light white--text"
          >
            {{ item.name.charAt(0).toLocaleUpperCase() }}
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title class="text-capitalize" v-text="`${item.name}`" />
            <v-list-item-subtitle class="text-capitalize d-flex flex-column">
              <span>
                <strong>Identidad: </strong> {{ item.id }}
              </span>
              <span>
                <strong>Cuenta: </strong> {{ `${item.account} - ${item.bank}` }}
              </span>
              <span>
                <strong>Tipo Cuenta: </strong> {{ item.type }}
              </span>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-coin</v-icon>
          </v-list-item-action>
        </template>
      </v-autocomplete>
    </div>

    <v-dialog v-model="dialog" persistent max-width="500px">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          depressed
          v-bind="attrs"
          :disabled="disableBtn"
          v-on="on"
        >
          agregar nuevo destinatario
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="mb-10 primary text-center">
          <p class="text-center white--text w-full headline">
            Agregar Destinatario
          </p>
        </v-card-title>
        <v-card-text>
          <v-form
            ref="formDestinatario"
            v-model="valid"
            lazy-validation
          >
            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-select
                  v-model="newDestinatario.bank"
                  class="px-1"
                  :items="bancos"
                  label="Banco"
                  :rules="rul.tid"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newDestinatario.name"
                  class="px-1"
                  label="Nombre y Apellidos"
                  :rules="rul.name"
                  outlined
                  dense
                />
              </v-col>
            </div>

            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-select
                  v-model="newDestinatario.tid"
                  class="px-1"
                  :items="identidad"
                  label="Tipo Identidad"
                  :rules="rul.tid"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newDestinatario.id"
                  class="px-1"
                  label="Numero de Identidad"
                  :rules="rul.id"
                  outlined
                  dense
                />
              </v-col>
            </div>
            <div class="d-flex flex-wrap">
              <v-col cols="12" lg="6" class="pa-0">
                <v-text-field
                  v-model="newDestinatario.account"
                  class="px-1"
                  label="Numero de cuenta"
                  type="number"
                  :rules="rul.acc"
                  counter="20"
                  outlined
                  dense
                />
              </v-col>
              <v-col cols="12" lg="6" class="pa-0">
                <v-select
                  v-model="newDestinatario.type"
                  class="px-1"
                  :items="tcuenta"
                  label="Tipo de Cuenta"
                  :rules="rul.tid"
                  outlined
                  dense
                />
              </v-col>
            </div>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="pink" text @click="closeModal">
            cancelar
          </v-btn>
          <v-btn color="primary" text @click="saveNewDestinatario">
            agregar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      remitente: null,
      disabled: true,
      userSelect: true,
      userId: null,
      zero: false,
      accountSelect: null,
      items: [],
      identidad: [
        'Cedula Venezolana',
        'Pasaporte',
        'Extranjero',
        'Juridico'
      ],
      tcuenta: [
        'Ahorros',
        'Corriente'
      ],
      bancos: [
      'BANESCO BANCO UNIVERSAL (0134)',
        'BANCO DE VENEZUELA S.A.I.C.A. (0102)',
        'BANCO MERCANTIL C.A. (0105)',
        'BANCO PROVINCIAL BBVA (0108)',
        'BANCO OCCIDENTAL DE DESCUENTO (0116)',
        'BANCO BICENTENARIO (0175)',
        'BANCO DEL TESORO (0163)',
        'BANCO NACIONAL DE CREDITO (0191)',
        '100%BANCO (0156)',
        'ABN AMRO BANK (0196)',
        'BANCAMIGA BANCO MICROFINANCIERO, C.A. (0172)',
        'BANCO ACTIVO BANCO COMERCIAL, C.A. (0171)',
        'BANCO AGRICOLA (0166)',
        'BANCO CARONI, C.A. BANCO UNIVERSAL (0128)',
        'BANCO DEL CARIBE C.A. (0114)',
        'BANCO ESPIRITO SANTO, S.A. (0176)',
        'BANCO EXTERIOR C.A. (0115)',
        'BANCO INTERNACIONAL DE DESARROLLO, C.A. (0173)',
        'BANCO PLAZA (0138)',
        'BANCO VENEZOLANO DE CREDITO S.A. (0104)',
        'BANCRECER S.A BANCO DE DESARROLLO (0168)',
        'BANFANB (0177)',
        'BANGENTE (0146)',
        'BANPLUS BANCO COMERCIAL C.A. (0174)',
        'CITIBANK. (0190)',
        'CORP BANCA (0121)',
        'DELSUR BANCO UNIVERSAL (0157)',
        'FONDO COMUN (0151)',
        'INSTITUTO MUNICIPAL DE CREDITO POPULAR (0601)',
        'MIBANCO BANCO DE DESARROLLO, C.A (0169)',
        'SOFITASA (0137)',
        'BANCO DE DESARROLLO DEL MICROEMPRESARIO (0164)',
        'BANCO DEL PUEBLO SOBERANO C.A. (0149)',
        'BANCO INDUSTRIAL DE VENEZUELA (0003)'
      ],
      dialog: false,
      valid: false,
      rul: {
        tid: [
          v => !!v || 'Este campo es requerido'
        ],
        id: [
          v => !!v || 'El numero es requerido',
          v => (v && v.length > 5) || 'El numero es muy corto'
        ],
        name: [
          v => !!v || 'El nombre es requerido',
          v => (v && v.length <= 50) || 'El nombre es muy largo',
          v => (v && v.length > 5) || 'El nombre es muy corto'
        ],
        acc: [
          v => !!v || 'La cuenta es requerida',
          v => (v && v.length === 20) || 'Son 20 numeros exactos'
        ]
      },
      newDestinatario: {
        timestamp: null,
        name: null,
        bank: null,
        tid: null,
        id: null,
        account: null,
        type: null
      }
    }
  },
  computed: {
    ...mapGetters('remitentes', ['showRemitentes']),
    disableBtn () {
      if (this.userSelect || this.accountSelect) {
        return true
      }
      return false
    }
  },
  watch: {
    accountSelect (val) {
      if (val) {
        const account = this.items.filter(e => e.account === this.accountSelect)[0]
        this.$nuxt.$emit('DESTINATARIO_SET_DETAILS_ORDER', account)
        this.$nuxt.$emit('DESTINATARIO_SET_TO_CALC', true)
        return
      }
      this.$nuxt.$emit('DESTINATARIO_SET_DETAILS_ORDER', null)
      this.$nuxt.$emit('DESTINATARIO_SET_TO_CALC', null)
    }
  },
  mounted () {
    this.$nuxt.$on('REPORT_SET_LIST_ACCOUNTS', (remitente) => {
      if (remitente) {
        this.remitente = remitente
        this.zero = null
        this.userId = remitente.id
        this.disabled = false
        this.userSelect = null
        if (remitente.destinatarios.length > 0) {
          this.zero = null
          this.items = remitente.destinatarios
          return
        } else {
          this.accountSelect = null
          this.userId = remitente.id
          this.items = []
          this.zero = true
        }
        return
      }
      this.remitente = null
      this.accountSelect = null
      this.zero = null
      this.userSelect = true
      this.userId = null
      this.disabled = true
      this.items = []
    })
  },
  methods: {
    async saveNewDestinatario () {
      if (this.$refs.formDestinatario.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        this.newDestinatario.timestamp = Number(new Date())
        const newDestinatario = { ...this.newDestinatario }

        const send = this.$parseObject(this.showRemitentes.filter(e => e.id === this.userId)[0].destinatarios)
        send.push(newDestinatario)

        try {
          const id = await this.$fireStore.collection('remitentes').where('id', '==', this.userId).get()

          await this.$fireStore.collection('remitentes').doc(id.docs[0].id).set({
            destinatarios: send
          }, { merge: true })

          this.items = this.showRemitentes.filter(e => e.id === this.userId)[0].destinatarios

          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Destinatario creado satisfactoriamente',
            color: 'success'
          })
          this.$formatObject(this.newDestinatario)
          this.closeModal()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al crear el destinatario',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    closeModal () {
      this.dialog = false
      this.$refs.formDestinatario.resetValidation()
    }
  }
}
</script>
