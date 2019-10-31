<template>
  <v-card
  >
  <div style="margin-bottom: 20px;">
    <label style="margin-left: 20px;font-weight:bold;">
      <span style="margin-right: 10px;">
        <v-icon
          style="padding-top: 15px;"
          size="20"
          color="blue"
        >
        adjust
        </v-icon>
      </span>Pregunta: <span>{{currentQuestion.label}}</span>
    </label>
  </div>
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
