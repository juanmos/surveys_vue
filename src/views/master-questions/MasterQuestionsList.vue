<template>
    <div>
      <v-container grid-list-md text-xs-center>
          <v-layout row wrap>
              <v-flex xs12>
                  <v-card :flat="true">
                    <v-card-title>
                        <span class="title">Master de preguntas
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn to="/master-questions-new" class="deep-orange darken-3" fab small dark>
                        <v-icon>add</v-icon>
                        </v-btn>
                    </v-card-title>
                    <v-data-table
                          :headers="headers"
                          :items="masterQuestions"
                          hide-actions
                          item-key="name"
                        >
                          <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                              <td class="text-xs-left">
                                {{props.item.text}}
                              </td>
                              <td class="text-xs-left">
                                  {{props.item.category_questions.name}}
                              </td>
                              <td class="text-xs-left">
                                  {{props.item.type}}
                              </td>
                              <td class="text-xs-left">
                                <v-checkbox
                                  v-model="props.item.typeMatrix"
                                  v-on:change="saveEdit(props.item)"
                                  label="Tipo matriz"
                                ></v-checkbox>
                              </td>
                              <td>
                                <v-menu
                                  bottom
                                  transition="slide-y-transition"
                                >
                                  <v-btn
                                    slot="activator"
                                    color="primary"
                                    flat
                                    icon
                                  >
                                  <v-icon>more_vert</v-icon>
                                  </v-btn>
                                  <v-list>
                                    <v-list-tile @click="edit(props.item)">
                                      <v-list-tile-title>Editar</v-list-tile-title>
                                    </v-list-tile>
                                  </v-list>
                                  <v-list>
                                    <v-list-tile @click="del(props.item)">
                                      <v-list-tile-title>Eliminar</v-list-tile-title>
                                    </v-list-tile>
                                  </v-list>
                                </v-menu>
                              </td>
                            </tr>
                          </template>
                        </v-data-table>
                        <loading-component v-if="loading
                        "></loading-component>
                    <v-layout justify-center>
                      <v-flex xs8>
                        <v-card flat>
                          <v-card-text>
                            <v-pagination
                              v-model="page"
                              :length="getLength"
                            ></v-pagination>
                          </v-card-text>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-card>
              </v-flex>
          </v-layout>
      </v-container>
    </div>
</template>

<script>
import {mapGetters, mapActions, mapState} from 'vuex'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data: () => ({
    page: 1,
    limit: 20,
    headers: [
      {
        text: 'Pregunta',
        align: 'left',
        value: 'text'
      },
      {
        text: 'Categoría',
        align: 'left',
        value: 'name',
        sortable: true
      },
      {
        text: 'Tipo de Pregunta',
        align: 'left',
        value: 'type',
        sortable: true
      },
      {
        text: 'Modificar',
        align: 'left',
        value: 'type',
        sortable: true
      }
    ],
    total: 100,
    loaded: false,
    masterQuestions: []
  }),
  computed: {
    ...mapGetters([
      'getPage'
    ]),
    ...mapGetters('master-questions', {getMasterQuestionInStore: 'find'}),
    ...mapState('master-questions', {loading: 'isFindPending'}),
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page (val) {
      this.findMasterQuestions({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.masterQuestions = response.data
      })
    }
  },
  methods: {
    ...mapActions('master-questions', {findMasterQuestions: 'find'}),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack',
      'setPage'
    ]),
    edit (master) {
      this.setPage(this.page)
      this.$router.push('/master-questions-edit/' + master._id)
    },
    saveEdit (question) {
      const {MasterQuestion} = this.$FeathersVuex
      let dataSave = new MasterQuestion(question)
      let that = this
      dataSave.save().then(result => {
        that.setSnackMessage('Pregunta master actualizada.')
        that.setShowSnack(true)
        // this.$router.push('/master-questions')
      }).catch(err => {
        console.log(err)
      })
    },
    refreshActors () {
      this.findMasterQuestions({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.masterQuestions = response.data
      })
    }
  },
  mounted () {
    console.log('page---', this.getPage)
    if (this.getPage) {
      this.page = this.getPage
    }
    this.findMasterQuestions({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.masterQuestions = response.data
    })
  },
  components: {LoadingComponent}
}
</script>
<style>
</style>
