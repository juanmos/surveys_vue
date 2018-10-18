<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs12>
            <v-form
            v-model="valid"
            @submit.prevent="sendData"
            @keydown.prevent.enter
            >
             <v-text-field
               v-model="Item.name"
               :rules= "nameRules"
               label="Nombre"
               box
               color="blue-grey lighten-2"
               required
             ></v-text-field>

                <v-text-field
                  @click="dialogo = true"
                  v-model="Item.icon"
                  label="Icono"
                  box
                  color="blue-grey lighten-2"
                  required
                  :append-icon="Myicon"
                  :rules= "iconRules"
                ></v-text-field>
                <v-dialog
                  v-model="dialogo"
                  max-width="1000"
                >
                  <v-card>
                    <v-card-title class="headline">ICONO</v-card-title>
                    <v-card-text>
                      Seleccione un icono
                      <menu-icon-list
                      slot="input"
                      @iconName="seleccion"
                      > </menu-icon-list>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <v-text-field
                  v-model="Item.url"
                  label="URL"
                  :rules= "urlRules"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {validations} from './../../utils/validations'
import MenuIconList from './MenuIconList'
export default {
  data: (vm) => ({
    Item: {
      name: '',
      icon: '',
      url: '',
      removed: false
    },
    valid: false,
    dialogo: false,
    rules: validations,
    Myicon: '',
    nameRules: [
      v => !!v || 'Nombre es requerido'
      // v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    iconRules: [
      v => !!v || 'Icono es requerido'
    ],
    urlRules: [
      v => !!v || 'URL es requerido'
    ]
  }),
  methods: {
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.Item)
      }
    },
    seleccion (datos) {
      // console.log('me trae en selecion', datos)
      // this.icono = datos.nombre
      this.Myicon = datos.nombre
      this.Item.icon = datos.nombre
      this.closeDialogo()
    },
    closeDialogo () {
      // console.log('entran')
      // this.editIcon('icon')
      this.dialogo = false
    }
  },
  components: {MenuIconList}
}
</script>

<style>

</style>
