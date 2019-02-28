<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            class="elevation-1 resultsTable"
            :rows-per-page-items="[100, 200, 300, 400]"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value, key) in props.item" :key="String(value) + Math.random()">
                    <span v-if="variablesMode && (key === 'values' || key === 'label')" @click="editLabelDialog = true; currentEdit = props.item[key]; fieldSelected = key; arrIndex = props.index">
                        {{ props.item[key] }}
                    </span>
                    <span v-else>{{ props.item[key] }}</span>
                </td>
                <td class="justify-center layout px-0" v-if="variablesMode">
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
                      <v-list-tile @click="dialogRelated = true;arrIndex = props.index">
                          <v-list-tile-title>Agregar relacionados</v-list-tile-title>
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
            <v-flex xs12 style="background:#d9323a;color:white;height:45px;padding: 12px;">
              <h4 for="">Pregunta relacionada</h4>
            </v-flex>
            <v-card-text>
              <related-question :arrIndex="arrIndex" @close="dialogRelated = false"></related-question>
            </v-card-text>
          </v-card>
        </v-dialog>
    </div>
</template>

<script>
import LabelsEditor from './../../components/forms/LabelsEditor'
import LabelsPollEditor from './../../components/forms/LabelsPollEditor'
import RelatedQuestion from './RelatedQuestion'
export default {
  props: ['responses', 'headers', 'variablesMode', 'currentPoll'],
  data () {
    return {
      editLabelDialog: false,
      dialogRelated: false,
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
    }
  },
  components: { LabelsEditor, LabelsPollEditor, RelatedQuestion }
}
</script>

<style scoped>

</style>
