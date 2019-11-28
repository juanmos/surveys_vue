<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            hide-actions
            class="elevation-1 resultsTable"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value, key, index) in props.item" :key="String(value) + Math.random()">
                  <v-layout row wrap>
                    <v-flex xs10>
                      <span>
                            {{props.item[headers[index].code]}} <!--{{headers[index].type}} colum: {{index}} position: {{props.index}} -->
                      </span>
                    </v-flex>
                    <!--<v-flex xs2 v-if="headers[index].type === 'text'">
                     <v-btn @click="currentQuestion=headers[index];questionCoding(props.index, headers[index].code)" icon>
                       <v-icon>send</v-icon>
                     </v-btn>
                   </v-flex> -->
                  </v-layout>
                </td>
            </template>
        </v-data-table>

      <!--  <v-dialog v-model="dialogAnswerEdit" max-width="900">
          <v-card v-if="dialogAnswerEdit">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4>Codificar respuesta</h4>
            </v-flex>
            <v-card-text>
              <label style="color: white;height: 45px;padding: 11px;">{{currentQuestion.text}}</label>
              <edit-value-field :value="currentEdit" @dataChanged="saveConfig"></edit-value-field>
            </v-card-text>
          </v-card>
        </v-dialog> -->
    </div>
</template>

<script>
import EditValueField from './../../components/forms/EditValueField'
export default {
  props: ['responses', 'headers', 'variablesMode', 'currentPoll'],
  data () {
    return {
      dialogAnswerEdit: false,
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
  methods: {
    questionCoding (index, code) {
      this.currentEdit = {
        value: this.responses[index][code],
        index: index,
        code: code
      }
      this.dialogAnswerEdit = true
    },
    saveConfig (data) {
      this.responses[data.index][data.code] = data.value
      this.dialogAnswerEdit = false
    }
  },
  components: {EditValueField}
}
</script>

<style scoped>
.complete {
    background-color: #407a42 !important;
    border-color: #407a42 !important;
}
</style>
