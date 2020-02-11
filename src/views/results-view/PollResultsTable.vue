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
                  <tr v-for="(dataRow, indexRowData) in responsesSkip" :key="indexRowData">
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
      responsesSkip: [],
      dialogAudio: false,
      waitLoad: true,
      rowSkip: 50,
      currentHeader: null,
      currentIndex: null,
      textModal: '',
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
    scroll () {
      window.onscroll = () => {
        let bottomOfWindow = document.documentElement.scrollTop + window.innerHeight >= (document.documentElement.offsetHeight - 2600)
        if (bottomOfWindow) {
          this.addMoreRows()
        }
      }
    },
    getAudio (file) {
      file = (file) || 'uploads/construct/data_not_found.png'
      file = file.replace(/public/g, '')
      this.currentPath = enviroment[enviroment.currentEnviroment].backend.urlBase + file
      let data = {
        text: this.currentHeader.text,
        currentPath: this.currentPath,
        textModal: this.textModal,
        row: this.currentIndex
      }
      this.$emit('setAudio', data)
    },
    goToViewPoll (indexPoll) {
      let routeData = this.$router.resolve({path: `/view-data-response/${this.$route.params.id}/${indexPoll}`})
      window.open(routeData.href, '_blank')
    },
    listenAudio (header, index) {
      this.currentHeader = header
      this.currentIndex = index + 1
      this.textModal = 'Cargando'
      this.waitLoad = true
      this.findQuestionAudios({query: {_config_poll_id: this.$route.params.id, question: this.currentHeader.name, _index_originalJson: this.currentIndex}}).then((result) => {
        if (result.data.length > 0) {
          this.getAudio(result.data[0].path)
        } else {
          let data = {
            text: this.currentHeader.text,
            currentPath: null,
            textModal: '*** NO EXISTE EL AUDIO ****',
            row: this.currentIndex
          }
          this.$emit('setAudio', data)
        }
        this.waitLoad = false
      })
    },
    addMoreRows () {
      if (this.rowSkip !== this.responses.length) {
        this.rowSkip += 100
        this.rowSkip = (this.rowSkip > this.responses.length) ? this.responses.length : this.rowSkip
        this.responsesSkip = this.responses.slice(0, this.rowSkip)
      }
    },
    saveConfig (data) {
      this.responses[data.index][data.code] = data.value
      this.dialogAnswerEdit = false
    }
  },
  mounted () {
    this.scroll()
  },
  watch: {
    responses: function (val) {
      this.responsesSkip = [...val]
      this.responsesSkip = this.responsesSkip.slice(0, 150)
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
  /*height: 700px; */
}

.center {
  text-align: center;
}
.headersStyle {
  text-align: center;
}

</style>
