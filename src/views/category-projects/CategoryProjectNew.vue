<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nueva Categoría</v-subheader>
                <category-project-form @dataSubmited="create"></category-project-form>
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
import CategoryProjectForm from './CategoryProjectForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an category project
      const { CategoryProject } = this.$FeathersVuex
      const category = new CategoryProject(values)
      category.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/category-project')
    }
  },
  computed: {
    ...mapState('category-project', {loading: 'isCreatePending'})
  },
  components: {CategoryProjectForm, LoadingComponent}
}
</script>

<style>

</style>
