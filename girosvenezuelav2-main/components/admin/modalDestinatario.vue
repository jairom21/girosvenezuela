<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <v-card>
      <v-card-title class="mb-10 primary text-center">
        <p class="text-center white--text w-full headline">
          {{ title }}
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
                v-model="n.bank"
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
                v-model="n.name"
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
                v-model="n.tid"
                class="px-1"
                :items="identidad"
                label="Documento"
                :rules="rul.tid"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="n.id"
                type="number"
                class="px-1"
                label="Documento"
                :rules="rul.id"
                outlined
                dense
              />
            </v-col>
          </div>
          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="n.account"
                class="px-1"
                label="Numero de cuenta"
                type="number"
                :rules="rul.acc"
                counter="20"
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
        <v-btn color="primary" text @click="saveDestinatario">
          agregar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false,
    valid: false,
    title: null,
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
    edit: null,
    n: {
      timestamp: null,
      name: null,
      bank: null,
      tid: null,
      id: null,
      account: null,
      type: null
    }
  }),
  mounted () {
    this.$nuxt.$on('MODAL_DESTINATARIO_OPEN', (t) => {
      this.$formatObject(this.n)
      if (!t) {
        this.title = 'AGREGAR DESTINATARIO'
        this.dialog = true
        this.edit = false
        return
      }
      this.dialog = true
      this.edit = true

      // ->
      this.title = 'EDITAR DESTINATARIO'
      const n = this.n
      n.timestamp = t.timestamp
      n.name = t.name
      n.bank = t.bank
      n.tid = t.tid
      n.id = t.id
      n.account = t.account
      n.type = t.type
    })
  },
  methods: {
    saveDestinatario () {
      if (this.$refs.formDestinatario.validate()) {
        if (!this.edit) {
          this.n.timestamp = Number(new Date())
          this.$nuxt.$emit('MODAL_DESTINATARIO_RETUN_ACCOUNT', {
            edit: false,
            account: this.$parseObject(this.n)
          })
          this.$formatObject(this.n)
          this.dialog = false
          return
        }
        this.$nuxt.$emit('MODAL_DESTINATARIO_RETUN_ACCOUNT', {
          edit: true,
          account: this.$parseObject(this.n)
        })
        this.$formatObject(this.n)
        this.dialog = false
      }
    },
    closeModal () {
      this.dialog = false
      this.$refs.formDestinatario.resetValidation()
    }
  }
}
</script>
