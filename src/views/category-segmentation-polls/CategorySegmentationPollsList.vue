<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
              <v-subheader>Categorias de segmentos asigandos para la Encuesta</v-subheader>
            <v-data-table
                  :headers="headers"
                  :items="getCategorySegmentationPolls"
                  hide-actions
                  item-key="name"
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                        <td class="text-xs-left">{{props.item.name}}</td>
                        <td class="text-xs-left">{{props.item.description}}</td>
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
                            <v-list-tile @click="edita(props.item._id)">
                              <v-list-tile-title>Editar</v-list-tile-title>
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
                <loading-component v-if="loading
                "></loading-component>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
     <confirm-dialog :dialog="dialog" :dialogTitle="dialogTitle"  :dialogText="dialogText" @onConfirm="onConfirm" @onCancel="onCancel" ></confirm-dialog>
</div>
</template>

<script>
import {mapState, mapGetters, mapActions} from 'vuex'
import {validations} from './../../utils/validations'
import EditableField from './../../components/forms/EditableField'
import LoadingComponent from './../../components/docaration/LoadingComponent'
import ConfirmDialog from './../../components/ConfirmDialog.vue'
export default {

  data () {
    return {
      dialog: false,
      dialogTitle: 'Eliminar categoria de segmentación',
      dialogText: 'Desea eliminar este segmentación?',
      headers: [
        { text: 'Nombre',
          value: 'name',
          sortable: true
        },
        {
          text: 'Descripción',
          value: 'description',
          sortable: false
        },
        { text: 'Acciones',
          value: 'name',
          sortable: false
        }
      ],
      MyRules: [
        v => !!v || 'El campo es requerido'
        // v => v.length <= 10 || 'Name must be less than 10 characters'
      ],
      rules: validations,
      message: '',
      project: null,
      showMsg: false,
      msgType: 'error',
      page: 1,
      limit: 10,
      total: 1,
      loaded: false,
      roles: [],
      query: {},
      rolId: ''
    }
  },
  methods: {
    ...mapActions('category-segmantation-polls', { findCategorySegmentationPolls: 'find' }),
    ...mapActions([
      'setSnackMessage',
      'setShowSnack'
    ]),
    goToNew () {
      this.$router.push('/category-segmentation-polls-new/' + this.project)
    },
    edita (id) {
      this.$router.push('/category-segmentation-polls-edit/' + id)
    },
    del (element) {
      this.dialogTitle = 'Eliminar Rol : ' + element.name
      this.dialog = true
      this.rolId = element
    },
    onConfirm () {
      const {Role} = this.$FeathersVuex
      let rolesdelete = new Role(this.rolId)
      rolesdelete.removed = true
      rolesdelete.patch().then((result) => {
        this.getData()
        this.setSnackMessage('Rol Eliminado')
        this.setShowSnack(true)
      })
      this.dialog = false
    },
    onCancel () {
      this.rolId = ''
      this.dialog = false
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
    },
    getData () {
      this.findCategorySegmentationPolls({query: {removed: false, $skip: 0}}).then(response => {
        this.limit = response.limit
        this.total = response.total
        this.loaded = true
        this.roles = response.data
      })
    }
  },
  computed: {
    ...mapState('category-segmantation-polls', {loading: 'isFindPending'}),
    ...mapState('category-segmantation-polls', { paginationVal: 'pagination' }),
    ...mapGetters('category-segmantation-polls', {findCategorySegmentationPollsInStore: 'find'}),
    ...mapState('auth', { user: 'user' }),
    getCategorySegmentationPolls () {
      return this.findCategorySegmentationPollsInStore({query: {removed: false, $skip: this.getSkip, $limit: this.limit, _project_poll_id: this.project, ...this.query}}).data
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
      this.findCategorySegmentationPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, _project_poll_id: this.project, ...this.query}}).then(response => {
        this.limit = response.limit
        this.total = response.total
      })
    }
  },
  created () {
    this.project = this.$route.params._id
    this.findCategorySegmentationPolls({query: {removed: false, $skip: this.getSkip, $limit: this.limit, _project_poll_id: this.project, ...this.query}}).then(response => {
      this.limit = response.limit
      this.total = response.total
      this.loaded = true
      this.roles = response.data
    })
  },
  components: {LoadingComponent, EditableField, ConfirmDialog}
}
</script>

<style scoped>

</style>
