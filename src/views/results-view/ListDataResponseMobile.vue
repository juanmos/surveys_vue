<template>
<div >
    <v-container fluid grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Encuestas moviles</v-subheader>
              <v-card-title>
                <v-flex xs6>
                    <!-- <v-select
                     v-model="selectedUser"
                     v-bind:items="users"
                     item-text="name"
                     item-value="_id"
                     label="Encuestador"
                     ></v-select> -->
                    <!-- <v-text-field
                            v-model="search"
                            @keyup.enter="searchUserName"
                            @keyup.space="searchUserName"
                            append-icon="search"
                            label="Buscar por nombre..."
                            single-line
                            hide-details
                          ></v-text-field> -->
                </v-flex>
                <v-flex xs6>
                    <label>TOTAL DE ENCUESTAS: {{total}}</label>
                </v-flex>
              </v-card-title>
            <v-data-table
                  :headers="headers"
                  :items="listMobilePolls"
                  hide-actions
                  item-key="_id"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="justify-left">
                        ENCUESTA - {{ props.index + 1}}
                      </td>
                      <td class="justify-center layout px-0">
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
                            <v-list-tile @click="goToViewPoll(props.index)">
                              <v-list-tile-title >Ver encuesta</v-list-tile-title>
                            </v-list-tile>
                          </v-list>
                        </v-menu>
                      </td>
                    </tr>
                  </template>
                </v-data-table>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList()"
                >
                    <v-icon>list</v-icon>
                </v-btn>
                <loading-component v-if="loading"></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import ViewDataResponsePoll from './ViewDataResponsePoll'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  data () {
    return {
      headers: [
        {
          text: 'N. Enecuesta',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: 'Acciones',
          sortable: false
        }
      ],
      id: null,
      search: '',
      dialog: false,
      selectedPoll: null,
      total: 0,
      dialogViewPoll: false,
      message: '',
      showMsg: false,
      listMobilePolls: [],
      msgType: 'error',
      itemSelected: null,
      loaded: false,
      query: {}
    }
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    goToDetailUser (userId) {
      // this.$router.push({ path: `/view-detail-mobile-results/${this.id}/${userId}` })
    },
    goToList () {
      this.$router.go(-1)
    },
    goToViewPoll (index) {
      this.$router.push({ path: `/view-data-response/${this.id}/${index}` })
    },
    getDataConfig () {
      this.getPoll(this.id).then(result => {
        this.listMobilePolls = [...result.formatAnswersMobile]
      }).catch(err => console.log('este es el error', err))
    }
  },
  computed: {
    ...mapGetters('config-polls', {findMobileSurveyInStore: 'get'}),
    ...mapState('config-polls', {loading: 'isFindPending'})
  },
  watch: {},
  mounted () {
    this.id = this.$route.params.id
    this.getDataConfig()
  },
  components: {LoadingComponent, ViewDataResponsePoll}
}
</script>

<style>
.justify-left {
    text-align: left;
}
</style>
