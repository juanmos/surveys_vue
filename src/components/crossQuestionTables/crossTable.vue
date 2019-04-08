<template>
    <v-flex class="table-wrap" xs11>
            <table class="table-wrap" border="1">
                <thead>
                    <th>
                      Data
                    </th>
                    <th v-for="x in xQuestions" :key="x.code">
                        {{x.label}}
                        <tr>
                          <th v-for="optionX in x.options" :key="optionX">
                            {{optionX}}
                          </th>
                        </tr>
                    </th>
                </thead>
                <tr v-for="y in yQuestions" :key="y">
                    <td>
                      <v-layout row wrap>
                        <v-flex xs6>
                          {{y.label}}
                        </v-flex>
                          <v-flex xs6>
                            <span v-for="optionY in y.options" :key="optionY">
                              {{optionY}} <br />
                            </span>
                          </v-flex>
                      </v-layout>

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
