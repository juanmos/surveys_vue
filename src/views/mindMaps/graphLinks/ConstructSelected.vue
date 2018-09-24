<template>
    <v-container>
        <v-layout justify-center>
            <v-flex xs12 sm12 >
                <v-card
                   v-if="getCurrentConstruct.text"
                  >
                    <v-card-title primary-title>
                    <v-layout justify-center>

                        <h3 class="headline">
                            {{getCurrentConstruct.text}}
                        </h3>
                    </v-layout>
                    <v-chip v-if="getCurrentConstruct.mother" color="lime lighten-4" text-color="black">
                        <v-avatar>
                            <v-icon>all_out</v-icon>
                        </v-avatar>
                        Constructo Madre
                    </v-chip>
                    <v-chip v-else color="blue-grey lighten-4" text-color="black">
                        <v-avatar>
                            <v-icon>device_hub</v-icon>
                        </v-avatar>
                        Constructo Hijo
                    </v-chip>
                    </v-card-title>
                    <v-tabs>
                        <v-tab>
                            Hijos
                        </v-tab>
                        <v-tab-item>
                            <v-list two-line>
                                <template>
                                    <v-subheader
                                    >
                                    Constructos Hijos
                                    </v-subheader>

                                    <v-divider
                                    ></v-divider>
                                    <constructs-child-component @addChildNode="addChildNode" @deleteNode="deleteSelected" @editNode="editSelected" :constructDetailMode="true"></constructs-child-component>
                                </template>
                            </v-list>
                        </v-tab-item>
                         <v-tab v-if="!getCurrentConstruct.mother">
                            Padre

                        </v-tab>
                        <v-tab-item v-if="!getCurrentConstruct.mother">
                            <v-list two-line>
                                <template>
                                    <v-subheader
                                    >
                                    Constructo Padre
                                    </v-subheader>

                                    <v-divider
                                    ></v-divider>

                                </template>
                            </v-list>
                        </v-tab-item>
                        <v-tab>
                            Imagenes y Videos
                        </v-tab>
                        <v-tab-item>
                            <v-list two-line>
                                <template>
                                    <v-subheader
                                    >
                                    Imagenes y Videos
                                    </v-subheader>
                                        <construct-attachments></construct-attachments>
                                    <v-divider
                                    ></v-divider>

                                </template>
                            </v-list>
                        </v-tab-item>
                        <v-tab>
                            Noticias Relacionadas
                        </v-tab>
                        <v-tab-item>
                            <v-list two-line>
                                <template>
                                    <v-subheader
                                    >
                                    Noticias Relacionadas
                                    </v-subheader>

                                    <v-divider
                                    ></v-divider>

                                </template>
                            </v-list>
                        </v-tab-item>
                    </v-tabs>
                    <v-card-actions>
                    </v-card-actions>
                </v-card>
                <v-card
                   v-else
                  >
                  <v-responsive>
                        <v-container fill-height>
                        <v-layout align-center>
                            <v-flex>
                                <v-icon size="90">warning</v-icon>
                            <h4 class="title">No se ha seleccionado</h4>
                            <span class="subheading">Debe seleccionar constructo en el area de mapa para ver informacion.</span>
                            <v-divider class="my-3"></v-divider>
                            </v-flex>
                        </v-layout>
                        </v-container>
                    </v-responsive>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import {mapGetters} from 'vuex'
import ConstructsChildComponent from './ConstructsChildComponent'
import ConstructAttachments from './ConstructAttachments'
export default {
  data () {
    return {
    }
  },
  methods: {
    addChildNode (construct) {
      let mutableConstruct = Object.assign({}, construct)
      mutableConstruct.color = 'rgba(128,128,128,0.2)'
      mutableConstruct.fromSelected = true
      mutableConstruct.selected = this.getCurrentConstruct.key
      this.$emit('addNode', mutableConstruct)
    },
    deleteSelected (item) {
      let mutableItem = item
      this.$emit('deleteNode', mutableItem)
    },
    editSelected (item) {
      let mutableItem = item
      this.$emit('editNode', mutableItem)
    }
  },
  computed: {
    ...mapGetters([
      'getCurrentConstruct'
    ])
  },
  components: {ConstructsChildComponent, ConstructAttachments}
}
</script>

<style>

</style>
