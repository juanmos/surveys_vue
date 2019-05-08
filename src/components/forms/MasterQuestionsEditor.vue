<template>
  <v-flex class="view-container">
    <v-card-text>
      MASTER DE PREGUNTAS
      <div class="question">
        <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
      </div>
      <form>
        <v-autocomplete
          :items="categoryQuestions"
          v-model="selectedCategoryQuestion"
          item-text="name"
          item-value="_id"
          @change="changeCategoryQuestion"
          label="Categoría:"
        ></v-autocomplete>
        <v-autocomplete
          :items="masterQuestions"
          v-model="selectedMasterQuestion"
          item-text="text"
          item-value="_id"
          @change="changeMasterQuestion"
          label="Pregunta:"
        ></v-autocomplete>
        <v-btn @click="format">Relacionar</v-btn>
        <v-btn @click="cancel">Cancelar</v-btn>
      </form>
    </v-card-text>
  </v-flex>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  props: ['arrIndex'],
  data () {
    return {
      active: null,
      currentPoll: {
        _polls_project_id: null,
        formatedConfiguration: []
      },
      selectedMasterQuestion: null,
      selectedCategoryQuestion: null,
      masterQuestions: [],
      categoryQuestions: [],
      dataResponse: {
        label: ''
      }
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('master-questions', { findMasterQuestions: 'find' }),
    ...mapActions('category-questions', { findCategoryQuestions: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    format () {
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      let questionMaster = {
        _id: this.selectedMasterQuestion._id,
        text: this.selectedMasterQuestion.text
      }
      let categoryQuestion = {
        _id: this.selectedCategoryQuestion._id,
        name: this.selectedCategoryQuestion.name
      }
      this.dataResponse.questionMaster = questionMaster
      this.dataResponse.categoryQuestion = categoryQuestion
      this.save(this.currentPoll, true, 'Actor realacionado a la pregunta.')
    },
    changeMasterQuestion (selected) {
      this.selectedMasterQuestion = this.masterQuestions.filter(data => data._id === selected)[0]
    },
    changeCategoryQuestion (selected) {
      this.selectedCategoryQuestion = this.categoryQuestions.filter(data => data._id === selected)[0]
      this.findMasterQuestions({ query: {removed: false, $limit: null, $skip: 0, category: selected} }).then(response => {
        this.masterQuestions = response.data
      })
    },
    deleteQuestion (value) {
      /* this.dataResponse.related = this.dataResponse.related.filter(item => (value !== item))
      this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
      this.save(this.currentPoll, false, 'Pregunta relacionada eliminada.') */
    },
    save (values, close, message) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.save().then(result => {
        this.setSnackMessage(message)
        this.setShowSnack(true)
        this.$emit('refresh')
      }).catch(err => console.log('este es el error', err))
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {},
  created () {
    this.findCategoryQuestions({ query: {removed: false, $limit: null, $skip: 0} }).then(response => {
      this.categoryQuestions = response.data
    })
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      if (this.dataResponse.categoryQuestion && this.dataResponse.questionMaster) {
        this.changeCategoryQuestion(this.dataResponse.categoryQuestion._id)
        this.selectedCategoryQuestion = this.dataResponse.categoryQuestion
        this.selectedMasterQuestion = this.dataResponse.questionMaster
      }
    })
  }
}
</script>

<style scoped>
.overflow {
  height: 300px;
  overflow: auto;
}
.question {
  margin-bottom: 30px;
}
</style>
