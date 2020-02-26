<template>
  <v-container fluid
       grid-list-lg>
           <v-layout row wrap>
             <v-flex xs12>
               <center>
                 <table class="tableReport" v-if="dataDerive">
                   <colgroup span="2"></colgroup>
                   <colgroup span="2"></colgroup>
                   <!--  HEADRES-->
                  <tr>
                    <th></th>
                    <th></th>
                    <th :colspan="item.choicesResults.length" v-for="(item) in dataDerive.results" :key="item.question.code">
                      {{item.question.title}}
                    </th>
                  </tr>

                  <tr>
                     <th></th>
                     <th></th>
                     <th class="maxWidth" v-for="(col, index) in dataDerive.columnsQuestions" :key="index+ Math.random()">
                       {{col.choice}}
                     </th>
                  </tr>
                   <!--  FIN HEADRES-->
                   <template  v-for="(row) in dataDerive.formatTable">
                     <tr :key="row.name + Math.random()">
                       <th rowspan="4">{{row.name}}</th>
                       <th class="knowledge">CONOCIMIENTO</th>
                       <td v-for="(total, indexTotal) in row.results.knowledge" :key="indexTotal+ Math.random()"> {{total}} </td>

                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th class="detractors">DETRACTORES</th>
                       <td v-for="(total, indexTotalDetractores) in row.results.detractors" :key="indexTotalDetractores+ Math.random()"> {{total}} </td>
                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th class="passives">PASIVOS</th>
                       <td v-for="(total, indexTotalPasivos) in row.results.passives" :key="indexTotalPasivos+ Math.random()"> {{total}} </td>
                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th class="promoters">PROMOTORES</th>
                       <td v-for="(total, indexTotalPromotores) in row.results.promoters" :key="indexTotalPromotores+ Math.random()"> {{total}} </td>
                     </tr>
                   </template>
                </table>
               </center>
             </v-flex>
           </v-layout>
  </v-container>
</template>
<script>
export default {
  inheritAttrs: false,
  props: {
    question: {
      type: Object
    },
    resultDerive: {
      type: Object
    }
  },
  data: (state) => ({
    color: '#858d8e',
    dataDerive: null
  }),
  methods: {
    goToDetail () {}
  },
  computed: {
    getItems () {
      return ''
    }
  },
  created () {
    // this.currentQuestion = this.question
    this.categories = this.question.categories
    this.dataDerive = this.resultDerive
  },
  watch: {
    resultDerive: function (val) {
      if (val) {
        this.dataDerive = val
      }
    }
  },
  components: {}
}
</script>

<style lang="scss">
.tableReport tr:nth-child(odd){
  background: #dfe3ea!important;

}

.tableReport tr:nth-child(even){
  background: white !important;
  color: black !important;
}

.knowledge {
  background-color: #79cdda !important;
  color: black;
}
.detractors {
  background-color: #fb4117 !important;
  color: black;
}
.passives {
  background-color: #fbd417 !important;
  color: black;
}
.promoters {
  background-color: #4bb912 !important;
  color: black;
}
.tableReport th {
  top: 0;
  text-align: center;
  color: black !important;
  border: 1px solid black !important;
  text-align: center !important;
}
.tableReport td {
  padding: 10px;
  text-align: center;
  color: black !important;
  border: 1px solid black !important
}

table {
  display: block;
}
.maxWidth{
  max-width: 50px;
}

.center {
  text-align: center;
}
.headersStyle {
  text-align: center;
}
</style>
