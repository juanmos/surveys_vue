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
                    <th class="headersStyle" v-for="(header, index) in headers" :key="index">
                      {{header.text}}
                    </th>
                  </thead>
                  <tr v-for="(dataRow, indexRowData) in responses" :key="indexRowData" @click="goToViewPoll(indexRowData)">
                    <td class="center" @click="goToViewPoll(indexRowData)">
                      <span>{{indexRowData + 1}}</span>
                    </td>
                    <td class="center" v-for="(codeHeader, indexCode) in headers" :key="indexCode">
                      {{dataRow[codeHeader.code]}}
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
export default {
  props: ['responses', 'headers', 'variablesMode', 'currentPoll', 'name'],
  data () {
    return {
      dialogAnswerEdit: false,
      fields: {},
      currentQuestion: {
        text: ''
      },
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
        objectHeaders[header.text] = header.code
      })
      return objectHeaders
    }
  },
  methods: {
    questionCoding (index, code) {
      this.currentEdit = {
        value: this.responses[index][code],
        index: index,
        code: code
      }
      this.dialogAnswerEdit = true
    },
    goToViewPoll (indexPoll) {
      let routeData = this.$router.resolve({path: `/view-data-response/${this.$route.params.id}/${indexPoll}`})
      window.open(routeData.href, '_blank')
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
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 13px;
  padding:7px;
  border:#dadde2 1px solid;
}

.TFtable th{
  padding:7px; border:#dadde2 1px solid;
  background: white;
  color: rgba(0,0,0,.54);
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 12px;
  max-width: 350px;
  min-width: 50px;
}

.TFtable tr{
  background: #dadde2;
  cursor: pointer;
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
}

.center {
  text-align: center;
}
.headersStyle {
  text-align: center;
}

</style>
