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
      <span>
        <h4
          class="title mb-2"
          v-text="title"
        />
      </span>
      </v-card>

      <v-container fluid
      grid-list-lg>
          <v-layout row wrap>
            <v-flex xs12 v-for="(question, i) in questionsPage"
            :key="i">
            <v-card >
              <result-question :question="question"></result-question>
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
  data: (state) => ({
    questionsPage: []
  }),
  methods: {
    getQuestionsPage (questions) {
      this.questionsPage = questions.filter(question => question.page === this.title)
    }
  },
  computed: {
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
    // console.log('questions--', this.questions);
    this.getQuestionsPage(this.questions)
  },
  watch: {
    questions: function (val) {
      // this.getQuestionsPage(val)
    }
  },
  components: {ResultQuestion}
}
</script>

<style lang="scss">

</style>
