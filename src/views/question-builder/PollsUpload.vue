<template>
    <v-card class="m-5">
      <div class="p-5">
        <v-flex class="ml-5 mr-5">
          <v-text-field
            label="Nombre de la toma"
            placeholder="Ejem: Febrero 2019"
            v-model="name"
          ></v-text-field>
        </v-flex>
        <v-combobox
          class="ml-5 mr-5"
          v-model="take"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="Seleccione numero de Toma"
        ></v-combobox>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-autocomplete
                  :items="countries"
                  item-text="name"
                  item-value="_id"
                  v-model="country"
                  cache-items
                  hide-no-data
                  hide-details
                  label="Buscar país..."
                  solo-inverted
                  @change="selectetedCountry"
                ></v-autocomplete>
                <br />
              </v-flex>
              <v-flex xs10>
                  <v-autocomplete
                  :items="provinces"
                  item-text="name"
                  item-value="_id"
                  v-model="province"
                  hide-no-data
                  hide-details
                  label="Buscar provincia..."
                  solo-inverted
                  @change="selectetedProvince"
                ></v-autocomplete>
              </v-flex>
              <v-flex xs2>
                  <v-btn
                  dark
                  fab
                  small
                  title="Agregar Provincia"
                  color="primary"
                  @click="addNewItem('province')"
                  >
                      <v-icon>add</v-icon>
                  </v-btn>
              </v-flex>
              <v-flex xs10>
                  <v-autocomplete
                          :items="cantones"
                          item-text="name"
                          item-value="name"
                          v-model="canton"
                          hide-no-data
                          hide-details
                          label="Buscar cantón..."
                          solo-inverted
                          multiple
                          @change="selectedCanton"
                        ></v-autocomplete>
              </v-flex>
              <v-flex xs2>
                  <v-btn
                  dark
                  fab
                  small
                  title="Agregar Cantón"
                  color="primary"
                  @click="addNewItem('canton')"
                  >
                      <v-icon>add</v-icon>
                  </v-btn>
              </v-flex>
          </v-layout>
        <v-flex xs12 sm6 class="ml-5 mr-5">
          <v-date-picker v-model="dateFinished" color="red lighten-1" locale="es-es" header-color="primary"></v-date-picker>
        </v-flex>
        <file-uploader @fileCreated="pollImported" label="Archivo Excel SPSS" inputType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></file-uploader>
        <v-btn v-if="edit" @click="saveDataEdit">Guardar</v-btn>
      </div>

      <v-dialog v-model="dialogNew" max-width="900">
        <v-card v-if="dialogNew">
        <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
        <h4>Crear {{this.currentAdd}}</h4>
        </v-flex>
        <v-card-text>
        <v-text-field class="upcase"
          v-model="newTextAddItem"
          label="Nombre"
          box
          color="blue-grey lighten-2"
          required
        ></v-text-field>
        <v-btn @click="saveNewItem">Guardar</v-btn>
        <v-btn @click="dialogNew = false">Cancelar</v-btn>
        </v-card-text>
        </v-card>
    </v-dialog>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import moment from 'moment-timezone'
