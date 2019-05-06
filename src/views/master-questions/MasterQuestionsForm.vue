<template>
   <v-form>
       <v-container>
           <v-layout xs12 offset-xs1>
                <v-flex xs12>
                    <v-text-field
                        v-model="currentQuestion.text"
                        label="Texto de la pregunta:"
                        box
                    ></v-text-field>
                    <v-text-field
                        v-model="currentQuestion.type"
                        label="Tipo de pregunta:"
                        box
                    ></v-text-field>

                    <v-autocomplete
                      :items="codes"
                      v-model="selectedCoding"
                      item-text="name"
                      @change="changeCode"
                      item-value="code"
                      label="Código:"
                    ></v-autocomplete>
                    <v-autocomplete
                      :items="listGraphicType"
                      v-model="selectedgraphicType"
                      @change="changeGraphicType"
                      label="Tipo de gráfico:"
                    ></v-autocomplete>
                    <v-btn @click="save">Guardar</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data: (state) => ({
    currentQuestion: {
      text: '',
      label: '',
      coding_questions: {
        name: '',
        code: 0
      },
      type: '',
      options: null,
      graphic_type: ''
    },
    listGraphicType: ['bar', 'pie', 'line'],
    codes: [],
    selectedCoding: null,
    selectedgraphicType: null
  }),
  methods: {
    ...mapActions('coding-questions', { findCodingQuestions: 'find' }),
    changeCode (selected) {
      this.currentQuestion.coding_questions = this.codes.filter(data => data.name === selected)[0]
    },
    changeGraphicType (selected) {
      this.currentQuestion.graphic_type = selected
    },
    save () {
      this.$emit('save', Object.assign({}, this.currentQuestion))
    }
  },
  computed: {},
  created () {
    this.findCodingQuestions({ query: {removed: false, $skip: 0, $limit: null} }).then(response => {
      this.codes = response.data
    })
  },
  watch: {},
  components: {}
}
</script>

<style>

</style>
