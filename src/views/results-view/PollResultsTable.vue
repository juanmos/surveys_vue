<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            hide-actions
            class="elevation-1 resultsTable"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value) in headers" :key="String(value) + Math.random()">
                  <span>
                        {{props.item[value.code]}} <!--{{value.type}}-->
                  </span>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
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
  components: {}
}
</script>

<style scoped>
.complete {
    background-color: #407a42 !important;
    border-color: #407a42 !important;
}
</style>
