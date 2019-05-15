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
                  v-model="project.name"
                  :rules="rules.nameRules"
                  label="Nombre"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
                <v-autocomplete
                  :items="positions"
                  v-model="selectedposition"
                  item-text="name"
                  item-value="_id"
                  label="Cargo"
                ></v-autocomplete>
                <v-autocomplete
                :items="provinces"
                item-text="name"
                item-value="name"
                v-model="project.province"
                cache-items
                hide-no-data
                hide-details
                label="Buscar provincia..."
                solo-inverted
                @change="selectetedProvince"
              ></v-autocomplete>
              <br />
              <v-autocomplete
                      :items="cantones"
                      item-text="name"
                      item-value="name"
                      v-model="project.canton"
                      hide-no-data
                      hide-details
                      label="Buscar cantón..."
                      solo-inverted
                      @change="selectedCanton"
                    ></v-autocomplete>
              <br />
              <v-layout row>
                  <v-flex xs10>
                    <v-autocomplete
                            :items="districts"
                            item-text="name"
                            item-value="name"
                            v-model="project.district"
                            hide-no-data
                            :disabled="disabledDistrict"
                            hide-details
                            label="Buscar circunscripción cantonal..."
                            solo-inverted
                            @change="selectedDistrict"
                          ></v-autocomplete>
                  </v-flex>
                  <v-flex xs2>
                      <v-btn
                      dark
                      fab
                      small
                      title="Agregar Circunscripción"
                      color="primary"
                      @click="dialogNewDistrict = true"
                      >
                          <v-icon>add</v-icon>
                      </v-btn>
                  </v-flex>
              </v-layout>
              <v-layout row>
                  <v-flex xs10>
                      <v-autocomplete
                              :items="parroquias"
                              item-text="name"
                              item-value="name"
                              v-model="project.parroquia"
                              hide-no-data
                              hide-details
                              label="Buscar parroquias..."
                              solo-inverted
                              @change="selectedParroquia"
                            ></v-autocomplete>
                  </v-flex>
                  <v-flex xs2>
                      <v-btn
                      dark
                      fab
                      small
                      title="Agregar Parroquia"
                      color="primary"
                      @click="dialogNewParishDistrict = true"
                      >
                          <v-icon>add</v-icon>
                      </v-btn>
                  </v-flex>
              </v-layout>
              <v-layout row>
                  <v-flex xs10>
                      <v-autocomplete
                              :items="zones"
                              item-text="name"
                              item-value="name"
                              v-model="project.zona"
                              hide-no-data
                              hide-details
                              label="Buscar zona..."
                              solo-inverted
                            ></v-autocomplete>
                  </v-flex>
                  <v-flex xs2>
                      <v-btn
                      dark
                      fab
                      small
                      title="Agregar Zona"
                      color="primary"
                      @click="dialogNewZone = true"
                      >
                          <v-icon>add</v-icon>
                      </v-btn>
                  </v-flex>
              </v-layout>
              <br />

                <v-date-picker v-model="project.date" color="red lighten-1" locale="es-es" header-color="primary"></v-date-picker>
                <v-btn type="submit" :disabled="!valid"  small color="info">Guardar</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>

      <v-dialog v-model="dialogNewDistrict" max-width="900">
        <v-card v-if="dialogNewDistrict">
          <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
            <h4>Crear Circunscripción</h4>
          </v-flex>
          <v-card-text>
              <v-text-field class="upcase"
                v-model="newDistrict"
                label="Nombre"
                box
                color="blue-grey lighten-2"
                required
              ></v-text-field>
              <v-btn @click="saveNewDistrict">Guardar</v-btn>
              <v-btn @click="dialogNewDistrict = false">Cancelar</v-btn>
          </v-card-text>
        </v-card>
     </v-dialog>
      <v-dialog v-model="dialogNewParishDistrict" max-width="900">
        <v-card v-if="dialogNewParishDistrict">
          <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
            <h4>Crear parroquia para: {{this.project.district}}</h4>
          </v-flex>
          <v-card-text>
              <v-text-field class="upcase"
                v-model="newParish"
                label="Nombre"
                box
                color="blue-grey lighten-2"
                required
              ></v-text-field>
              <v-btn @click="saveNewParish">Guardar</v-btn>
              <v-btn @click="dialogNewParishDistrict = false">Cancelar</v-btn>
          </v-card-text>
        </v-card>
     </v-dialog>
      <v-dialog v-model="dialogNewZone" max-width="900">
        <v-card v-if="dialogNewZone">
          <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
            <h4>Crear zona para: {{this.project.parroquia}}</h4>
          </v-flex>
          <v-card-text>
              <v-text-field class="upcase"
                v-model="newZone"
                label="Nombre"
                box
                color="blue-grey lighten-2"
                required
              ></v-text-field>
              <v-btn @click="saveNewZone">Guardar</v-btn>
              <v-btn @click="dialogNewZone = false">Cancelar</v-btn>
          </v-card-text>
        </v-card>
     </v-dialog>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import {validations} from './../../utils/validations'
