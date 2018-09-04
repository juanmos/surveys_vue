<template>
<div>
    <loading-component v-if="loading"></loading-component>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex v-for="study in getStudies" :key="study._id" xs4>
            <v-card class="study-card" :light="true" >
              <v-card-media
                src="https://images.unsplash.com/photo-1519419166318-4f5c601b8e6c?ixlib=rb-0.3.5&s=281a47878ba7292df40256a164dd3058&auto=format&fit=crop&w=3967&q=80"
                height="200px"
              >
              <v-layout
                column
                fill-height
              >
                <v-card-title>
                  <v-spacer></v-spacer>
                  <v-menu bottom left>
                    <v-btn
                      flat
                      slot="activator"
                      icon
                      color="indigo"
                    >
                      <v-icon>more_vert</v-icon>
                    </v-btn>

                    <v-list>
                      <v-list-tile>Editar Estudio</v-list-tile>
                      <v-list-tile>Cambiar Imagen</v-list-tile>
                    </v-list>
                  </v-menu>
                </v-card-title>

                <v-spacer></v-spacer>

                <v-card-title class="dark--text pl-5 pt-5">
                  <div class="display-1 pl-12 pt-12">{{ study.name }}</div>
                </v-card-title>
              </v-layout>
              </v-card-media>
                <v-list
                  subheader
                  three-line
                >
                  <v-subheader>
                    <v-edit-dialog
                        align= "center"
                        lazy
                        @save="edit(study.name, study, 'name')"
                      > {{ study.name }}
                        <v-text-field
                          slot="input"
                          v-model="study.name"
                          label="Editar Nombre"
                          single-line
                          counter
                        ></v-text-field>
                    </v-edit-dialog>
                  </v-subheader>
                  <v-divider></v-divider>

                  <v-list-tile>
                    <v-list-tile-content>
                      <v-list-tile-sub-title>
                        <p>
                          <v-edit-dialog
                            lazy
                            @save="edit(study.description, study, 'description')"
                          >  <v-list-tile-sub-title>{{ study.description }}</v-list-tile-sub-title>
                            <v-text-field
                              slot="input"
                              v-model="study.description"
                              label="Editar Descripcion"
                              single-line
                              counter
                            ></v-text-field>
                          </v-edit-dialog>
                        </p>
                      </v-list-tile-sub-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>
                <v-card-actions>
                  <v-btn flat>
                    {{study.customer.name}}
                  </v-btn>
                  <v-spacer></v-spacer>
                  <div class="actions">
                    <v-btn @click="goToDetail(study._id)" icon>
                      <v-icon color="indigo">visibility</v-icon>
                    </v-btn>
                    <v-btn @click="del(study)" icon>
                      <v-icon color="pink">delete</v-icon>
                    </v-btn>
                  </div>
                </v-card-actions>
              </v-card>
        </v-flex>
        <v-btn
          absolute
          dark
          fab
          small
          top
          right
          color="pink"
          @click="goToNew()"
          >
              <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'

import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      query: {
      },
      headers: [
        {
          text: 'Nombre',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        {
          text: 'Email',
          align: 'center',
          sortable: true,
          value: 'email'
        },
        {
          text: 'Acciones',
          align: 'center',
          sortable: false,
          value: 'email'
        }
      ],
      user: [],
      message: '',
      showMsg: false,
      msgType: 'error'
    }
  },
  methods: {
    ...mapActions('studies', { findStudies: 'find' }),
    goToNew () {
      this.$router.push('/new-studies')
    },
    getData () {
      let params = {query: {removed: false}}
      return this.$store.dispatch('studies/find', params)
    },
    edit (val, elem, field) {
      console.log(val, elem, field)
      const {Study} = this.$FeathersVuex
      const study = new Study(elem)
      study[field] = val
      study.patch().then((result) => {
        this.findStudies({ query: {removed: false} }).then(response => {
          const studies = response.data || response
          console.log(studies)
        })
      })
    },
    del (element) {
      const {Study} = this.$FeathersVuex
      const study = new Study(element)
      study.removed = true
      study.patch().then((result) => {
        this.findStudies({ query: {removed: false} }).then(response => {
          const studies = response.data || response
          console.log(studies)
        })
      })
    },
    goToDetail (id) {
      this.$router.push(`mesa-trabajo/boards/${id}`)
    }
  },
  computed: {
    ...mapState('studies', {loading: 'isFindPending'}),
    ...mapGetters('studies', {findStudiesInStore: 'find'}),
    getStudies () {
      return this.findStudiesInStore({query: {removed: false, ...this.query}}).data
    }
  },
  created () {
    this.findStudies({ query: {removed: false} }).then(response => {
      const studies = response.data || response
      console.log(studies)
    })
  },
  components: {LoadingComponent, EditableField}
}
</script>

<style scoped>
  .actions {
    opacity: 0;
  }
  .study-card:hover .actions {
    opacity: 1;
  }
  .study-title{
    margin: 10px;
    text-align: center;
  }
  .study-content {
    text-align: center;
  }
</style>
