<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de categorias de actores</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="elements"
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
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  props: {
    elements: Array,
    headers: Array
  },
  data () {
    return {
      message: '',
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 20,
      total: 1,
      loaded: false,
      clients: [],
      query: {}
    }
  },
  methods: {
    ...mapActions('actor-categories', { findActors: 'find' }),
    goToNew () {
      this.$router.push('/new-actor')
    },
    edit (val, elem, field) {
      const {Actor} = this.$FeathersVuex
      const actor = new Actor(elem)
      actor[field] = val
      actor.patch().then((result) => {
      })
    },
    del (element) {
      console.log('este hay que borrar', element)
      const {ActorCategory} = this.$FeathersVuex
      const actor = new ActorCategory(element)
      actor.removed = true
      actor.save().then((result) => {
        this.$emit('delActor')
      })
    },
    save (val) {
      console.log(val)
      this.snack = true
      this.snackColor = 'success'
      this.snackText = 'Data saved'
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Canceled'
    },
    open () {
      this.snack = true
      this.snackColor = 'info'
      this.snackText = 'Dialog opened'
    },
    close (val) {
      console.log('Dialog closed', val)
    },
    loadActors () {
      this.findActors({$skip: this.getSkip, $limit: this.limit, removed: false, ...this.query}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.clients = response.data
      })
    }
  },
  computed: {
    ...mapState('actor-categories', {loading: 'isFindPending'}),
    ...mapState('actos', { paginationVal: 'pagination' }),
    ...mapState([
      'currentEnv'
    ]),
    ...mapGetters('actor-categories', {findActorsInStore: 'find'}),
    getActors () {
      return this.findActorsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, ...this.query}}).data
    },
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
