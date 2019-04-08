<template>
    <div>
       <v-toolbar flat color="transparent">
            <v-toolbar-title>Codificar Preguntas</v-toolbar-title>

            <v-spacer></v-spacer>
            <v-tooltip bottom>
                <v-btn @click="openQuestions = !openQuestions" slot="activator" icon>
                    <v-icon :color="openQuestions ? 'primary' : 'white'">view_module</v-icon>
                </v-btn>
                <span>Preguntas Abiertas</span>
            </v-tooltip>
            <v-tooltip bottom>
                <v-btn @click="openQuestions = !openQuestions" slot="activator" icon>
                    <v-icon :color="openQuestions ? 'white' : 'primary'">view_stream</v-icon>
                </v-btn>
                <span>Todas las Preguntas</span>
            </v-tooltip>
        </v-toolbar>
       <component :headers="getHeaders" :responses="getResponses" :is="currentComponent"></component>
    </div>
</template>

<script>
import PollResultsTable from './../results-view/PollResultsTable'
export default {
  props: [
    'headers',
    'responses',
    'variables'
  ],
  data: () => ({
    openQuestions: false,
    currentComponent: 'PollResultsTable'
  }),
  computed: {
    getResponses () {
      return this.openQuestions ? this.responses.filter(q => q.open) : this.responses
    },
    getHeaders () {
      return this.openQuestions ? this.headers.filter(q => q.open) : this.headers
    }
  },
  components: { PollResultsTable }
}
</script>

<style>

</style>
