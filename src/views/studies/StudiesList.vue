<template>
<div>
    <loading-component v-if="loading"></loading-component>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex v-for="study in getStudies" :key="study._id" xs3>
            <v-card class="study-card" :light="true" >

               <v-card-title><editable-field @changeConfirmed="edit($event, study, 'name')"  :value="study.name" typeField="text"></editable-field></v-card-title>
                 <p  class="grey--text"><editable-field @changeConfirmed="edit($event, study, 'description')"  :value="study.description" typeField="text"></editable-field></p>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <div class="actions">
                    <v-btn icon>
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
    }
  },
  computed: {
    ...mapState('studies', {loading: 'isFindPending'}),
    ...mapGetters('studies', {findStudiesInStore: 'find'}),
    getStudies () {
      return this.findStudiesInStore({query: {removed: false}}).data
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
</style>
