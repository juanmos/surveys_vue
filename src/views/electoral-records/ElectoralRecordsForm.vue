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
            @submit.prevent="save"
            @keydown.prevent.enter
            >
              <v-layout row>
                  <v-flex xs12>
                    <label for="">Fecha: <span>{{record.date}}</span></label>
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

              <v-layout row>
                  <v-flex xs3>
                    <v-text-field
                      v-model="record.number"
                      :rules="rules.nameRules"
                      label="Número del acta:"
                      box
                      color="blue-grey lighten-2"
                      required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                      <v-text-field
                        v-model="record.voters"
                        :rules="rules.nameRules"
                        label="Sufragantes:"
                        box
                        color="blue-grey lighten-2"
                        required
                      ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                      <v-text-field
                        v-model="record.absenteeism"
                        :rules="rules.nameRules"
                        label="Ausentísmo:"
                        box
                        color="blue-grey lighten-2"
                        required
                      ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                      <v-text-field
                        v-model="record.blanks"
                        :rules="rules.nameRules"
                        label="Blancos:"
                        box
                        color="blue-grey lighten-2"
                        required
                      ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                      <v-text-field
                        v-model="record.nulls"
                        :rules="rules.nameRules"
                        label="Nulos:"
                        box
                        color="blue-grey lighten-2"
                        required
                      ></v-text-field>
                  </v-flex>
                  <v-flex xs3>
                            <picture-upload @fileCreated="setCurrentImg" :url="currentImage"></picture-upload>
                            <a :href="currentImageDownload" download title="Descargar" target="_blank">
                              <v-icon>arrow_drop_down</v-icon>
                            </a>
                  </v-flex>
                  <v-flex xs3>

                    </v-flex>
              </v-layout>
              <v-layout row>
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
                  </v-flex>
              </v-layout>
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
              <br />
                <v-btn type="submit" :disabled="!valid"  small color="info">GUARDAR PROYECTO</v-btn>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
import PictureUpload from './PictureUpload'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import {validations} from './../../utils/validations'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: ['project', 'currentRecord'],
  data: (vm) => ({
    record: {
      number: '',
      date: null,
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
    },
    currentRecord: function (val) {
      this.record = val
      this.currentImage = val.image
      this.currentImageDownload = enviroment[enviroment.currentEnviroment].backend.urlBase + '/' + val.image
    }
  },
  computed: {
    ...mapGetters('provinces', {findProvincesInStore: 'find'})
  },
  created () {
    this.buildtables()
  },
  components: {LoadingComponent, PictureUpload}
}
</script>

<style>
.upcase input{
  text-transform: uppercase
}
</style>
