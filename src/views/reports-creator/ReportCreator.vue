<template>
    <div>
        <v-flex xs12>
            <v-card>
                <v-toolbar
                  flat
                >
                    <v-spacer></v-spacer>
                    <v-toolbar-items class="hidden-sm-and-down">
                        <v-tooltip bottom>
                        <v-btn
                            flat
                            slot="activator"
                        >
                            <v-icon right dark>filter_none</v-icon>
                        </v-btn>
                        <span><b>Reset</b></span>
                        </v-tooltip>
                    </v-toolbar-items>
                </v-toolbar>
                <v-layout row wrap>
                    <v-flex d-flex xs12 sm2 md2>
                        <v-card>
                            <v-card-title
                              primary class="title">
                                Preguntas
                              <v-spacer></v-spacer>
                            </v-card-title>
                                <template v-for="(item, key) in getTableVariableValues">
                                    <v-flex :key="item">
                                        <draggable v-model="questions" :options="{group:'questions'}">
                                            <v-card class="mr-2 ml-2 mb-2 mt-2" dark :color="`primary`">
                                                <v-card-title>{{item}}{{key}}</v-card-title>
                                            </v-card>
                                        </draggable>
                                    </v-flex>
                                </template>
                        </v-card>
                    </v-flex>
                    <v-flex d-flex xs12 sm10 md10>
                        <v-card>
                            <v-card-title
                              primary class="title">
                                Tabla de Resultado
                              <v-spacer></v-spacer>
                            </v-card-title>

                            <v-flex xs12>
                                <draggable v-model="yQuestions" :options="{group:'questions'}">
                                    <v-card class="draggable" dark color="transparent">
                                        <v-card-text class="px-0"></v-card-text>
                                    </v-card>
                                </draggable>
                            </v-flex>
                            <v-flex xs1>
                                <draggable v-model="xQuestions" :options="{group:'questions'}">
                                    <v-card dark class="draggable draggable-x" color="transparent">
                                        <v-card-text class="px-0"></v-card-text>
                                    </v-card>
                                </draggable>
                            </v-flex>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'

export default {
  props: ['id'],
  data: () => ({
    resultPoll: null,
    yQuestions: [],
    xQuestions: [],
    questions: []
  }),
  computed: {
    getTableVariableValues () {
      return this.resultPoll ? Object.values(this.resultPoll.originalJson)[0] : []
    }
  },
  watch: {
    yQuestions (val) {
      console.log('nuevo Valor', val)
    }
  },
  components: {
    draggable
  },
  methods: {
    ...mapActions('config-polls', {getPoll: 'get'}),
    getQuestionOptions (alias) {
      console.log('obtengo el alis', alias)
    }
  },
  mounted () {
    this.getPoll(this.id).then(result => {
      this.resultPoll = Object.assign({}, result)
      this.questions = this.resultPoll ? Object.values(Object.values(this.resultPoll.originalJson)[0]) : []
    })
  }
}
</script>

<style scoped>
    .draggable {
        border: 1px dotted #ccc !important;
    }
    .draggable-x {
        min-height: 600px;
    }
</style>
