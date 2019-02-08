<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="responses"
            class="elevation-1 resultsTable"
            :rows-per-page-items="[100, 200, 300, 400]"
        >
            <template slot="items" slot-scope="props">
                <td class="text-xs-center" v-for="(value, key) in props.item" :key="value + Math.random()">
                    <span v-if="variablesMode && key === 'values'" @click="editLabelDialog = true; currentEdit = props.item[key]">
                        {{ props.item[key] }}
                    </span>
                    <span v-else>{{ props.item[key] }}</span>
                </td>
            </template>
        </v-data-table>
        <v-dialog
          v-model="editLabelDialog"
          max-width="600"
          >
          <labels-editor :values="currentEdit"></labels-editor>
        </v-dialog>
    </div>
</template>

<script>
import LabelsEditor from './../../components/forms/LabelsEditor'
export default {
  props: ['responses', 'headers', 'variablesMode'],
  data () {
    return {
      editLabelDialog: false,
      currentEdit: []
    }
  },
  components: { LabelsEditor }
}
</script>

<style scoped>

</style>
