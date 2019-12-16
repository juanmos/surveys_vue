<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Encuestas moviles</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <!-- <v-select
                     v-model="selectedUser"
                     v-bind:items="users"
                     item-text="name"
                     item-value="_id"
                     label="Encuestador"
                     ></v-select> -->
                    <!-- <v-text-field
                            v-model="search"
                            @keyup.enter="searchUserName"
                            @keyup.space="searchUserName"
                            append-icon="search"
                            label="Buscar por nombre..."
                            single-line
                            hide-details
                          ></v-text-field> -->
                </v-flex>
                <v-flex xs6>
                    <label>TOTAL DE ENCUESTAS: {{listCloneOriginal.length}}</label>
                </v-flex>
              </v-card-title>
          <v-data-table
                  :headers="headers"
                  :items="listMobilePolls"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left">
                        ENCUESTA - {{ props.item.index + 1}}
                      </td>
                      <td class="justify-center layout px-0">
                        <v-menu
                          bottom
                          transition="slide-y-transition"
                        >
                          <v-btn
                            slot="activator"
                            color="primary"
                            flat
                            icon
                          >
                          <v-icon>more_vert</v-icon>
                          </v-btn>
                          <v-list>
                            <v-list-tile @click="goToViewPoll(props.item.index)">
                              <v-list-tile-title >Ver encuesta</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList()"
                >
                    <v-icon>list</v-icon>
                </v-btn>
                <v-layout row wrap>
                    <v-flex xs3>
                        <v-btn
                        dark
                        small
                        color="primary"
                        @click="getExportPdfAll()"
                        >
                            DESCARGAR TODAS
                        </v-btn>
                    </v-flex>
                    <v-flex xs1>
                        <v-text-field
                                v-model="fromPoll"
                                label="Desde"
                                single-line
                                hide-details
                              ></v-text-field>
                    </v-flex>
                    <v-flex xs1>
                        <v-text-field
                                v-model="toPoll"
                                label="Hasta"
                                single-line
                                hide-details
                              ></v-text-field>
                    </v-flex>
                </v-layout>
                <loading-component v-if="loading"></loading-component>
            </v-card>
        </v-flex>
        <v-dialog v-model="dialogWait" persistent max-width="900">
            <v-card v-if="dialogWait">
              <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
                <h4>DESCARGANDO ENCUESTAS</h4>
              </v-flex>
              <v-card-text>
                  <center>
                      <v-img
                        src="/images/loader.gif"
                        img-alt="Image"
                        height="70"
                        width="70"
                        aspect-ratio="2.75"
                      ></v-img>
                    <h5>ESPERE POR FAVOR Y HABILITE LA DESCARGA DE VARIOS ARCHIVOS</h5>
                  </center>
              </v-card-text>
            </v-card>
        </v-dialog>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import ViewDataResponsePoll from './ViewDataResponsePoll'
import * as SurveyVue from 'survey-vue'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import * as SurveyPDF from 'survey-pdf'
export default {
  data () {
    return {
      headers: [
        {
          text: 'N. Enecuesta',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: 'Acciones',
          sortable: false
        }
      ],
      id: null,
      search: '',
      fromPoll: null,
      toPoll: null,
      dialog: false,
      dialogWait: false,
      page: 1,
      options: {
        fontSize: 14,
        margins: {
          left: 10,
          right: 10,
          top: 18,
          bot: 10
        }
      },
      pageCount: 0,
      itemsPerPage: 10,
      construct: null,
      selectedPoll: null,
      total: 0,
      dialogViewPoll: false,
      message: '',
      showMsg: false,
      listCloneOriginal: [],
      listMobilePolls: [],
      msgType: 'error',
      itemSelected: null,
      loaded: false,
      query: {}
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    goToDetailUser (userId) {
      // this.$router.push({ path: `/view-detail-mobile-results/${this.id}/${userId}` })
    },
    goToList () {
      this.$router.go(-1)
    },
    goToViewPoll (index) {
      // this.$router.push({ path: `/view-data-response/${this.id}/${index}` })
      let routeData = this.$router.resolve({path: `/view-data-response/${this.id}/${index}`})
      window.open(routeData.href, '_blank')
    },
    getDataConfig () {
      this.getPoll(this.id).then(result => {
        this.listMobilePolls = result.formatAnswersMobile
        this.construct = JSON.parse(result.construct)
        this.listCloneOriginal = [...this.listMobilePolls]
        this.listMobilePolls = this.listMobilePolls.map(answer => {
          return {index: this.listMobilePolls.indexOf(answer), name: 'Enuesta'}
        })
      }).catch(err => console.log('este es el error', err))
    },
    saveSurvey (surveyAnswer) {
      let model = new SurveyVue.Model({pages: this.construct.pages})
      model.data = this.listCloneOriginal[surveyAnswer]
      let surveyPDF = new SurveyPDF.SurveyPDF(this.construct, this.options)
      surveyPDF.data = model.data
      Promise.all(surveyPDF.save(`${surveyAnswer + 1}-${this.construct.title}`))
      if (surveyAnswer === (this.listCloneOriginal.length - 1)) {
        this.dialogWait = false
      }
    },
    start (counter) {
      let that = this
      if (counter < (Number(that.toPoll) - 1)) {
        setTimeout(function () {
          counter++
          let model = new SurveyVue.Model({pages: that.construct.pages})
          model.data = that.listCloneOriginal[counter]
          let surveyPDF = new SurveyPDF.SurveyPDF(that.construct, that.options)
          surveyPDF.data = model.data
          surveyPDF.save(`${counter + 1}-${that.construct.title}`)
          if (counter === (that.toPoll - 1)) {
            that.dialogWait = false
          }
          that.start(counter)
        }, 3000)
      }
    },
    getExportPdfAll () {
      this.dialogWait = true
      this.start((Number(this.fromPoll) - 2))
    }
  },
  computed: {
    ...mapGetters('config-polls', {findMobileSurveyInStore: 'get'}),
    ...mapState('config-polls', {loading: 'isFindPending'})
  },
  watch: {},
  created () {
    this.id = this.$route.params.id
    this.getDataConfig()
  },
  components: {LoadingComponent, ViewDataResponsePoll}
}
</script>

<style>
.justify-left {
    text-align: left;
}
</style>
