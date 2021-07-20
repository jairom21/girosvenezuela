<template>
  <v-dialog v-model="dialog" persistent max-width="500px">
    <div class="primary white--text text-center py-6 body-1">
      <span>{{ title }}</span>
    </div>
    <v-tabs
      v-model="tab"
      background-color="grey"
      centered
      dark
      icons-and-text
    >
      <v-tabs-slider />

      <v-tab href="#tab-1">
        Remitente
        <v-icon>mdi-account</v-icon>
      </v-tab>

      <v-tab href="#tab-2">
        Cuentas
        <v-icon>mdi-send</v-icon>
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
      <!-- DATA REMITENTE -->
      <v-tab-item
        value="tab-1"
        class="pt-6 px-3"
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-select
                v-model="r.tid"
                :items="identidad"
                :rules="rul.tid"
                class="px-1"
                label="Documento"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.id"
                :rules="rul.id"
                type="number"
                class="px-1"
                label="Numero de Documento"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.name"
                :rules="rul.name"
                class="px-1"
                label="Nombre"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.nameSecond"
                class="px-1"
                label="Segundo Nombre"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.surname"
                :rules="rul.surname"
                class="px-1"
                label="Apellido"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.surnameSecond"
                class="px-1"
                label="Segundo Apellido"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.phone"
                type="number"
                class="px-1"
                label="Celular"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.email"
                class="px-1"
                label="Email"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.city"
                class="px-1"
                label="Ciudad"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="r.address"
                class="px-1"
                label="Direccion"
                outlined
                dense
              />
            </v-col>
          </div>
        </v-form>
      </v-tab-item>

      <!-- CUENTAS -->
      <v-tab-item value="tab-2" class="pt-6 px-3">
        <div v-if="r.destinatarios.length === 0" class="border py-6 text-center">
          <span class="grey--text body-2">NO TIENE CUENTAS ASOCIADA</span>
        </div>
        <div v-else>
          <div v-for="(z, i) in r.destinatarios" :key="i" class="text-capitalize border pa-3 body-2 mt-2" style="position: relative">
            <p>
              <strong class="mr-1">nombre: </strong> <span> {{ z.name }} </span>
            </p>
            <p>
              <strong class="mr-1">Identidad: </strong> <span> {{ `${$getId(z.tid) + z.id}` }} </span>
            </p>
            <p>
              <strong class="mr-1">Banco: </strong> <span> {{ z.bank }} </span>
            </p>
            <p>
              <strong class="mr-1">Cuenta: </strong> <span> {{ z.account }} </span>
            </p>
            <v-btn
              color="pink"
              depressed
              dark
              small
              absolute
              top
              right
              @click="addDestinatario(z)"
            >
              editar
            </v-btn>
          </div>
        </div>

        <div class="py-6">
          <v-btn color="green" block dark depressed @click="addDestinatario(false)">
            agregar cuenta
          </v-btn>
        </div>
      </v-tab-item>
    </v-tabs-items>

    <v-spacer />
    <div v-if="tab !== 'tab-2'" class="d-flex justify-center justify-lg-end white  py-3">
      <v-btn color="pink" text @click="closeModal">
        cancelar
      </v-btn>
      <v-btn v-if="edit" color="primary" text @click="updateRemitente">
        editar remitente
      </v-btn>
      <v-btn v-else color="primary" text @click="addNewRemitente">
        agregar remitente
      </v-btn>
    </div>
    <ModalDestinatario />
  </v-dialog>
</template>
<script>
import ModalDestinatario from '~/components/admin/modalDestinatario'
export default {
  components: {
    ModalDestinatario
  },
  data: () => ({
    dialog: false,
    valid: false,
    title: null,
    tab: null,
    edit: false,
    identidad: [
      'Cedula Colombiana',
      'Cedula Venezolana',
      'Pasaporte'
    ],
    rul: {
      tid: [
        v => !!v || 'El documento es requerido'
      ],
      id: [
        v => !!v || 'El numero es requerido',
        v => (v && v.length > 5) || 'El numero es muy corto'
      ],
      name: [
        v => !!v || 'El nombre es requerido',
        v => (v && v.length <= 12) || 'El nombre es muy largo'
      ],
      surname: [
        v => !!v || 'El apellido es requerido',
        v => (v && v.length <= 12) || 'El apellido es muy largo'
      ],
      phone: [
        v => !!v || 'El telefono es requerido.',
        v => (v && v.length > 5) || 'El celular es muy corto'
      ]
      // email: [
      //   v => !!v || 'El email es requerido',
      //   v => /.+@.+\..+/.test(v) || 'Escriba un email valido'
      // ]
    },
    r: {
      address: null,
      city: null,
      destinatarios: [],
      email: null,
      id: null,
      name: null,
      nameSecond: null,
      phone: null,
      surname: null,
      surnameSecond: null,
      tid: null,
      timestamp: null
    }
  }),
  mounted () {
    this.$nuxt.$on('MODAL_REMITENTE_OPEN', (remitente) => {
      this.dialog = true

      if (!remitente) {
        this.title = 'AGREGAR NUEVO REMITENTE'
        this.edit = false
        this.$formatObject(this.r)
        this.r.destinatarios = []
        return
      }
      this.title = 'EDITAR REMITENTE'
      this.edit = true

      // ->
      const a = remitente
      const r = this.r

      r.address = a.address
      r.city = a.city
      r.destinatarios = a.destinatarios
      r.email = a.email
      r.id = a.id
      r.name = a.name
      r.nameSecond = a.nameSecond
      r.phone = a.phone
      r.surname = a.surname
      r.surnameSecond = a.surnameSecond
      r.tid = a.tid
      r.timestamp = a.timestamp
    })
    this.$nuxt.$on('MODAL_DESTINATARIO_RETUN_ACCOUNT', (d) => {
      const _a = [...this.r.destinatarios]

      if (d.edit) {
        _a.forEach((e, i) => {
          if (e.timestamp === d.account.timestamp) {
            _a[i] = d.account
          }
        })
        this.r.destinatarios = _a
        return
      }
      const exist = _a.filter(e => e.account === d.account.account)

      if (exist.length > 0) {
        this.$nuxt.$emit('SNACKBAR_OPEN', {
          text: 'La cuenta ya se encuentra agregada al destinatario',
          color: 'pink'
        })
        return true
      }

      _a.push(d.account)
      this.r.destinatarios = _a
    })
  },
  methods: {
    async updateRemitente () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')

        try {
          const id = await this.$fireStore.collection('remitentes').where('timestamp', '==', this.r.timestamp).get()

          await this.$fireStore.collection('remitentes').doc(id.docs[0].id).update(this.r)

          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Remitente actualizado satisfactoriamente',
            color: 'success'
          })
          this.closeModal()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al actulizar el Remitente',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    async addNewRemitente () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        try {
          this.r.timestamp = Number(new Date())
          await this.$fireStore.collection('remitentes').add(this.r)
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Remitente agregado satisfactoriamente',
            color: 'success'
          })
          this.closeModal()
          this.$nuxt.$emit('LOADING_CLOSE')
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al crear el Remitente',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    addDestinatario (type) {
      this.$nuxt.$emit('MODAL_DESTINATARIO_OPEN', type)
    },
    closeModal () {
      this.tab = null
      this.dialog = false
      this.$refs.form.resetValidation()
    }
  }
}
</script>
