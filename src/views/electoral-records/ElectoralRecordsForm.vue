<template>
    <v-card>
      <v-container
        fluid
        grid-list-lg
      >
      <v-layout row>
          <v-flex xs12>
            <label for="">PROYECTO: <span>{{record.project_name}}</span></label>
          </v-flex>
          <v-flex xs12>
            <label for="">Fecha: <span>{{record.date | moment("add", "1 days", "subtract", "ddd",'YYYY-MM-DD') }}</span></label>
          </v-flex>
          <v-flex xs3>
            <label for="">Cargo: <span>{{record.position}}</span></label>
          </v-flex>
          <v-flex xs3>
            <label for="">Provincia: <span>{{record.province}}</span></label>
          </v-flex>
          <v-flex xs3>
            <label for="">Cantón: <span>{{record.canton}}</span></label>
          </v-flex>
          <v-flex xs3>
            <label for="">Parroquia: <span>{{record.parroquia}}</span></label>
          </v-flex>
      </v-layout>
      <v-form
      v-model="valid"
      @submit.prevent="save"
      @keydown.prevent.enter
      >
          <v-layout row wrap>
              <v-flex xs4>
                <v-text-field
                  v-model="record.number"
                  :rules="rules.nameRules"
                  label="Número del acta:"
                  box
                  color="blue-grey lighten-2"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs4>
                  <v-text-field
                    v-model="record.voters"
                    :rules="rules.nameRules"
                    label="Sufragantes:"
                    box
                    color="blue-grey lighten-2"
                    required
                  ></v-text-field>
              </v-flex>
              <v-flex xs4>
                  <v-text-field
                    v-model="record.absenteeism"
                    :rules="rules.nameRules"
                    label="Ausentísmo:"
                    box
                    color="blue-grey lighten-2"
                    required
                  ></v-text-field>
              </v-flex>
              <v-flex xs4>
                  <v-text-field
                    v-model="record.blanks"
                    :rules="rules.nameRules"
                    label="Blancos:"
                    box
                    color="blue-grey lighten-2"
                    required
                  ></v-text-field>
              </v-flex>
              <v-flex xs4>
                  <v-text-field
                    v-model="record.nulls"
                    :rules="rules.nameRules"
                    label="Nulos:"
                    box
                    color="blue-grey lighten-2"
                    required
                  ></v-text-field>
              </v-flex>
              <v-flex xs4>
                    <picture-upload @fileCreated="setCurrentImg" :url="currentImage"></picture-upload>
                    <a :href="currentImageDownload" download title="Descargar" target="_blank">
                         <v-icon>arrow_drop_down</v-icon>
                    </a>
              </v-flex>
              <v-flex xs12>
                  <v-autocomplete
                  :items="provinces"
                  item-text="name"
                  item-value="name"
                  v-model="record.province"
                  disabled
                  cache-items
                  hide-no-data
                  hide-details
                  label="Buscar provincia..."
                  solo-inverted
                  @change="selectetedProvince"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                  <v-autocomplete
                          :items="cantones"
                          item-text="name"
                          item-value="name"
                          :disabled="disabledCantones"
                          v-model="record.canton"
                          hide-no-data
                          hide-details
                          label="Buscar cantón..."
                          solo-inverted
                          @change="selectedCanton"
                        ></v-autocomplete>
              </v-flex>
              <v-flex xs10>
                <v-autocomplete
                        :items="districts"
                        item-text="name"
                        item-value="name"
                        v-model="record.district"
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

              <v-flex xs10>
                  <v-autocomplete class="background: #333;"
                          :items="parroquias"
                          item-text="name"
                          item-value="name"
                          v-model="record.parroquia"
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
              <v-flex xs10>
                  <v-autocomplete
                          :items="zones"
                          item-text="name"
                          item-value="name"
                          v-model="record.zone"
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
              <v-flex xs10>
                  <v-autocomplete
                          :items="tables"
                          v-model="record.table"
                          hide-no-data
                          hide-details
                          label="Buscar mesa..."
                          solo-inverted
                        ></v-autocomplete>
              </v-flex>
              <v-flex xs12>
                  <v-data-table
            :headers="resultHeaders"
            :items="record.results"
            hide-actions
            item-key="name"
          >
            <template slot="items" slot-scope="props">
              <tr @click="props.expanded = !props.expanded">
                <td class="justify-left">
                  {{props.item.name}}
                </td>
                <td class="justify-left">
                    <v-text-field
                      v-model="props.item.number_votes"
                      :rules="rules.nameRules"
                      label="votos:"
                      box
                      color="blue-grey lighten-2"
                      required
                    ></v-text-field>
                </td>
              </tr>
            </template>
          </v-data-table>
              </v-flex>
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
                    <h4>Crear parroquia para: {{this.record.district}}</h4>
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
                    <h4>Crear zona para: {{this.record.parroquia}}</h4>
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
              <v-dialog v-model="dialogActors" max-width="900">
                <v-card v-if="dialogActors">
                  <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
                    <h4>Crear zona para: {{this.record.parroquia}}</h4>
                  </v-flex>
                  <v-card-text>
                      <form-actors @getActors="setActors"></form-actors>
                  </v-card-text>
                </v-card>
             </v-dialog>
            </v-layout>
        <br />
          <v-btn type="submit" :disabled="!valid"  small color="info">GUARDAR PROYECTO</v-btn>
      </v-form>
      </v-container>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import PictureUpload from './PictureUpload'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import {validations} from './../../utils/validations'
