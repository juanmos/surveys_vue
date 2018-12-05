<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <category-segmentation-polls-form :values="dataCategorySegmentationPolls" @dataSubmited="create"></category-segmentation-polls-form>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState, mapActions} from 'vuex'

import CategorySegmentationPollsForm from './CategorySegmentationPollsForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  data: (vm) => ({
    project: null,
    dataCategorySegmentationPolls: null,
    categorySegmentationCode: null
  }),
  methods: {
    ...mapActions('category-segmantation-polls', { findCategorySegmentationPolls: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToList () {
      this.$router.push('/category-segmentation-polls/' + this.project)
    },
    create (values) {
      const {CategorySegmantationPoll} = this.$FeathersVuex
      this.project = values._project_poll_id
      let categorySegmentationPoll = new CategorySegmantationPoll(values)
      categorySegmentationPoll.save().then((result) => {
        this.setSnackMessage('Categoria agregada a la encuesta')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    getData () {
      this.findCategorySegmentationPolls({query: {_id: this.categorySegmentationCode, removed: false, ...this.query}}).then(response => {
        this.dataCategorySegmentationPolls = response.data[0]
      })
    }
  },
  created () {
    this.categorySegmentationCode = this.$route.params._id
    this.getData()
  },
  computed: {
    ...mapState('category-segmantation-polls', {loading: 'isCreatePending'})
  },
  components: {CategorySegmentationPollsForm, LoadingComponent}
}
</script>
<style>
</style>
