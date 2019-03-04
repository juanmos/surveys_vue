<template>
    <div>
      <draggable v-model="currentQuestions" :options="{group:'questions'}">
        <GmapMap
          class="map"
          ref="gmap"
          :center="{lat: -2.8807488, lng: -79.0347413} "
          :zoom="13"
          map-type-id="roadmap"
          >
          <GmapMarker
            v-for="(m, index) in getMarkers"
            :key="index + Math.random()"
            :position="m.position"
            :clickable="true"
            :draggable="false"
            :icon="m.icon"
          />
        </GmapMap>
      </draggable>
      <v-flex class="mt-5 panel" xs10 offset-xs1>
        <v-card dark>
          {{getKeySelected}}
          <v-card-title class="headline">Tomas de datos:   <v-spacer></v-spacer>
                  <v-chip @click="currentQuestions = []" v-if="currentQuestions.length > 0">
                    {{currentQuestions[0].label}}
                  </v-chip>
                  </v-card-title>
            <v-layout row>
                 <div v-for="take in getProjectTakes" :key="take._id" :style="{'border-right': 'solid 1px'}">
                    <v-btn :color="currentTake._id === take._id ? 'red': 'black'" @click="setCurrentTake(take)" >{{take.name}}</v-btn>
                  </div>
            </v-layout>
        </v-card>
      </v-flex>
      <v-flex v-if="questionsExpanded" class="mt-2 panel" xs12 sm2 md2  offset-xs1>
        <v-card class="questions" dark color="primary">
          <v-card-title
            primary class="title">
              Preguntas
            <v-spacer></v-spacer>
            <v-btn @click="questionsExpanded = false" icon><v-icon>expand_less</v-icon></v-btn>
          </v-card-title>
          <draggable class="mb-2" v-model="questions" :options="{group:'questions'}">
              <template v-for="item in questions">
                  <v-flex :key="item.original">
                      <v-card class="mr-2 ml-2 mb-2 mt-2 mb-2" dark :color="`black`">
                          <v-card-title>{{item.label}}</v-card-title>
                      </v-card>
                  </v-flex>
              </template>
          </draggable>
        </v-card>
      </v-flex>
      <v-flex v-else class="mt-2 panel" xs12 sm2 md2  offset-xs1>
        <v-btn class="elevation-5" @click="questionsExpanded = true"  icon>
          <v-icon  x-large color="red">arrow_drop_down_circle</v-icon>
        </v-btn>
      </v-flex>
      <v-flex v-if="questionsExpanded" class="mt-2 panel" xs12 sm4 md4  offset-xs1>
        <v-card dark v-if="getCurrentOptions.length > 0" class="options">
          <v-layout justify-center align-center row>
            <v-combobox
              v-model="select"
              :items=" getCurrentOptions.map(q => q.name)"
              label="Seleccione Opcion"
              multiple
              chips
              dark
              class="ml-4"
              persistent-hint
            >
              <template
                slot="selection"
                slot-scope="data"
              >
                <v-chip
                  dark
                  :key="JSON.stringify(data.item) + Math.random()"
                  :selected="data.selected"
                  :disabled="data.disabled"
                  class="v-chip--select-multi"
                  @input="data.parent.selectItem(data.item)"
                >
                  <v-avatar
                    dark
                    class="transparent"
                  >
                  <img :src="getCurrentOptions.find(q => q.name === data.item) ? getCurrentOptions.find(q => q.name === data.item).icon : ''">
                  </v-avatar>
                  {{ data.item }}
                </v-chip>
              </template>
            </v-combobox>
          </v-layout>
        </v-card>
      </v-flex>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
import { mapActions } from 'vuex'

import enviroment from './../../config/enviroment'
import icons from './../views/reports-creator/icons'

export default {
  props: ['id'],
  data: () => ({
    currentProject: {},
    currentTake: {},
    questions: [],
    currentQuestions: [],
    urlEnviroment: enviroment[enviroment.currentEnviroment].backend.urlBase,
    select: null,
    icons,
    questionsExpanded: true
  }),
  computed: {
    getProjectTakes () {
      return this.currentProject.pollTakes
    },
    getKeySelected () {
      return this.currentQuestions.length > 0 ? this.currentQuestions[0].code : null
    },
    getTakeValues () {
      return this.currentTake.originalJson ? this.currentTake.originalJson.slice(1, this.currentTake.originalJson.length) : []
    },
    getCurrentOptions () {
      return this.currentQuestions.length > 0 ? this.currentQuestions[0].options.map(q => ({
        name: q,
        icon: this.getRandomIcon()
      })) : []
    },
    getMarkers () {
      return this.currentQuestions.length > 0 ? this.getTakeValues.map(take => ({
        answer: take[this.getKeySelected],
        position: {
          lat: Number(take['latLong'].lat),
          lng: Number(take['latLong'].lng)
        },
        icon: this.getCurrentOptions.find(opt => opt.name === take[this.getKeySelected]) ? this.getCurrentOptions.find(opt => opt.name === take[this.getKeySelected]).icon : ''
      })) : []
    }
  },
  methods: {
    ...mapActions('polls-project', {getProject: 'get'}),
    ...mapActions('config-polls', {getPoll: 'get'}),
    setCurrentTake (take) {
      this.currentTake = Object.assign({}, take)
    },
    getRandomIcon () {
      return `${this.urlEnviroment}/images/map-icons/${this.icons[Math.floor((Math.random() * 19) + 1)]}`
    }
  },
  watch: {
    currentTake (val) {
      console.log('ha sido cambiada', val)
      this.questions = val ? val.formatedConfiguration.slice().filter(q => q.category === 'Intencion') : {}
    },
    currentQuestions (question) {
      console.log('current question cambiada', this.currentQuestions)
    }
  },
  mounted () {
    this.getProject(this.id).then(result => {
      this.currentProject = Object.assign({}, result)
      console.log('este es el current project', this.currentProject)
    })
  },
  components: { draggable }
}
</script>

<style>
    html, body {
      height: 100% !important;
      width: 100% !important;
    }
    .map {
      width: 100%;
      height: 100%;
      position:absolute;
      top: 0;
      left: 0;
      z-index: 0; /* Set z-index to 0 as it will be on a layer below the contact form */
    }
    .takes {
      overflow-x: scroll;
    }
    .panel {
      opacity: 0.8;
    }
    .questions {
    }
    .options {
    }
</style>