import FileUploader from './../../components/FileUploader'
export default {
  props: ['currentConfigPoll', 'edit'],
  components: {FileUploader, moment},
  data: () => ({
    take: 1,
    name: null,
    dataEdit: null,
    country: null,
    province: null,
    newTextAddItem: '',
    canton: [],
    district: null,
    parroquia: null,
    zone: null,
    dateFinished: new Date().toISOString().substr(0, 10),
    countries: [],
    provinces: [],
    cantones: [],
    districts: [],
    parroquias: [],
    zones: [],
    currentAdd: '',
    disabledCantones: true,
    disabledDistrict: true,
    dialogNew: false,
    dialogNewZone: false,
    dialogNewParishDistrict: false
  }),
  methods: {
    ...mapActions('provinces', { findProvinces: 'find' }),
    ...mapActions('countries', { findCountries: 'find' }),
    addNewItem (current) {
      if (this.country !== null && this.country) {
        this.currentAdd = current
        this.dialogNew = true
      }
    },
    saveDataEdit () {
      this.dataEdit.name = this.name
      this.dataEdit.take = this.take
      this.dataEdit.dateFinished = this.dateFinished
      this.dataEdit.country = this.country
      this.dataEdit.province = this.province
      this.dataEdit.canton = this.canton
      this.$emit('editConfigPoll', this.dataEdit)
    },
    cleanData () {
      this.newDistrict = ''
      this.newParish = ''
      this.newZone = ''
      this.dialogNewDistrict = false
      this.dialogNewParishDistrict = false
      this.dialogNewZone = false
    },
    pollImported (event) {
      event.name = this.name
      event.take = this.take
      event.dateFinished = this.dateFinished
      event.country = this.country
      event.province = this.province
      event.canton = this.canton
      event.status = 'FINALIZADA'
      this.$emit('pollImported', Object.assign({}, event))
    },
    selectetedCountry () {
      this.province = null
      this.canton = []
      this.district = null
      this.parroquia = null
      this.zone = null
      this.provinces = []
      this.cantones = []
      this.districts = []
      this.parroquias = []
      this.zones = []
      this.loadProvinces()
    },
    selectetedProvince () {
      this.cantones = []
      this.districts = []
      this.parroquias = []
      this.zones = []
      this.loadCantones()
    },
    loadCantones () {
      this.findProvinces({query: {_id: this.province, $skip: 0, $limit: null}}).then(response => {
        this.cantones = response.data[0].canton
        this.orderCantones()
        if (this.canton !== '' && this.canton) {
          this.loadDataEdit()
        }
      })
    },
    selectedCanton () {
      // console.log('canton--', this.canton)
    },
    loadDataEdit () {
      this.districts = []
      this.parroquias = []
      this.zones = []
      let currentCanton = this.cantones.filter(canton => canton.name === this.canton)[0]
      if (currentCanton) {
        if (currentCanton.district && currentCanton.district.length > 0) {
          this.disabledDistrict = false
          this.districts = currentCanton.district
          this.loadCurrentDistrict()
          this.loadParish()
        } else {
          this.disabledDistrict = true
          this.parroquias = currentCanton.parish
          let currentParsih = currentCanton.parish.filter(parish => parish.name === this.parroquia)[0]
          this.zones = (currentParsih) ? (currentParsih.zone) ? currentParsih.zone : [] : []
        }
      }
    },
    selectedDistrict () {
      this.parroquia = ''
      this.zone = ''
      this.zones = []
      this.loadCurrentDistrict()
    },
    loadCurrentDistrict () {
      let currentDistrict = this.districts.filter(district => district.name === this.district)
      if (currentDistrict.length > 0) {
        this.parroquias = currentDistrict[0].parish
      }
    },
    loadParish () {
      let currentParroquia = this.parroquias.filter(parroquia => parroquia.name === this.parroquia)
      if (currentParroquia.length > 0) {
        this.zones = currentParroquia[0].zone
      }
    },
    selectedParroquia () {
      this.zone = ''
      this.zones = []
      this.loadParish()
    },
    orderCountries () {
      this.countries.sort(function (a, b) {
        var x = a.name
        var y = b.name
        if (x < y) { return -1 }
        if (x > y) { return 1 }
        return 0
      })
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
      this.findProvinces({ query: {$sort: { name: '1' }, removed: false, _country_id: this.country, $skip: 0, $limit: null} }).then(resp => {
        this.provinces = resp.data
        if (this.canton !== '') {
          this.selectedCanton()
        }
        if (this.district !== '') {
          this.selectedDistrict()
        }
        this.selectedParroquia()
        this.cleanData()
      })
    },
    loadCountries () {
      this.findCountries({ query: {$sort: { name: '1' }, removed: false, $skip: 0, $limit: null} }).then(resp => {
        this.countries = resp.data
      })
    },
    saveNewItem () {
      switch (this.currentAdd) {
        case 'province':
          this.builDataNewProvince()
          break
        case 'canton':
          this.saveNewCanton()
          break
        case 'district':
          this.saveNewDistrict()
          break
        case 'parroquia':
          this.saveNewParish()
          break
        case 'zona':
          this.saveNewZone()
          break
      }
    },
    builDataNewProvince () {
      let data = {
        name: this.newTextAddItem.toUpperCase(),
        _country_id: this.country,
        canton: []
      }
      this.updateProvince(data)
    },
    updateProvince (values) {
      const {Province} = this.$FeathersVuex
      const province = new Province(values)
      province.save().then((result) => {
        this.loadProvinces()
        this.cantones = []
        this.loadCantones()
        this.dialogNew = false
        this.newTextAddItem = ''
      }, (err) => {
        console.log(err)
      })
    },
    saveNewCanton () {
      let newArray = this.provinces.filter(provinceData => this.province === provinceData.name).map(provinceData => {
        if (this.province === provinceData.name) {
          let canton = {name: this.newTextAddItem.toUpperCase(), _province_id: provinceData.name, number_voter: 0}
          if (provinceData.canton) {
            let arrayDistrict = [...provinceData.canton, canton]
            provinceData.canton = arrayDistrict
          } else {
            provinceData.canton = [canton]
          }
          return provinceData
        }
      })
      this.updateProvince(newArray[0])
    },
    saveNewDistrict () {
      let newArray = this.provinces.filter(dataProvince => this.province === dataProvince.name).map(dataProvince => {
        if (this.province === dataProvince.name) {
          dataProvince.canton.map(dataCanton => {
            if (this.canton === dataCanton.name) {
              let distric = {name: this.newTextAddItem.toUpperCase(), _canton_id: dataCanton.name, number_voter: 0}
              if (dataCanton.district) {
                let arrayDistrict = [...dataCanton.district, distric]
                dataCanton.district = arrayDistrict
              } else {
                dataCanton.district = [distric]
              }
            }
          })
          return dataProvince
        }
      })
      this.updateProvince(newArray[0])
    },
    saveNewParish () {
      let newArray = this.provinces.filter(dataProvince => this.province === dataProvince.name).map(dataProvince => {
        if (this.province === dataProvince.name) {
          dataProvince.canton.map(dataCanton => {
            if (this.canton === dataCanton.name) {
              if (this.districts.length > 0) {
                dataCanton.district.map(dataDistrict => {
                  if (this.district === dataDistrict.name) {
                    let parish = {name: this.newTextAddItem.toUpperCase(), _district_id: dataDistrict.name, number_voter: 0}
                    if (dataDistrict.parish) {
                      let arrayDistrict = [...dataDistrict.parish, parish]
                      dataDistrict.parish = arrayDistrict
                    } else {
                      dataDistrict.parish = [parish]
                    }
                  }
                })
              } else {
                let parishWithoutDistrict = {name: this.newTextAddItem.toUpperCase(), _canton_id: dataCanton.name, number_voter: 0}
                if (dataCanton.parish) {
                  let arrayNewParish = [...dataCanton.parish, parishWithoutDistrict]
                  dataCanton.parish = arrayNewParish
                } else {
                  dataCanton.parish = [parishWithoutDistrict]
                }
              }
            }
          })
          return dataProvince
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
      let newArray = this.provinces.filter(dataProvince => this.province === dataProvince.name).map(dataProvince => {
        if (this.province === dataProvince.name) {
          dataProvince.canton.map(dataCanton => {
            if (this.canton === dataCanton.name) {
              dataCanton.district.map(dataDistrict => {
                if (this.district === dataDistrict.name) {
                  dataDistrict.parish.map(dataParish => {
                    if (this.parroquia === dataParish.name) {
                      let zona = {name: this.newTextAddItem.toUpperCase(), _parish_id: dataParish.name, number_voter: 0}
                      if (dataParish.zone) {
                        let arrayZone = [...dataParish.zone, zona]
                        dataParish.zone = arrayZone
                      } else {
                        dataParish.zone = [zona]
                      }
                    }
                  })
                }
              })
            }
          })
          return dataProvince
        }
      })
      this.updateProvince(newArray[0])
    },
    saveNewZoneToWithoutDistrict () {
      let newArray = this.provinces.filter(dataProvince => this.province === dataProvince.name).map(dataProvince => {
        if (this.province === dataProvince.name) {
          dataProvince.canton.map(dataCanton => {
            if (this.canton === dataCanton.name) {
              dataCanton.parish.map(dataParish => {
                if (this.parroquia === dataParish.name) {
                  let zona = {name: this.newTextAddItem.toUpperCase(), _parish_id: dataParish.name, number_voter: 0}
                  if (dataParish.zone) {
                    let arrayZone = [...dataParish.zone, zona]
                    dataParish.zone = arrayZone
                  } else {
                    dataParish.zone = [zona]
                  }
                }
              })
            }
          })
          return dataProvince
        }
      })
      this.updateProvince(newArray[0])
    }
  },
  watch: {
    currentConfigPoll: function (val) {
      if (val) {
        this.dataEdit = val
        this.name = val.name
        this.take = val.take
        this.country = val.country
        this.selectetedCountry()
        this.province = val.province
        this.selectetedProvince()
        this.canton = val.canton
        this.dateFinished = moment.utc(val.dateFinished).format('YYYY-MM-DD')
      }
    }
  },
  created () {
    this.loadCountries()
  },
  computed: {
    ...mapGetters('provinces', {findProvincesInStore: 'find'}),
    ...mapGetters('countries', {findCountriesInStore: 'find'})
  }
}
</script>

<style>
.v-input--is-disabled:not(.v-input--is-readonly) {
    pointer-events: none;
    background: #b25050;
}
</style>
