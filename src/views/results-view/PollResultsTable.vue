<template>
    <div>
      <v-container
        fluid
        grid-list-lg
      >
        <v-layout row wrap>
          <v-flex xs1>
            <download-excel style="cursor: pointer;"
                :data="responses"
                :fields="getFields"
                :name="`${name}.xls`"
                >
                <img src="/images/export-excel.png" height="35" width="40">
            </download-excel>
          </v-flex>
          <v-flex xs1>
            <download-excel style="cursor: pointer;"
                :data="responses"
                :fields="getFields"
                :name="`${name}.csv`"
                type="csv">
                <img src="/images/export-csv.png" height="35" width="40">
            </download-excel>
          </v-flex>
          <v-flex xs12>
            <v-card>
              <div class="tableData">
                <table class="TFtable">
                  <thead >
                    <th class="headersStyle">
                      N. Encuesta
                    </th>
                    <th class="headersStyle" v-for="(header, index) in headers" :key="index" style="z-index: 100;">
                      {{header.text}}
                    </th>
                  </thead>
                  <tr v-for="(dataRow, indexRowData) in responses" :key="indexRowData">
                    <td class="center" @click="goToViewPoll(indexRowData)">
                      <span>{{indexRowData + 1}}</span>
                    </td>
                    <td class="center" v-for="(codeHeader, indexCode) in headers" :key="indexCode">
                      <span @click="goToViewPoll(indexRowData)">
                        {{dataRow[codeHeader.code]}}
                      </span>
                      <div v-if="codeHeader.audio" style="z-index:0;">
                        <v-btn
                        dark
                        fab
                        small
                        @click="listenAudio(codeHeader, indexRowData)"
                        >
                            <v-icon>volume_up</v-icon>
                        </v-btn>
                      </div>
                    </td>
                  </tr>
                </table>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
        <v-dialog v-model="dialogAudio" v-if="dialogAudio" max-width="900">
          <v-card v-if="dialogAudio">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4>Audio</h4>
            </v-flex>
            <v-card-text>
                <v-layout row>
                    <v-flex xs12>
                        <span>{{currentHeader.text}}</span>
                    </v-flex>
                    <v-flex xs12>
                        <video controls="" autoplay="" name="media" v-if="currentPath">
                            <source :src="currentPath" type="audio/x-wav">
                        </video>
                        <span v-else style="font-weight: bold;color: red;">*** NO EXISTE EL AUDIO ****</span>
                    </v-flex>
                    <v-flex xs12>
                        <v-btn @click="dialogAudio = false">Cerrar</v-btn>
                    </v-flex>
                </v-layout>
            </v-card-text>
          </v-card>
       </v-dialog>
      </v-container>
    <!--  <v-card>
        <v-flex md12>
          <v-sheet>
            <v-data-table light
                :headers="headers"
                :items="responses"
                hide-actions
                class="elevation-1 resultsTableView TFtable"
            >
                <template slot="items" slot-scope="props">
                    <td class="text-xs-center" v-for="(value) in headers" :key="String(value) + Math.random()">
                      <span>
                            {{props.item[value.code]}}
                      </span>
                    </td>
                </template>
            </v-data-table>
          </v-sheet>
        </v-flex>
      </v-card> -->
    </div>
</template>

<script>
import {mapActions} from 'vuex'
const enviroment = require('./../../../config/enviroment.json')
export default {
  props: ['responses', 'headers', 'variablesMode', 'currentPoll', 'name'],
  data () {
    return {
      dialogAnswerEdit: false,
      fields: {},
      dialogAudio: false,
      currentHeader: null,
      currentIndex: null,
      currentPath: null,
      currentQuestion: {
        text: ''
      },
      urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase,
      currentEdit: {
        value: '',
        index: 0,
        code: ''
      },
      arrIndex: null
    }
  },
  computed: {
    getFields () {
      let objectHeaders = {}
      this.headers.map(header => {
        if (header.text) {
          objectHeaders[header.text] = (header.code) ? header.code : ''
        }
      })
      return objectHeaders
    }
  },
  methods: {
    ...mapActions('question-audios', {findQuestionAudios: 'find'}),
    questionCoding (index, code) {
      this.currentEdit = {
        value: this.responses[index][code],
        index: index,
        code: code
      }
      this.dialogAnswerEdit = true
    },
    getAudio (file) {
      file = (file) || 'uploads/construct/data_not_found.png'
      file = file.replace(/public/g, '')
      this.currentPath = enviroment[enviroment.currentEnviroment].backend.urlBase + file
      console.log('currentPath-->', this.currentPath)
    },
    goToViewPoll (indexPoll) {
      let routeData = this.$router.resolve({path: `/view-data-response/${this.$route.params.id}/${indexPoll}`})
      window.open(routeData.href, '_blank')
    },
    listenAudio (header, index) {
      this.dialogAudio = true
      this.currentHeader = header
      this.currentIndex = index + 1
      this.findQuestionAudios({query: {_config_poll_id: this.$route.params.id, question: this.currentHeader.name, _index_originalJson: this.currentIndex}}).then((result) => {
        if (result.data.length > 0) {
          this.getAudio(result.data[0].path)
        }
      })
    },
    saveConfig (data) {
      this.responses[data.index][data.code] = data.value
      this.dialogAnswerEdit = false
    }
  },
  components: {}
}
</script>

<style scoped>

.TFtable{
  width: 100%;
  border-collapse: collapse;
}

.TFtable td{
  padding:7px;
  border:#dadde2 1px solid;
}

.TFtable th{
  padding:7px; border:#dadde2 1px solid;
  background: white;
  color: rgba(0,0,0,.54);
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 12px;
  max-width: 450px;
  min-width: 350px;
}

/* encabezados estaticos*/
.TFtable{
    width: 400px;
    table-layout: fixed;
    border-collapse: collapse;
}

.TFtable tbody{
  display:block;
  width: 100%;
  overflow: auto;
  height: 100px;
}

.TFtable thead tr {
   display: block;
}

.TFtable thead {
  background: black;
  color:#fff;
}

.TFtable th, .TFtable td {
  padding: 5px;
  text-align: center;
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 13px;
  width: 200px;
}

/* encabezados estaticos*/

.TFtable tr{
  background: #dadde2;
  cursor: pointer !important;
}

.TFtable tr:nth-child(odd){
  background: #dfe3ea;
  color: black;
}

.TFtable tr:nth-child(even){
  background: white;
  color: black;
}

.TFtable th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
}

table {
  display: block;
}

.tableData {
  width: 100%;
  overflow-x: scroll;
  height: 700px;
}

.center {
  text-align: center;
}
.headersStyle {
  text-align: center;
}

</style>
