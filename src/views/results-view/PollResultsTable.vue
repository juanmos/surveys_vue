<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            hide-actions
            class="elevation-1 resultsTable"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value, key) in props.item" :key="String(value) + Math.random()">
                    <span v-if="variablesMode && (key === 'values' || key === 'label')" @click="editLabelDialog = true; currentEdit = props.item[key]; fieldSelected = key; arrIndex = props.index">
                        {{ props.item[key] }}
                    </span>
                    <span v-else>
                    <v-chip v-if="key === 'actor'" dark :color="grey-darken-4" class="font-weight-bold" v-for="(actorQuestion, index) in props.item.actors" :key="index">
                            <avatar :image="actorQuestion.image">
                            </avatar>
                            {{actorQuestion.code}}
                    </v-chip>
                      <v-chip dark :color="key === 'category' ? 'primary' : 'grey-darken-4'" class="font-weight-bold" v-if="(key ==='category' || key === 'actor') && props.item[key]">
                        <avatar :image="props.item[key].image" v-if="key === 'actor'">
                        </avatar>
                        {{ key === 'actor' ? props.item[key].code : props.item[key] }}
                      </v-chip>
                    </span>
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
                      <v-list-tile @click="dialogCategories = true;arrIndex = props.index; fieldSelected = 'category'">
                          <v-list-tile-title>Agregar Categoria</v-list-tile-title>
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
    </div>
</template>

<script>
import LabelsEditor from './../../components/forms/LabelsEditor'
import LabelsPollEditor from './../../components/forms/LabelsPollEditor'
import CategoriesEditor from './../../components/forms/CategoriesEditor'
import RelatedQuestion from './RelatedQuestion'
import RelatedActorQuestion from './RelatedActorQuestion'
import Avatar from './../../components/Avatar'
export default {
  props: ['responses', 'headers', 'variablesMode', 'currentPoll'],
  data () {
    return {
      editLabelDialog: false,
      dialogRelated: false,
      dialogCategories: false,
      dialogActors: false,
      currentEdit: null,
      fieldSelected: '',
      arrIndex: null
    }
  },
  methods: {
    editVariables (value) {
      console.log(value, this.arrIndex, this.fieldSelected)
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
    },
    refresh () {
      this.dialogActors = false
      this.$emit('refresh')
    }
  },
  components: { LabelsEditor, LabelsPollEditor, RelatedQuestion, RelatedActorQuestion, CategoriesEditor, Avatar }
}
</script>

<style scoped>

</style>
