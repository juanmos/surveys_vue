<template>
    <div>
      <v-card-text>
        <form>
          <v-autocomplete
            :items="getConfigPolls"
            v-model="selectedPoll"
            item-text="name"
            item-value="_id"
            label="Encuesta"
          ></v-autocomplete>
          <v-autocomplete
            :items="questions"
            v-model="selectedQuestion"
            item-text="label"
            item-value="code"
            label="Pregunta"
          ></v-autocomplete>
          <v-btn @click="format">Relacionar</v-btn>
          <v-btn @click="cancel">Cancelar</v-btn>
        </form>
      </v-card-text>
    </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex'
export default {
  props: ['arrIndex'],
  data () {
    return {
      selectedPoll: null,
      currentPoll: {},
      selectedQuestion: null,
      dataResponse: null,
      questions: []
    }
  },
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    ...mapActions('config-polls', { findConfigPolls: 'find' }),
    ...mapActions('config-polls', {getPoll: 'get'}),
    format () {
      if (this.selectedPoll && this.selectedQuestion) {
        let relation = {
          poll: this.selectedPoll,
          question: this.selectedQuestion
        }
        this.dataResponse.related.push(relation)
        this.currentPoll.formatedConfiguration[this.arrIndex] = this.dataResponse
        this.save(this.currentPoll)
      }
    },
    save (values) {
      const {ConfigPoll} = this.$FeathersVuex
      let config = new ConfigPoll(values)
      config.save().then(result => {
        this.setSnackMessage('Rregunta relacionada almacenada')
        this.setShowSnack(true)
        this.$emit('close')
      }).catch(err => console.log('este es el error', err))
    },
    cancel () {
      this.$emit('close')
    }
  },
  computed: {
    ...mapGetters('config-polls', {findConfigPollsInStore: 'find'}),
    getConfigPolls () {
      return this.findConfigPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  created () {
    this.findConfigPolls({ query: {removed: false} })
  },
  mounted () {
    this.getPoll(this.$route.params.id).then(result => {
      this.currentPoll = Object.assign({}, result)
      this.dataResponse = Object.assign({}, this.currentPoll.formatedConfiguration[this.arrIndex])
      this.dataResponse.related = (this.dataResponse.related) ? this.dataResponse.related : []
    })
  },
  watch: {
    selectedPoll (value) {
      this.selectedQuestion = null
      this.getPoll(value).then(result => {
        let resultPoll = Object.assign({}, result)
        this.questions = resultPoll.formatedConfiguration
      })
    }
  }
}
</script>

<style scoped>

</style>
