<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Editar Acta</v-subheader>
                <electoral-records-form @dataSubmited="create" :currentRecord="currentRecord"></electoral-records-form>
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
import {mapState, mapActions} from 'vuex'
import ElectoralRecordsForm from './ElectoralRecordsForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      currentRecord: null
    }
  },
  methods: {
    ...mapActions('electoral-records', { getRecord: 'get' }),
    create (values) {
      // method with feathers vuex to create an category project
      const { ElectoralRecord } = this.$FeathersVuex
      const record = new ElectoralRecord(values)
      record.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/electoral-projects')
    }
  },
  created () {
    this.getRecord(this.$route.params.id).then(result => {
      this.currentRecord = Object.assign({}, result)
    }).catch(err => console.log('este es el error', err))
  },
  computed: {
    ...mapState('restfuls', {loading: 'isCreatePending'})
  },
  components: {ElectoralRecordsForm, LoadingComponent}
}
</script>

<style>

</style>
