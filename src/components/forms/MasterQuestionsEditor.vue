<template>
  <v-flex class="view-container">
    <v-card-text>
      MASTER DE PREGUNTAS
      <div class="question">
        <label>Pregunta actual:<span style="font-weight: bold;">{{dataResponse.label}}</span></label>
      </div>
      <form>
        <v-autocomplete
          :items="getCategoryQuestions"
          v-model="selectedCategoryQuestion"
          item-text="name"
          item-value="_id"
          label="Categoría:"
        ></v-autocomplete>
        <v-autocomplete
          :items="masterQuestions"
          v-model="selectedMasterQuestion"
          item-text="text"
          item-value="_id"
          label="Pregunta:"
        ></v-autocomplete>
        <v-btn @click="format">Relacionar</v-btn>
        <v-btn @click="cancel">Cancelar</v-btn>
      </form>
    </v-card-text>
  </v-flex>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
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
      currentMaster: null,
      currentCategory: null,
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
        _id: this.currentMaster._id,
        text: this.currentMaster.text
      }
      let categoryQuestion = {
        _id: this.currentCategory._id,
        name: this.currentCategory.name
      }
      this.dataResponse.questionMaster = questionMaster
      this.dataResponse.categoryQuestion = categoryQuestion
      this.dataResponse.graphicType = this.selectedMasterQuestion.graphic_type
      this.save(this.currentPoll, true, 'Actor realacionado a la pregunta.')
    },
    changeMasterQuestion (selected) {
      this.currentMaster = this.masterQuestions.filter(data => data._id === selected)[0]
    },
    changeCategoryQuestion (selected) {
      this.currentCategory = this.categoryQuestions.filter(data => data._id === selected)[0]
      this.findMasterQuestions({ query: {removed: false, $limit: null, $skip: 0, category: selected} }).then(response => {
        this.masterQuestions = []
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
  computed: {
    ...mapGetters('category-questions', {findCategoryQuestionsInStore: 'find'}),
    getCategoryQuestions () {
      return this.findCategoryQuestionsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  watch: {
    selectedCategoryQuestion: function (val) {
      this.changeCategoryQuestion(val)
    },
    selectedMasterQuestion: function (val) {
      this.changeMasterQuestion(val)
    }
  },
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
