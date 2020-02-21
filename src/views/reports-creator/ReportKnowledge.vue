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
                     <th v-for="(col, index) in dataDerive.columnsQuestions" :key="index+ Math.random()">
                       {{col.choice}}
                     </th>
                  </tr>
                   <!--  FIN HEADRES-->
                   <template  v-for="(row) in dataDerive.formatTable">
                     <tr :key="row.name + Math.random()">
                       <th rowspan="4">{{row.name}}</th>
                       <th>CONOCIMIENTO</th>
                       <td v-for="(total, indexTotal) in row.results.knowledge" :key="indexTotal+ Math.random()"> {{total}} </td>

                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th>DETRACTORES</th>
                       <td v-for="(total, indexTotalDetractores) in row.results.detractors" :key="indexTotalDetractores+ Math.random()"> {{total}} </td>
                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th>PASIVOS</th>
                       <td v-for="(total, indexTotalPasivos) in row.results.passives" :key="indexTotalPasivos+ Math.random()"> {{total}} </td>
                     </tr>
                     <tr :key="row.name + Math.random()">
                       <th>PROMOTORES</th>
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
.styleCustom tbody tr:nth-of-type(odd) {
  background-color: rgba(93, 97, 99, 0.87);
  color: white;
}
.styleCustom tbody tr:hover {
  background-color: #312f2f !important;
  color: white;
}
.TFtable{
  width: 100%;
  border-collapse: collapse;
}

.TFtable td{
  padding:15px;
  border:#dadde2 1px solid;
}

.TFtable th{
  padding:15px; border:#dadde2 1px solid;
  background: white;
  color: rgba(0,0,0,.54);
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 12px;
  max-width: 450px;
  min-width: 350px;
}

/* encabezados estaticos*/
.TFtable{
    width: 400px;
  /*  table-layout: fixed;
    border-collapse: collapse; */
}

.TFtable tbody{
  display:block;
  width: 100%;
  overflow: auto;
  height: 100px;
}

.TFtable thead tr {
   display: block;
}

.TFtable thead {
  background: black;
  color:#fff;
}

.TFtable th, .TFtable td {
  padding: 15px;
  margin: 15px;
  text-align: center;
  font-family: Avenir,Helvetica,Arial,sans-serif;
  font-size: 13px;
  width: 200px;
}

/* encabezados estaticos*/

.tableReport tr{
  background: #dadde2;
  cursor: pointer !important;
}

.tableReport tr:nth-child(odd){
  background: #dfe3ea;
  color: black;
}

.tableReport tr:nth-child(even){
  background: white;
  color: black;
}

.tableReport th {
/*  position: -webkit-sticky;
  position: sticky; */
  top: 0;
}
.tableReport td {
  padding: 10px;
}

table {
  display: block;
}

.tableData {
  width: 100%;
  overflow-x: scroll;
  /*height: 700px; */
}

.center {
  text-align: center;
}
.headersStyle {
  text-align: center;
}
</style>
