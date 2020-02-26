<template>
  <v-card
    v-bind="$attrs"
    :style="styles"
    v-on="$listeners"
  >
      <v-card
        :color="color"
        :class="`elevation-${elevation}`"
        class="v-card--material__header"
        dark
      >
      <span style="">
        <h4 style="font-weight: bold; margin-left: 10px;padding-top:10px; text-transform: uppercase;"
          class="title mb-2"
          v-text="title"
        >
      </h4>
      </span>
      <span>
        <v-icon
          size="40"
        >
        equalizer
        </v-icon>
      </span>
      </v-card>

      <v-container fluid
      grid-list-lg>
          <v-layout row wrap>
            <v-flex xs6 v-for="(question, i) in getQuestionsPage" v-if='question.columnChart.length > 0'
            :key="i">
            <v-card>
              <result-question :question="question" :index="i" @openModalQuestionDetail="openModal" @openModalDerive="openModalDerive" :isViewDetail="isViewDetail" ></result-question>
            </v-card>
            </v-flex>
          </v-layout>
    </v-container>

  </v-card>
</template>

<script>
import ResultQuestion from './ResultQuestion'
export default {
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: 'secondary'
    },
    questions: {
      type: Array
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    offset: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    questionsPage: [],
    isViewDetail: false,
    listQuestions: []
  }),
  methods: {
    openModal (question) {
      this.$emit('openModalQuestionDetail', question)
    },
    openModalDerive (question) {
      this.$emit('openModalDerive', question)
    }
  },
  computed: {
    getQuestionsPage () {
      return this.listQuestions.filter(filterQuestion => {
        if (filterQuestion.page === this.title && filterQuestion.columnChart) {
          return filterQuestion
        }
      })
    },
    getQuestionsNewPage () {
      return this.listQuestions.filter(filterQuestion => {
        if (filterQuestion.page === this.title && filterQuestion.questionCombination === true) {
          return filterQuestion
        }
      })
    },
    hasOffset () {
      return this.$slots.header ||
        this.$slots.offset ||
        this.title ||
        this.text
    },
    styles () {
      if (!this.hasOffset) return null

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`
      }
    }
  },
  created () {
    this.listQuestions = this.questions
  },
  components: {ResultQuestion}
}
</script>

<style lang="scss">

</style>