import Vue from 'vue'
import VueMoment from 'vue-moment'
import moment from 'moment-timezone'
const enviroment = require('./../../../config/enviroment.json')
Vue.use(VueMoment, {
  moment
})
export default {
  props: ['project', 'currentRecord'],
  data: (vm) => ({
    record: {
      number: '',
      date: null,
      project_name: '',
      country: '',
      province: '',
      image: null,
      canton: '',
      district: '',
      parroquia: '',
      position: '',
      zone: '',
      actors: [],
      table: '',
      voters: '',
      absenteeism: '',
      blanks: '',
      nulls: '',
      results: [],
      _electoral_project_id: null
    },
    disabledCantones: true,
    newDistrict: '',
    newParish: '',
    newZone: '',
    dialogActors: false,
    disabledDistrict: true,
    dialogNewDistrict: false,
    dialogNewZone: false,
    dialogNewParishDistrict: false,
    provinces: [],
    cantones: [],
    districts: [],
    parroquias: [],
    zones: [],
    currentImage: null,
    currentImageDownload: null,
    resultHeaders: [{
      text: 'Candidato',
      align: 'left',
      sortable: true,
      value: 'name'
    },
    { text: 'Numero de votos',
      value: 'number_votes',
      sortable: false
    }
    ],
    tables: [],
    valid: false,
    rules: validations
  }),
  methods: {
    ...mapActions('position-actors', { findElectoralProject: 'find' }),
    ...mapActions('provinces', { findProvinces: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    setCurrentImg (data) {
      this.record.image = data.path
    },
    save () {
      this.saveData(this.record)
    },
    buildtables () {
      for (let i = 1; i <= 200; i++) {
        let female = i + 'F'
        let male = i + 'M'
        this.tables = [...this.tables, female, male]
      }
    },
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
      let newArray = this.provinces.filter(province => this.record.province === province.name).map(province => {
        if (this.record.province === province.name) {
          province.canton.map(canton => {
            if (this.record.canton === canton.name) {
              canton.district.map(district => {
                if (this.record.district === district.name) {
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
      if (this.districts.length > 0) {
        this.saveNewZoneToDistrict()
      } else {
        this.saveNewZoneToWithoutDistrict()
      }
    },
    saveNewZoneToDistrict () {
      let newArray = this.provinces.filter(province => this.record.province === province.name).map(province => {
        if (this.record.province === province.name) {
          province.canton.map(canton => {
            if (this.record.canton === canton.name) {
              canton.district.map(district => {
                if (this.record.district === district.name) {
                  district.parish.map(parish => {
                    if (this.record.parroquia === parish.name) {
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
    saveNewZoneToWithoutDistrict () {
      let newArray = this.provinces.filter(province => this.record.province === province.name).map(province => {
        if (this.record.province === province.name) {
          province.canton.map(canton => {
            if (this.record.canton === canton.name) {
              canton.parish.map(parish => {
                if (this.record.parroquia === parish.name) {
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
      this.loadCantones()
    },
    loadCantones () {
      this.findProvinces({query: {name: this.record.province, $skip: 0, $limit: null}}).then(response => {
        this.cantones = response.data[0].canton
        this.orderCantones()
        if (this.record.canton !== '' && this.record.canton) {
          this.loadDataEdit()
        }
      })
    },
    selectedCanton () {
      this.districts = []
      this.parroquias = []
      this.zones = []
      let currentCanton = this.cantones.filter(canton => canton.name === this.record.canton)[0]
      if (currentCanton) {
        if (currentCanton.district && currentCanton.district.length > 0) {
          this.disabledDistrict = false
          this.districts = currentCanton.district
        } else {
          this.disabledDistrict = true
          this.parroquias = currentCanton.parish
        }
        this.record.district = ''
        this.record.parroquia = ''
        this.record.zone = ''
      }
    },
    loadDataEdit () {
      this.districts = []
      this.parroquias = []
      this.zones = []
      let currentCanton = this.cantones.filter(canton => canton.name === this.record.canton)[0]
      if (currentCanton) {
        if (currentCanton.district && currentCanton.district.length > 0) {
          this.disabledDistrict = false
          this.districts = currentCanton.district
          this.loadCurrentDistrict()
          this.loadParish()
        } else {
          this.disabledDistrict = true
          this.parroquias = currentCanton.parish
        }
      }
    },
    selectedDistrict () {
      this.record.parroquia = ''
      this.record.zone = ''
      this.zones = []
      this.loadCurrentDistrict()
    },
    loadCurrentDistrict () {
      let currentDistrict = this.districts.filter(district => district.name === this.record.district)
      if (currentDistrict.length > 0) {
        this.parroquias = currentDistrict[0].parish
      }
    },
    loadParish () {
      let currentParroquia = this.parroquias.filter(parroquia => parroquia.name === this.record.parroquia)
      if (currentParroquia.length > 0) {
        this.zones = currentParroquia[0].zone
      }
    },
    selectedParroquia () {
      this.record.zone = ''
      this.zones = []
      this.loadParish()
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
        this.selectedParroquia()
        this.cleanData()
      })
    },
    saveData (values) {
      const {ElectoralRecord} = this.$FeathersVuex
      const record = new ElectoralRecord(values)
      record.save().then((result) => {
        this.setSnackMessage('Acta almacenada correctamente.')
        this.setShowSnack(true)
        this.$router.push('/electoral-projects/' + this.record._electoral_project_id)
      }, (err) => {
        console.log(err)
        this.setSnackMessage('No se puedo almacenar el acta.')
        this.setShowSnack(true)
      })
    }
  },
  watch: {
    project: function (val) {
      this.record.country = val.country
      this.record.province = val.province
      this.loadCantones()
      this.record.date = val.date
      this.record.country = val.country
      this.record.canton = val.canton
      this.record.parroquia = val.parroquia
      this.record.results = val.actors
      this.record.district = val.district
      this.record.zone = val.zone
      this.record.position = val.position
      this.record.actors = val.actors
      this.record._electoral_project_id = val._id
      this.record.project_name = val.name
      if (this.record.position === 'ALCALDE') {
        this.disabledCantones = true
      } else {
        this.disabledCantones = false
      }
    },
    currentRecord: function (val) {
      this.record = val
      this.loadCantones()
      this.currentImage = val.image
      this.currentImageDownload = enviroment[enviroment.currentEnviroment].backend.urlBase + '/' + val.image
    }
  },
  computed: {
    ...mapGetters('provinces', {findProvincesInStore: 'find'})
  },
  created () {
    this.buildtables()
    this.loadProvinces()
  },
  components: {LoadingComponent, PictureUpload}
}
</script>

<style>
.v-input--is-disabled:not(.v-input--is-readonly) {
    pointer-events: none;
    background: #b25050;
}
.upcase input{
  text-transform: uppercase
}
</style>
