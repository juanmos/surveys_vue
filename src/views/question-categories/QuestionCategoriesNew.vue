<template>
    <div>
      <v-container text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Categorias de Preguntas
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/question-categories" class="deep-orange darken-3" fab small dark>
                        <v-icon>list
                        </v-icon>
                        </v-btn>
                    </v-card-title>
                    <question-categories-form @saveCategory="saveCategory"></question-categories-form>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapActions} from 'vuex'
import QuestionCategoriesForm from './QuestionCategoriesForm'
export default {
  computed: {
  },
  methods: {
    ...mapActions('actors', {saveActor: 'save'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    saveCategory (categoryData) {
      const {QuestionCategory} = this.$FeathersVuex
      let category = new QuestionCategory(categoryData)
      category.save().then(result => {
        this.setSnackMessage('Categoria Guardada')
        this.setShowSnack(true)
        this.$router.push('/question-categories')
      }).catch(err => {
        console.log(err)
      })
    }
  },
  mounted () {
  },
  components: {QuestionCategoriesForm}
}
</script>

<style>

</style>
