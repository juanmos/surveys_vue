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
                    {{getElements}}
                    <v-data-table
                          :headers="headers"
                          :items="getElements"
                          hide-actions
                          item-key="name"
                        >
                          <template slot="items" slot-scope="props">
                            <tr @click="props.expanded = !props.expanded">
                              <td>
                              </td>
                              <td>
                                <v-edit-dialog
                                  :return-value.sync="props.item.name"
                                  lazy
                                  @save="edit(props.item.name, props.item, 'name')"
                                  @cancel="cancel"
                                  @open="open"
                                  @close="close"
                                > <div >{{ props.item.name }}</div>
                                  <v-text-field
                                    slot="input"
                                    v-model="props.item.name"
                                    label="Editar Nombre"
                                    single-line
                                    counter
                                  ></v-text-field>
                                </v-edit-dialog>
                              </td>
                              <td>
                                  <v-edit-dialog
                                    :return-value.sync="props.item.description"
                                    lazy
                                    @save="edit(props.item.description, props.item, 'description')"
                                    @cancel="cancel"
                                    @open="open"
                                    @close="close"
                                    > <div >{{ props.item.description }}</div>
                                    <v-text-field
                                        slot="input"
                                        v-model="props.item.description"
                                        label="Editar Descripcion"
                                        single-line
                                        counter
                                    ></v-text-field>
                                    </v-edit-dialog>
                              </td>
                              <td>
                                {{props.item.tags}}
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
        text: 'Categoria',
        value: 'name',
        sortable: true
      },
      {
        text: 'Tipo de Pregunta',
        value: 'type',
        sortable: true
      }
    ],
    total: 100,
    loaded: false,
    actors: []
  }),
  computed: {
    ...mapGetters('master-questions', {getMasterQuestionInStore: 'find'}),
    ...mapState('master-questions', {loading: 'isFindPending'}),
    getElements () {
      return this.getMasterQuestionInStore({removed: false}).data
    },
    getLength () {
      return Math.round((this.total / this.limit)) === 0 ? 1 : Math.round((this.total / this.limit)) + 1
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  watch: {
    page () {
      this.findMasterQuestions({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.actors = response.data
      })
    }
  },
  methods: {
    ...mapActions('master-questions', {findMasterQuestions: 'find'}),
    refreshActors () {
      this.findMasterQuestions({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.actors = response.data
      })
    }
  },
  mounted () {
    this.findMasterQuestions({query: {$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.actors = response.data
    })
  },
  components: {LoadingComponent}
}
</script>
<style>
</style>
