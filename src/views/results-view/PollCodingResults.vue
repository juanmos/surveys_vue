<template>
    <div>
      <download-excel
          :data="responses"
          :fields="headers">
          <img src="/images/excel_icon.png" height="35" width="40">
      </download-excel>
        <v-data-table
            :headers="headers"
            :items="responses"
            hide-actions
            class="elevation-1 resultsTable"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value) in headers" :key="String(value) + Math.random()">
                  <label for="" style="cursor:pointer;" @click="questionCoding(props.index, value.code)">{{props.item[value.code]}}</label>
                </td>
            </template>
        </v-data-table>
        <v-dialog v-model="dialogAnswerEdit" max-width="900">
          <v-card v-if="dialogAnswerEdit">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4>Codificar respuesta</h4>
            </v-flex>
            <v-card-text>
              <label style="color: white;height: 45px;padding: 11px; margin-bottom:10px;">{{currentEdit.question}}</label>
              <hr />
              <edit-value-field :value="currentEdit" @dataChanged="saveConfig"></edit-value-field>
            </v-card-text>
            <v-btn @click="dialogAnswerEdit = false">Cancelar</v-btn>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
import EditValueField from './../../components/forms/EditValueField'
import EditableField from './../../components/forms/EditableField'
export default {
  props: ['responses', 'headers'],
  data () {
    return {
      dialogAnswerEdit: false,
      currentQuestion: {
        text: ''
      },
      newVal: '',
      currentEdit: {
        value: '',
        question: '',
        previous: '',
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
        previous: this.responses[index][code],
        question: this.headers.find(q => q.code === code).text,
        index: index,
        code: code
      }
      this.dialogAnswerEdit = true
    },
    saveConfig (data) {
      this.responses[data.index][data.code] = data.value
      this.responses.forEach(answer => {
        if (answer[data.code] === data.previous) {
          answer[data.code] = data.value
        }
      })
      this.$emit('saveOriginal', this.responses)
      this.dialogAnswerEdit = false
    }
  },
  components: {EditValueField, EditableField}
}
</script>

<style scoped>
.complete {
    background-color: #407a42 !important;
    border-color: #407a42 !important;
}
</style>
