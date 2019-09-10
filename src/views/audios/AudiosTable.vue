<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Listado de Audios</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="elements"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td>
                        <div class="mt-1">
                          <v-avatar
                          class="mt-1 mb-1 elevation-5"
                          :tile="false"
                          :size="50"
                        >
                          <v-img
                              :src="props.item.image ? `${currentEnv}/${props.item.image}`: require('./../../assets/placeholder.png')"
                              :lazy-src="props.item.image ? `${currentEnv}/${props.item.image}`: ''"
                              aspect-ratio="0.5"
                              class="grey lighten-2"
                              max-height="400"
                            >
                              <v-layout
                                slot="placeholder"
                                fill-height
                                align-center
                                justify-center
                                ma-0
                              >
                                <v-progress-circular v-if="loading" indeterminate ></v-progress-circular>
                              </v-layout>
                          </v-img>
                        </v-avatar>
                        </div>
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
                          <span v-if="props.item.textReady">

                              <v-icon style="color: #6bef53;">check_circle</v-icon>
                              listo
                          </span>
                          <span v-else>
                              <v-icon style="color: #ed6a0d;">refresh</v-icon>
                              Espere...</span>
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
                            <v-list-tile @click="goToEdit(props.item)">
                              <v-list-tile-title>Ver información</v-list-tile-title>
                            </v-list-tile>
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
import {mapState, mapGetters} from 'vuex'

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
    goToNew () {
      this.$router.push('/audios-new')
    },
    goToEdit (audio) {
      this.$router.push('/audios-edit/' + audio._id)
    },
    edit (val, elem, field) {
      console.log('esto', val, elem, field)
      const {Actor} = this.$FeathersVuex
      const actor = new Actor(elem)
      actor[field] = val
      actor.patch().then((result) => {
      })
    },
    del (element) {
      const {Audio} = this.$FeathersVuex
      const audio = new Audio(element)
      audio.removed = true
      audio.save().then((result) => {
        console.log('se cambio', result)
        this.$emit('delActor')
      })
    },
    save (val) {
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
    }
  },
  computed: {
    ...mapState('audios', {loading: 'isFindPending'}),
    ...mapState('audios', { paginationVal: 'pagination' }),
    ...mapState([
      'currentEnv'
    ]),
    ...mapGetters('audios', {findActorsInStore: 'find'}),
    getSkip () {
      return this.page === 1 ? 0 : Math.round(((this.page - 1) * this.limit))
    }
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>

</style>
