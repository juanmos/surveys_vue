<template>
    <v-flex class="table-wrap" xs11>
            {{getCrossedRows}}
            <table class="table-wrap" border="1">
                <thead>
                    <th v-for="x in xQuestions" :key="x.code">
                        {{x.label}}
                    </th>
                </thead>
                <tr v-for="y in yQuestions" :key="y">
                    <td v-for="x in xQuestions" :key="x.code">
                        {{getCrossValue(x, y)}}
                    </td>
                </tr>
            </table>
    </v-flex>
</template>
<script>
export default {
  props: ['xQuestions', 'yQuestions'],
  methods: {
    getCrossValue (x, y) {
      return 0
    }
  },
  computed: {
    getCrossedRows () {
      return this.xQuestions.map(q => q.options)
    }
  }
}
</script>
<style scoped>
  .table-wrap {
    overflow: scroll;
  }
</style>
