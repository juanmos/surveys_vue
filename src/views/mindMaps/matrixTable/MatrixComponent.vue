<template>
    <v-card
        flat
        >
        <v-toolbar
        flat
        >
        <!-- <mind-map-filter @sendFilters="applyFilters"></mind-map-filter> -->
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
        </v-toolbar-items>
        </v-toolbar>
        <v-container fluid>
             <v-layout row wrap>
                    <v-flex d-flex xs12 sm2 md2>
                        <v-card color="grey lighten-5">
                        <v-card-title primary class="title">Constructos</v-card-title>
                        <v-card-text></v-card-text>
                        </v-card>
                    </v-flex>
                    <v-flex d-flex xs12 sm10 md10>
                        <v-layout row wrap>
                            <v-flex xs12 sm6 md6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                    <v-toolbar
                                    flat
                                    >
                                     <v-toolbar-title >Fortalezas</v-toolbar-title>
                                    <v-spacer></v-spacer>
                                    <v-toolbar-items class="hidden-sm-and-down">
                                    </v-toolbar-items>
                                    </v-toolbar>
                                    <draggable v-model="itemsFortaleza" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in itemsFortaleza">
                                                <v-flex :key="item.id">
                                                    <v-card color="primary lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.title}}
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                     <v-toolbar
                                        flat
                                        >
                                        <v-toolbar-title >Incorporar</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-toolbar-items class="hidden-sm-and-down">
                                        </v-toolbar-items>
                                      </v-toolbar>
                                    <draggable v-model="itemsIncorporar" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in itemsIncorporar">
                                                <v-flex :key="item.id">
                                                    <v-card color="green lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.title}}
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                    <v-toolbar
                                    flat
                                    >
                                        <v-toolbar-title >Eliminar</v-toolbar-title>
                                        <v-spacer></v-spacer>
                                        <v-toolbar-items class="hidden-sm-and-down">
                                        </v-toolbar-items>
                                    </v-toolbar>
                                    <draggable v-model="itemsEliminar" :options="{group:'people'}" style="min-height: 100px">
                                            <template v-for="item in itemsEliminar">
                                                <v-flex :key="item.id">
                                                    <v-card color="red lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.title}}
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                            <v-flex xs12 md6 sm6 d-flex>
                                <v-card color="blue-grey lighten-4">
                                         <v-toolbar
                                            flat
                                            >
                                            <v-toolbar-title >Debilita</v-toolbar-title>
                                            <v-spacer></v-spacer>
                                            <v-toolbar-items class="hidden-sm-and-down">
                                            </v-toolbar-items>
                                        </v-toolbar>
                                        <draggable v-model="itemsDebilita" :options="{group:'people'}" style="min-height: 50px">
                                            <template v-for="item in itemsDebilita">
                                                <v-flex :key="item.id">
                                                    <v-card color="lime lighten-4">
                                                        <v-card-title primary-title>
                                                            {{item.title}}
                                                        </v-card-title>
                                                    </v-card>
                                                </v-flex>
                                            </template>
                                        </draggable>
                                </v-card>
                            </v-flex>
                        </v-layout>
                    </v-flex>
                </v-layout>
        </v-container>
    </v-card>
</template>

<script>
import draggable from 'vuedraggable'
export default {
  data () {
    return {
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
      itemsFortaleza: [
        {
          id: 1,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/1.jpg',
          title: 'Brunch this life?',
          subtitle: 'Subtitle 1'
        },
        {
          id: 2,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/2.jpg',
          title: 'Winter Lunch',
          subtitle: 'Subtitle 2'
        },
        {
          id: 3,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: 'Subtitle 3'
        }
      ],
      itemsIncorporar: [
        {
          id: 4,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/4.jpg',
          title: 'Brunch this weekend?',
          subtitle: 'Subtitle 4'
        },
        {
          id: 5,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/5.jpg',
          title: 'Summer BBQ <span class="grey--text text--lighten-1">4</span>',
          subtitle: 'Subtitle 5'
        }
      ],
      itemsEliminar: [
        {
          id: 1,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/1.jpg',
          title: 'Brunch this life?',
          subtitle: 'Tercero'
        },
        {
          id: 2,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/2.jpg',
          title: 'Winter Lunch',
          subtitle: 'Tercero 2'
        },
        {
          id: 3,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: 'Tercero 3'
        }
      ],
      itemsDebilita: [
        {
          id: 1,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/1.jpg',
          title: 'Brunch this life?',
          subtitle: 'Cuarto 1'
        },
        {
          id: 2,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/2.jpg',
          title: 'Winter Lunch',
          subtitle: 'Cuarto 2'
        },
        {
          id: 3,
          avatar: 'https://s3.amazonaws.com/vuetify-docs/images/lists/3.jpg',
          title: 'Oui oui',
          subtitle: 'Cuarto 4'
        }
      ]
    }
  },
  components: {draggable}
}
</script>

<style>

</style>
