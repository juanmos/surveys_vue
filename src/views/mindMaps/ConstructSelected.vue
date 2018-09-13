<template>
    <v-container>
        <v-layout justify-center>
            <v-flex xs12 sm12 >
                <v-card
                   v-if="getCurrentConstruct.text"
                  >
                    <v-card-title primary-title>
                    <v-layout justify-center>
                        <h3 class="headline mb-0">{{getCurrentConstruct.text}}</h3>
                    </v-layout>
                    </v-card-title>
                    <v-list two-line>
                        <template>
                            <v-subheader
                            >
                            Constructos Hijos
                            </v-subheader>

                            <v-divider
                            ></v-divider>
                            <constructs-child-component></constructs-child-component>
                        </template>
                    </v-list>

                    <v-card-actions>
                    </v-card-actions>
                </v-card>
                <v-card
                   v-else
                  >
                  <v-jumbotron>
                        <v-container fill-height>
                        <v-layout align-center>
                            <v-flex>
                            <h4 class="title">No se ha seleccionado</h4>
                            <span class="subheading">Debe seleccionar constructo en el area de mapa para ver informacion.</span>
                            <v-divider class="my-3"></v-divider>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-jumbotron>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import ConstructsChildComponent from './ConstructsChildComponent'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentConstruct'
    ])
  },
  components: {ConstructsChildComponent}
}
</script>

<style>

</style>
