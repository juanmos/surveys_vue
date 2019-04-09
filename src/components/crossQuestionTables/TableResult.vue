<template>
<div>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
              <v-card :flat="true">
              <v-card-title>
                <v-subheader>Resultado</v-subheader>
              </v-card-title>
            <v-data-table
                  :headers="getHeaders"
                  :items="getData"
                  item-key="name"
                  v-scroll-table="onScroll"
                  striped hover
                  outlined
                  bordered
                  hide-actions
                >
                  <template slot="items" slot-scope="props">
                    <tr @click="props.expanded = !props.expanded">
                      <td class="text-xs-center" @click="goToDetailsPerson(props.item._id)" style="min-width: 200px;">
                       {{ props.item.label }} --> {{props.item.option}}
                      </td>
                      <td v-for="answer in props.item.answers" :key="`${answer}`" class="text-xs-left">
                        {{ answer.total  }}
                      </td>
                    </tr>
                  </template>
                </v-data-table>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</div>
</template>

<script>
import {mapActions} from 'vuex'
import LoadingComponent from './../../components/docaration/LoadingComponent'
export default {
  props: ['results'],
  data () {
    return {
      headers: [
        {
          text: 'Cédula / Ruc',
          align: 'center',
          sortable: false,
          value: 'ruc'
        },
        {
          text: 'Apellidos',
          align: 'left',
          sortable: false,
          value: 'lastnames'
        },
        {
          text: 'Nombres',
          align: 'left',
          sortable: false,
          value: 'names'
        },
        {
          text: 'Acciones',
          align: 'center',
          value: 'name',
          sortable: false
        }
      ]
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack']),
    goToNew () {
      this.$router.push('/PersonNew')
    }
  },
  computed: {
    getHeaders () {
      let data = [{text: 'Resultados del cruce', align: 'center', sortable: false}]
      return [data, ...this.results.map(data => data.answers.map(label => {
        return {text: label.labelAnswers, align: 'center', sortable: false}
      }))[0]]
    },
    getData () {
      return this.results
    }
  },
  watch: {
    '$route' (to, from) { // react to route changes...
      this.getband()
    }
  },
  created () {
    console.log('presentar datos', this.results)
  },
  components: {LoadingComponent}
}
</script>

<style>
.v-datatable{
    overflow: hidden;
  }
</style>
