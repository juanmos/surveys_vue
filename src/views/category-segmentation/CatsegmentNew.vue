<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <CatsegmentForm @dataSubmited="create"></CatsegmentForm>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState, mapActions} from 'vuex'

import CatsegmentForm from './CatsegmentForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToList () {
      this.$router.push('/category-segmentation')
    },
    create (values) {
      const {CategorySegmentation} = this.$FeathersVuex
      let saveCategorySegmentation = new CategorySegmentation(values)
      saveCategorySegmentation.save().then((result) => {
        this.setSnackMessage('Categoria Guardado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState('category-segmentation', {loading: 'isCreatePending'})
  },
  components: {CatsegmentForm, LoadingComponent}
}
</script>
<style>
</style>
