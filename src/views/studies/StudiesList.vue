<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>

        <v-flex xs3>
            <v-card :light="true" >

               <v-card-title>Test</v-card-title>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn icon>
                    <v-icon color="indigo">visibility</v-icon>
                  </v-btn>
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
      const {User} = this.$FeathersVuex
      const user = new User(elem)
      user[field] = val
      user.patch().then((result) => {
        this.findStudies({ query: {removed: false} }).then(response => {
          const studies = response.data || response
          console.log(studies)
        })
      })
    },
    del (element) {
      const {User} = this.$FeathersVuex
      const user = new User(element)
      user.removed = true
      user.patch().then((result) => {
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

</style>