export default {
  data: (vm) => ({
    project: {
      name: '',
      date: new Date().toISOString().substr(0, 10),
      country: '',
      province: '',
      canton: '',
      district: '',
      parroquia: '',
      position: '',
      zone: '',
      actors: []
    },
    newDistrict: '',
    newParish: '',
    newZone: '',
    disabledDistrict: true,
    dialogNewDistrict: false,
    dialogNewZone: false,
    dialogNewParishDistrict: false,
    selectedposition: null,
    positions: [],
    provinces: [],
    cantones: [],
    districts: [],
    parroquias: [],
    zones: [],
    valid: false,
    rules: validations
  }),
  methods: {
    ...mapActions('position-actors', { findPositionActors: 'find' }),
    ...mapActions('provinces', { findProvinces: 'find' }),
    saveNewDistrict () {
      let newArray = this.provinces.filter(province => this.project.province === province.name).map(province => {
        if (this.project.province === province.name) {
          province.canton.map(canton => {
            if (this.project.canton === canton.name) {
              let distric = {name: this.newDistrict.toUpperCase(), _canton_id: canton.name, number_voter: 0}
              if (canton.district) {
                let arrayDistrict = [...canton.district, distric]
                canton.district = arrayDistrict
              } else {
                canton.district = [distric]
              }
            }
          })
          return province
        }
      })
      this.updateProvince(newArray[0])
    },
    saveNewParish () {
      let newArray = this.provinces.filter(province => this.project.province === province.name).map(province => {
        if (this.project.province === province.name) {
          province.canton.map(canton => {
            if (this.project.canton === canton.name) {
              canton.district.map(district => {
                if (this.project.district === district.name) {
                  let parish = {name: this.newParish.toUpperCase(), _district_id: district.name, number_voter: 0}
                  if (district.parish) {
                    let arrayDistrict = [...district.parish, parish]
                    district.parish = arrayDistrict
                  } else {
                    district.parish = [parish]
                  }
                }
              })
            }
          })
          return province
        }
      })
      this.updateProvince(newArray[0])
    },
    saveNewZone () {
      let newArray = this.provinces.filter(province => this.project.province === province.name).map(province => {
        if (this.project.province === province.name) {
          province.canton.map(canton => {
            if (this.project.canton === canton.name) {
              canton.district.map(district => {
                if (this.project.district === district.name) {
                  district.parish.map(parish => {
                    if (this.project.parroquia === parish.name) {
                      let zona = {name: this.newZone.toUpperCase(), _parish_id: parish.name, number_voter: 0}
                      if (parish.zone) {
                        let arrayZone = [...parish.zone, zona]
                        parish.zone = arrayZone
                      } else {
                        parish.zone = [zona]
                      }
                    }
                  })
                }
              })
            }
          })
          return province
        }
      })
      this.updateProvince(newArray[0])
    },
    updateProvince (values) {
      const {Province} = this.$FeathersVuex
      const province = new Province(values)
      province.save().then((result) => {
        this.loadProvinces()
      }, (err) => {
        console.log(err)
      })
    },
    cleanData () {
      this.newDistrict = ''
      this.newParish = ''
      this.newZone = ''
      this.dialogNewDistrict = false
      this.dialogNewParishDistrict = false
      this.dialogNewZone = false
    },
    selectetedProvince () {
      this.cantones = []
      this.districts = []
      this.parroquias = []
      this.zones = []
      this.findProvinces({query: {name: this.project.province, $skip: 0, $limit: null}}).then(response => {
        this.cantones = response.data[0].canton
        this.orderCantones()
      })
    },
    selectedCanton () {
      this.districts = []
      this.parroquias = []
      this.zones = []
      let currentCanton = this.cantones.filter(canton => canton.name === this.project.canton)[0]
      if (currentCanton.district && currentCanton.district.length > 0) {
        this.disabledDistrict = false
        this.districts = currentCanton.district
      } else {
        this.disabledDistrict = true
        this.parroquias = currentCanton.parish
      }
      this.project.district = ''
      this.project.parroquia = ''
      this.project.zone = ''
    },
    selectedDistrict () {
      this.project.parroquia = ''
      this.project.zone = ''
      this.zones = []
      let currentDistrict = this.districts.filter(district => district.name === this.project.district)
      if (currentDistrict.length > 0) {
        this.parroquias = currentDistrict[0].parish
      }
    },
    selectedParroquia () {
      this.project.zone = ''
      this.zones = []
      let currentParroquia = this.parroquias.filter(parroquia => parroquia.name === this.project.parroquia)
      if (currentParroquia.length > 0) {
        this.zones = currentParroquia[0].zone
      }
    },
    orderCantones () {
      this.cantones.sort(function (a, b) {
        var x = a.name
        var y = b.name
        if (x < y) { return -1 }
        if (x > y) { return 1 }
        return 0
      })
    },
    loadProvinces () {
      this.findProvinces({ query: {$sort: { name: '1' }, removed: false, $skip: 0, $limit: null} }).then(resp => {
        this.provinces = resp.data
        if (this.project.canton !== '') {
          this.selectedCanton()
        }
        if (this.project.district !== '') {
          this.selectedDistrict()
        }
        if (this.project.parroquia !== '') {
          this.selectedParroquia()
        }
        this.cleanData()
      })
    },
    sendData () {
      if (this.valid) {
        this.$emit('dataSubmited', this.project)
      }
    }
  },
  computed: {
    ...mapGetters('provinces', {findProvincesInStore: 'find'})
  },
  created () {
    this.loadProvinces()
    this.findPositionActors({ query: {removed: false, $skip: 0, $limit: null} }).then(resp => {
      this.positions = resp.data
    })
  }
}
</script>

<style>
.upcase input{
  text-transform: uppercase
}
</style>
