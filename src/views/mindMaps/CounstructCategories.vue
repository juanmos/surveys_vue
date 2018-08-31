<template>
<v-container>
<v-layout row wrap>
    <v-flex xs12 sm4>
        <v-text-field
        label="Nombre de Categoria"
        single-line
        box
        v-model="category.name"
        ></v-text-field>
    </v-flex>
    <v-flex xs12 sm2>
        <v-layout row wrap>
            <v-flex xs12 sm10>
                <v-text-field
                label="Color"
                type="color"
                box
                v-model="category.color"
                ></v-text-field>
            </v-flex>
            <v-flex xs12 sm2>
                <div :style="{backgroundColor: category.color}" class="color-selector">
                </div>
            </v-flex>
        </v-layout>
    </v-flex>
    <v-flex xs12 sm2>
        <v-btn icon>
          <v-icon>send</v-icon>
        </v-btn>
    </v-flex>
</v-layout>
<v-data-table
    :headers="headers"
    :items="getConstructCategories"
    hide-actions
    class="elevation-1"
  >
    <template slot="items" slot-scope="props">
      <td>{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.color }}</td>
    </template>
  </v-data-table>
</v-container>

</template>

<script>
import {mapState, mapGetters} from 'vuex'
export default {
  data () {
    return {
      valid: false,
      category: {
        name: null,
        color: null
      },
      headers: [
        {
          text: 'Nombre',
          align: 'center',
          sortable: true,
          value: 'name'
        },
        { text: 'Color', value: 'color' }
      ]
    }
  },
  computed: {
    getConstructCategories () {
      return []
    },
    ...mapState('boards', {loading: 'isFindPending'}),
    ...mapGetters('boards', {findBoardsInStore: 'find'}),
    getBoards () {
      return this.findBoardsInStore({query: {removed: false, _study_id: this.$route.params.id}}).data
    }
  }
}
</script>

<style scoped>
    .color-selector {
        width: 60px;
        height: 60px;
    }
</style>
