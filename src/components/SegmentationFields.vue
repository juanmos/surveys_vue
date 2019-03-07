<template>
    <v-layout row wrap>
        <v-flex xs12 sm2 md2>
            <v-flex xs12>
                <draggable v-model="questionsList" :options="{group:'questions'}">
                <template v-for="item in questionsList">
                    <v-flex :key="item.original + Math.random()">
                        <v-card class="mr-2 ml-2 mb-2 mt-2" dark :color="`primary`">
                            <v-card-title>{{item.label}}</v-card-title>
                        </v-card>
                    </v-flex>
                </template>
            </draggable>
            </v-flex>
        </v-flex>
        <v-flex xs12 sm10 md10>
            <draggable class="segmentationField" v-model="segmentationFields" :options="{group:'questions'}">
                <template v-for="item in segmentationFields">
                    <v-flex :key="item.original">
                        <v-card class="mr-2 ml-2 mb-2 mt-2" dark :color="`primary`">
                            <v-card-title>{{item.label}}<v-spacer></v-spacer> <v-btn @click="delSegment(item.code)" icon><v-icon>cancel</v-icon></v-btn></v-card-title>
                        </v-card>
                    </v-flex>
                </template>
            </draggable>
        </v-flex>
    </v-layout>
</template>
<script>
import draggable from 'vuedraggable'
import {mapState, mapActions} from 'vuex'
export default {
  props: ['questions', 'poll'],
  data: () => ({
    questionsList: [],
    segmentationFields: []
  }),
  methods: {
    delSegment (code) {
      this.segmentationFields = this.segmentationFields.filter(segmentation => segmentation.code !== code)
    },
    ...mapActions([
      'setCurrentPoll'
    ])
  },
  computed: {
    ...mapState([
      'currentPoll'
    ])
  },
  mounted () {
    this.questionsList = this.questions ? this.questions.slice() : []
  },
  watch: {
    segmentationFields (value) {
      if (this.currentPoll) {
        const { ConfigPoll } = this.$FeathersVuex
        let poll = new ConfigPoll(Object.assign({}, this.currentPoll))
        poll.segmentationFields = value ? value.filter(val => val.code).slice() : []
        poll.save().then(result => {
          this.setCurrentPoll(result)
        })
      }
    },
    questions (q) {
      this.questionsList = q ? q.slice() : []
      this.segmentationFields = this.currentPoll ? this.currentPoll.segmentationFields ? this.currentPoll.segmentationFields.slice() : [] : []
    }
  },
  components: { draggable }
}
</script>
<style scoped>
 .segmentationField {
    height: 100%;
    background-color: #ccc
 }
</style>
