<template>
  <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <result-question :question="currentQuestion" :isViewDetail="isViewDetail"></result-question>
             </v-flex>
             <v-flex xs12>
               <v-data-table v-if="currentQuestion.questionCombination"
                     :headers="headersCombination"
                     :items="getItemsCombination"
                     hide-actions
                     item-key="name"
                   >
                     <template slot="items" slot-scope="props">
                       <tr @click="props.expanded = !props.expanded">
                         <td class="justify-left">
                             {{props.item.row}}
                         </td>
                         <td class="justify-left">
                           <label>Total:<span>{{props.item.dataLiking.detractores.total}}</span></label> <br/>
                           <label>Porcentaje:<span>{{props.item.dataLiking.detractores.percentage}} %</span></label>
                         </td>
                         <td class="justify-left">
                           <label>Total:<span>{{props.item.dataLiking.pasivos.total}}</span></label> <br/>
                           <label>Porcentaje:<span>{{props.item.dataLiking.pasivos.percentage}} %</span></label>
                         </td>
                         <td class="justify-left">
                           <label>Total:<span>{{props.item.dataLiking.promotores.total}}</span></label> <br/>
                           <label>Porcentaje:<span>{{props.item.dataLiking.promotores.percentage}} %</span></label>
                         </td>
                       </tr>
                     </template>
               </v-data-table>
               <v-data-table v-else
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
    headersCombination: [
      {
        text: 'Nombre',
        align: 'left',
        sortable: true,
        value: 'name'
      },
      { text: 'Detractores',
        value: 'detractores',
        sortable: false
      },
      { text: 'Pasivos',
        value: 'pasivos',
        sortable: false
      },
      { text: 'Promotores',
        value: 'promotores',
        sortable: false
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
    },
    getItemsCombination () {
      return this.currentQuestion.dataLikingKnowLiking
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
