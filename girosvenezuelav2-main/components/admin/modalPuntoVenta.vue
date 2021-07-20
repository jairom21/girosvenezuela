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
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-select
                v-model="point.tid"
                class="px-1"
                label="Documento"
                :items="identidad"
                :rules="rul.tid"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.id"
                :rules="rul.id"
                class="px-1"
                type="number"
                label="Numero de Documento"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.name"
                :rules="rul.name"
                class="px-1"
                label="Nombre"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.company"
                :rules="rul.empty"
                class="px-1"
                label="Empresa"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.phone"
                :rules="rul.phone"
                class="px-1"
                type="number"
                label="Telefono"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.companyPhone"
                :rules="rul.phone"
                class="px-1"
                type="number"
                label="Telefono de empresa"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.email"
                :rules="rul.email"
                class="px-1"
                type="email"
                label="Email"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.percentage"
                :rules="rul.percentage"
                class="px-1"
                type="number"
                label="Porcentaje de Ganancias"
                outlined
                dense
              />
            </v-col>
          </div>

          <div class="d-flex flex-wrap">
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.city"
                :rules="rul.empty"
                class="px-1"
                label="Ciudad"
                outlined
                dense
              />
            </v-col>
            <v-col cols="12" lg="6" class="pa-0">
              <v-text-field
                v-model="point.address"
                :rules="rul.empty"
                class="px-1"
                label="Direccion"
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
        <v-btn v-if="edit" color="primary" text @click="editPuntoVenta">
          editar
        </v-btn>
        <v-btn v-if="add" color="primary" text @click="newPuntoVenta">
          guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import axios from 'axios'
export default {
  data: () => ({
    dialog: false,
    valid: false,
    title: null,
    add: null,
    edit: null,
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
        v => !!v || 'El nombre es requerido'
      ],
      surname: [
        v => !!v || 'El apellido es requerido'
      ],
      phone: [
        v => !!v || 'El telefono es requerido.',
        v => (v && v.length > 5) || 'El telefono es muy corto'
      ],
      email: [
        v => !!v || 'El email es requerido',
        v => /.+@.+\..+/.test(v) || 'Escriba un email valido'
      ],
      percentage: [
        v => !!v || 'El porcentaje es requerido'
      ],
      empty: [
        v => !!v || 'El campo es requerido'
      ]
    },
    uidEdit: null,
    newUser: null,
    point: {
      address: null,
      city: null,
      company: null,
      companyPhone: null,
      email: null,
      id: null,
      name: null,
      percentage: null,
      phone: null,
      tid: null,
      active: true
    }
  }),
  mounted () {
    this.$nuxt.$on('MODAL_PUNTO_OPEN', (p) => {
      if (!p) {
        this.title = 'AGREGAR PUNTO DE VENTA'
        this.add = true
        this.edit = false
        this.uidEdit = null
        this.dialog = true
        return
      }

      this.title = 'EDITAR PUNTO DE VENTA'
      this.add = false
      this.edit = true
      this.dialog = true
      // -
      this.uidEdit = p.uid
      const a = this.point
      a.address = p.address
      a.city = p.city
      a.company = p.company
      a.companyPhone = p.companyPhone
      a.email = p.email
      a.id = p.id
      a.name = p.name
      a.percentage = p.percentage
      a.phone = p.phone
      a.tid = p.tid
    })
  },
  methods: {
    async newPuntoVenta () {
      if (this.$refs.form.validate()) {
        const password = Math.random().toString(36).slice(2)
        const email = this.point.email
        this.$nuxt.$emit('LOADING_OPEN')

        try {
          const uid = await axios.post('https://us-central1-giros-venezuela-9d086.cloudfunctions.net/createUser', {
            email: this.point.email,
            password,
            displayName: this.point.name.toLocaleLowerCase()
          })

          // save acc data collection
          try {
            this.point.percentage = Number(this.point.percentage)
            const send = this.point
            send.uid = uid.data
            send.timestamp = Number(new Date())
            await this.$fireStore.collection('users').add(send)

            this.$refs.form.reset()
            this.dialog = false
            this.$nuxt.$emit('LOADING_CLOSE')
            this.$nuxt.$emit('SNACKBAR_OPEN', {
              text: 'Punto de Venta Agregado',
              color: 'success'
            })

            try {
              await axios.post('https://us-central1-giros-venezuela-9d086.cloudfunctions.net/sendemail', {
                to: email,
                subject: '🥳 Su nueva cuenta en Giros Venezuela',
                html: `
                  <h1>Bienvenido a Giros Venezuela</h1>
                  <p>Puedes ingresas con tu email y tu nueva contraseña es: <strong>${password}</strong></p>

                  <a href="https://girosv.netlify.app/">Entrar Ahora! 😎</a>
                  `
              })
            } catch (e) {
              this.$nuxt.$emit('SNACKBAR_OPEN', {
                text: 'Se creo la cuenta, pero no fue posible enviar el email al punto de venta',
                color: 'pink'
              })
              this.$nuxt.$emit('LOADING_CLOSE')
            }
          } catch (e) {
            this.$nuxt.$emit('SNACKBAR_OPEN', {
              text: 'Error al agregar el Punto de Venta',
              color: 'pink'
            })
            this.$nuxt.$emit('LOADING_CLOSE')
          }
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al crear el Punto de Venta',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    async editPuntoVenta () {
      if (this.$refs.form.validate()) {
        this.$nuxt.$emit('LOADING_OPEN')
        try {
          this.point.percentage = Number(this.point.percentage)
          const id = await this.$fireStore.collection('users').where('uid', '==', this.uidEdit).get()
          await this.$fireStore.collection('users').doc(id.docs[0].id).update(this.$parseObject(this.point))

          this.$refs.form.reset()
          this.dialog = false
          this.$nuxt.$emit('LOADING_CLOSE')
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Punto de Venta Actualizado',
            color: 'success'
          })
        } catch (e) {
          this.$nuxt.$emit('SNACKBAR_OPEN', {
            text: 'Error al actualizar el Punto de Venta',
            color: 'pink'
          })
          this.$nuxt.$emit('LOADING_CLOSE')
        }
      }
    },
    closeModal () {
      this.$refs.form.reset()
      this.dialog = false
    }
  }
}
</script>
