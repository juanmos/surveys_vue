<template>
  <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <result-question :question="currentQuestion" :isViewDetail="isViewDetail"></result-question>
             </v-flex>
             <v-flex xs12>
               <v-data-table
                     :headers="headers"
                     :items="getItems"
                     hide-actions
                     item-key="name"
                   >
                     <template slot="items" slot-scope="props">
                       <tr @click="props.expanded = !props.expanded">
                         <td class="justify-left">
                             {{props.item.name}}
                         </td>
                         <td class="justify-left">
                           {{props.item.percentage}}
                         </td>
                         <td class="justify-left">
                           {{props.item.total}}
                         </td>
                       </tr>
                     </template>
                   </v-data-table>
             </v-flex>
           </v-layout>
  </v-container>
</template>
<script>
import ResultQuestion from './../../components/material/ResultQuestion'
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    }
  },
  data: (state) => ({
    currentQuestion: {
      total: []
    },
    graphicType: 'column',
    color: '#858d8e',
    headers: [
      {
        text: 'Nombre',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      { text: 'Porcentaje',
        value: 'percentage',
        sortable: true
      },
      { text: 'Total',
        value: 'total',
        sortable: true
      }
    ],
    isViewDetail: true,
    text: ''
  }),
  methods: {
    goToDetail () {}
  },
  computed: {
    getItems () {
      let list = []
      for (var [key, value] of Object.entries(this.currentQuestion.total)) {
        if (key !== '99') {
          let obj = {name: key, total: (value.total) ? value.total : 0, percentage: (value.percentage) ? parseFloat(value.percentage) : 0}
          list.push(obj)
        }
      }
      return list
    }
  },
  created () {
    this.currentQuestion = this.question
  },
  watch: {
    // question: function (val) {}
  },
  components: {ResultQuestion}
}
</script>

<style lang="scss">

</style>
