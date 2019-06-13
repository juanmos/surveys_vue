<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            hide-actions
            class="elevation-1 resultsTable"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" style="margin-top:5px;">
                    <div class="numberCircle">
                        {{props.item.code}}
                    </div>
                </td>
                <td>
                    <div class="">
                        <br />
                        <br />
                        <label class="labelQuestion">Nombre:</label>
                        <span class="infoQuestion">{{props.item.name}}</span>
                        <br />
                        <label class="labelQuestion">Etiqueta:</label>
                        <span class="infoQuestion">{{props.item.label}}</span>
                        <br />
                        <br />
                        <label class="labelQuestion">Pregunta:</label>
                        <span class="infoQuestion">{{props.item.questionMaster}}</span>
                        <br />
                        <label class="labelQuestion">Categoría:</label>
                        <v-chip color="grey-darken-4" class="font-weight-bold complete">
                              {{props.item.category}}
                        </v-chip>
                        <br />
                        <br />
                        <label class="labelQuestion">Sub-Categoría:</label>
                        <v-chip color="grey-darken-4" class="font-weight-bold subCategory">
                              {{props.item.subcategory}}
                        </v-chip>
                        <br />
                        <label class="labelQuestion">Valores:</label>
                        <span class="infoQuestion">{{props.item.values}}</span>
                        <br />
                        <br />
                        <br />
                    </div>
                </td>
                <td class="text-xs-center">
                    <v-chip color="grey-darken-4" class="font-weight-bold actorsChip" v-for="(actorQuestion, index) in props.item.actors" :key="index">
                             <!-- <avatar :image="actorQuestion.image">
                             </avatar> -->
                              {{actorQuestion}}
                      </v-chip>
                </td>
                <td class="justify-center layout px-0">
                  <v-menu v-if="variablesMode"
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
                      <v-list-tile @click="dialogActors = true;arrIndex = props.index">
                          <v-list-tile-title>Agregar Actores</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="dialogRelated = true;arrIndex = props.index">
                          <v-list-tile-title>Agregar relacionados</v-list-tile-title>
                      </v-list-tile>
                      <v-list-tile @click="dialogMasterQuestions = true;arrIndex = props.index; fieldSelected = 'category'">
                          <v-list-tile-title>Relacionar con el master de preguntas</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
            </template>
        </v-data-table>
        <v-dialog
          v-model="editLabelDialog"
          max-width="600"
          >
          <labels-editor @close="editLabelDialog = false" v-if="fieldSelected === 'values'" :values="currentEdit"></labels-editor>
          <labels-poll-editor @saveValue="editVariables" @close="editLabelDialog = false" :value="currentEdit" v-else></labels-poll-editor>
        </v-dialog>

        <v-dialog v-model="dialogRelated" max-width="900">
          <v-card v-if="dialogRelated">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4>Pregunta relacionada</h4>
            </v-flex>
            <v-card-text>
              <related-question :arrIndex="arrIndex" @close="dialogRelated = false"></related-question>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogActors" max-width="900">
          <v-card v-if="dialogActors">
            <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
              <h4>Relacionar actores</h4>
            </v-flex>
            <v-card-text>
              <related-actor-question :arrIndex="arrIndex" @close="dialogActors = false" @refresh="refresh"></related-actor-question>
            </v-card-text>
          </v-card>
        </v-dialog>

        <v-dialog v-model="dialogCategories" max-width="900">
          <categories-editor @saveValue="editVariables" :arrIndex="arrIndex" @close="dialogCategories = false"></categories-editor>
        </v-dialog>

        <v-dialog v-model="dialogMasterQuestions" min-width="900">
            <v-card v-if="dialogMasterQuestions">
              <v-flex xs12 style="background: #d9323a;color: white;height: 45px;padding: 12px;">
                <h4>Seleccionar Master</h4>
              </v-flex>
              <v-card-text>
                <master-questions-editor @refresh="refresh" :arrIndex="arrIndex" @close="dialogMasterQuestions = false"></master-questions-editor>
              </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import LabelsEditor from './../../components/forms/LabelsEditor'
import LabelsPollEditor from './../../components/forms/LabelsPollEditor'
import CategoriesEditor from './../../components/forms/CategoriesEditor'
import MasterQuestionsEditor from './../../components/forms/MasterQuestionsEditor'
import RelatedQuestion from './RelatedQuestion'
import RelatedActorQuestion from './RelatedActorQuestion'
import Avatar from './../../components/Avatar'
export default {
  props: ['responses', 'variablesMode', 'currentPoll'],
  data () {
    return {
      headers: [
        {
          text: 'Código',
          align: 'center',
          sortable: false,
          value: 'name'
        },
        { text: 'Información',
          value: 'info',
          sortable: false
        },
        { text: 'Actores',
          align: 'center',
          value: 'actors',
          sortable: false
        },
        { text: 'Acciones',
          value: 'options',
          sortable: false
        }
      ],
      editLabelDialog: false,
      dialogRelated: false,
      dialogCategories: false,
      dialogActors: false,
      dialogMasterQuestions: false,
      currentEdit: null,
      fieldSelected: '',
      arrIndex: null
    }
  },
  methods: {
    editVariables (value) {
      let copyResponses = this.responses.slice().map(response => ({
        original: response.name,
        label: response.label,
        options: response.values,
        code: response.code
      }))
      copyResponses[this.arrIndex][this.fieldSelected] = value
      this.$emit('saveFormated', copyResponses)
      this.editLabelDialog = false
      this.dialogCategories = false
      this.dialogMasterQuestions = false
    },
    refresh () {
      this.dialogActors = false
      this.dialogMasterQuestions = false
      this.$emit('refresh')
    }
  },
  components: { LabelsEditor, LabelsPollEditor, RelatedQuestion, RelatedActorQuestion, CategoriesEditor, MasterQuestionsEditor, Avatar }
}
</script>

<style scoped>
.complete {
    background-color: #407a42 !important;
    border-color: #407a42 !important;
    height: 20px !important;
    font-size: 11px !important;
    color: #eaedea !important;
}
.subCategory {
    background-color: #1e6ca3 !important;
    border-color: #1e6ca3 !important;
    height: 20px !important;
    font-size: 11px !important;
    color: #eaedea !important;
}

.actorsChip {
    background-color: #eaedea !important;
    border-color: #eaedea !important;
    color: #333 !important;
}

.infoQuestion{
    font-size: 12px;
}
.labelQuestion{
    font-size: 12px;
    font-weight: bold;
}

.questionDiv:hover {
    background-color: #858282 !important;
}
.questionRow {
    border-style: solid;
     border-width: 0.3px;
}
.numberCircle {
    width: 55px;
    line-height: 55px;
    border-radius: 50%;
    text-align: center;
    background-color: #1e1d1d;
    font-weight: bold;
    font-size: 16px;
    margin: 5px;
    border: 2px solid #dd6b6b;
}
</style>
