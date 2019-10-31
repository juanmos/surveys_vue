<template>
  <v-card
  >
    <label for="">Pregunta: <span>{{currentQuestion.label}}</span></label>
    <chart :question="currentQuestion" :graphicType="graphicType"></chart>
  </v-card>
</template>

<script>
import Chart from './../../components/highcharts/Chart'
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    }
  },
  data: (state) => ({
    currentQuestion: {},
    graphicType: 'column'
  }),
  methods: {
    getQuestionsPage (questions) {
      // this.questionsPage = questions.filter(question => question.page === this.title)
    }
  },
  computed: {
    get () {
      return this.$slots.header ||
        this.$slots.offset ||
        this.title ||
        this.text
    }
  },
  created () {
    // console.log('questions--', this.questions);
    this.currentQuestion = this.question
  },
  watch: {
    question: function (val) {
      // console.log('va---', val);
    }
  },
  components: {Chart}
}
</script>

<style lang="scss">

</style>
