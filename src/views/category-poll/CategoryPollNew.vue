<template>
<v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nueva Categoría</v-subheader>
                <category-form @dataSubmited="create"></category-form>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList"
                >
                    <v-icon>list</v-icon>
                </v-btn>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapState} from 'vuex'

import CategoryForm from './CategoryPollForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      const { CategoryPoll } = this.$FeathersVuex
      const CategoryPollF = new CategoryPoll(values)
      CategoryPollF.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/CategoryPollList/0')
    }
  },
  computed: {
    ...mapState('category-poll', {loading: 'isCreatePending'})
  },
  components: {CategoryForm, LoadingComponent}
}
</script>
<style>
</style>
