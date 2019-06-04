<template>
   <v-form>
       <v-container>
           <v-layout xs12 offset-xs1>
                <v-flex xs12>
                    <v-text-field
                        v-model="currentQuestion.text"
                        label="Texto de la pregunta:"
                        box
                    ></v-text-field>
                    <v-autocomplete
                      :items="listTypeQuestion"
                      v-model="currentQuestion.type"
                      label="Tipo de pregunta:"
                    ></v-autocomplete>

                    <v-autocomplete
                      :items="categories"
                      v-model="selectedCoding"
                      item-text="name"
                      @change="changeCategory"
                      item-value="_id"
                      label="Categoría:"
                    ></v-autocomplete>
                    <v-autocomplete
                      :items="getSubCategories"
                      v-model="selectedSubCategory"
                      item-text="name"
                      @change="changeSubCategory"
                      label="Sub-Categoría:"
                      return-object
                    ></v-autocomplete>
                    <v-autocomplete
                      :items="listGraphicType"
                      v-model="selectedgraphicType"
                      @change="changeGraphicType"
                      label="Tipo de gráfico:"
                    ></v-autocomplete>
                    <v-checkbox
                      v-model="currentQuestion.typeMatrix"
                      label="Tipo matriz:"
                    ></v-checkbox>
                    <v-btn @click="save">Guardar</v-btn>
                </v-flex>
           </v-layout>
       </v-container>
   </v-form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  props: ['masterCurrent'],
  data: (state) => ({
    currentQuestion: {
      text: '',
      label: '',
      category_questions: {
        name: '',
        _id: null
      },
      subcategory_questions: {
        name: '',
        _id: null
      },
      type: '',
      options: null,
      typeMatrix: false,
      graphic_type: 'bar'
    },
    listGraphicType: ['column', 'bar', 'pie', 'line'],
    listTypeQuestion: ['ABIERTA', 'SELECCION MULTIPLE', 'SELECCION UNICA'],
    categories: [],
    selectedCoding: null,
    selectedSubCategory: null,
    selectedgraphicType: 'bar'
  }),
  methods: {
    ...mapActions('category-questions', { findCodingQuestions: 'find' }),
    ...mapActions('question-categories', { findQuestionCategories: 'find' }),
    changeCategory (selected) {
      this.currentQuestion.category_questions = this.categories.filter(data => data._id === selected)[0]
    },
    changeGraphicType (selected) {
      this.currentQuestion.graphic_type = selected
    },
    changeSubCategory (selected) {
      this.currentQuestion.subcategory_questions = selected
    },
    save () {
      this.$emit('save', Object.assign({}, this.currentQuestion))
    }
  },
  computed: {
    ...mapGetters('question-categories', {findQuestionCategoriesInStore: 'find'}),
    getSubCategories () {
      return this.findQuestionCategoriesInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    }
  },
  watch: {
    masterCurrent (val) {
      if (val) {
        this.currentQuestion = val
        this.selectedCoding = val.category_questions._id
        this.category_questions = val.category_questions
        this.selectedgraphicType = val.graphic_type
        this.selectedSubCategory = val.subcategory_questions
      }
    }
  },
  created () {
    this.findCodingQuestions({ query: {removed: false, $skip: 0, $limit: null} }).then(response => {
      this.categories = response.data
    })
    this.findQuestionCategories({ query: {removed: false, $limit: null, $skip: 0} })
  },
  components: {}
}
</script>
