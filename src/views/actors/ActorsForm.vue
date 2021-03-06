<template>
  <v-form>
    <v-container>
      <v-layout xs10 offset-xs1>
        <v-flex xs2>
          <picture-upload @fileCreated="setCurrentImg" :url="currentImage"></picture-upload>
        </v-flex>
        <v-flex xs7>
          <v-text-field v-model="actorData.name" @input="setCodeField" label="Nombre" box></v-text-field>
          <v-text-field :disabled="true" v-model="actorData.code" label="Codigo" box></v-text-field>
          <v-textarea v-model="actorData.description" label="Descripcion" box></v-textarea>
          <v-select
            v-model="actorData._country_id"
            :items="getCountries"
            label="Seleccione el país"
            item-text="name"
            item-value="_id"
            box
            color="blue-grey lighten-2"
          ></v-select>
          <v-combobox
            v-model="actorData.actor_type"
            :items="actorTypes"
            label="Seleccione el Tipo de Actor"
            box
          ></v-combobox>
          <v-combobox
            v-model="actorData.actorCategories"
            :items="categories"
            label="Seleccione Categoria"
            multiple
            box
          ></v-combobox>
          <v-select
            v-model="actorData.level"
            :items="[1,2,3]"
            label="Seleccione nivel (orden al mostrar en panel)"
            box
            color="blue-grey lighten-2"
          ></v-select>
          <v-text-field
            v-model="categoryInput"
            @keyup.enter="addTag"
            @keyup.space="addTag"
            label="Agregar Tag"
            box
            color="blue-grey lighten-2"
          ></v-text-field>
          <v-layout row>
            <v-chip dark v-for="(tag, index) in actorData.tags" :key="tag">
              <span class="font-weight-bold" @click="deleteTag(index)">#{{tag}}</span>
            </v-chip>
          </v-layout>
          <v-divider></v-divider>
          <v-text-field
            class="mt-2"
            v-model="chargeInput"
            @keyup.enter="addCharge"
            @keyup.space="addCharge"
            label="Cargos que ha ocupado"
            box
            color="blue-grey lighten-2"
          ></v-text-field>
          <v-layout row>
            <v-chip
              dark
              color="primary"
              v-for="(charge, index) in actorData.charges"
              :key="charge "
            >
              <span class="charge-chip font-weight-bold" @click="deleteCharge(index)">{{charge}}</span>
            </v-chip>
          </v-layout>
          <v-divider></v-divider>
          <v-text-field
            class="mt-2"
            v-model="politicalPartiesInput"
            @keyup.enter="addPoliticalParties"
            @keyup.space="addPoliticalParties"
            label="Partidos en los que pertenece"
            box
            color="blue-grey lighten-2"
          ></v-text-field>
          <v-layout row>
            <v-chip
              dark
              color="primary"
              v-for="(party, index) in actorData.politicalParties"
              :key="party "
            >
              <span
                class="charge-chip font-weight-bold"
                @click="deletePoliticalParties(index)"
              >{{party}}</span>
            </v-chip>
          </v-layout>
          <v-layout row>
            <v-switch color="primary" v-model="actorData.international" :label="`Internacional`"></v-switch>
            <v-switch color="primary" v-model="actorData.national" :label="`Nacional`"></v-switch>
            <v-switch color="primary" v-model="actorData.local" :label="`Local`"></v-switch>
          </v-layout>
          <v-btn @click="saveActor" :disabled="incomplete">Guardar Actor</v-btn>
        </v-flex>
      </v-layout>
    </v-container>
  </v-form>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'

import PictureUpload from './PictureUpload'
export default {
  props: ['actor'],
  data: state => ({
    currentImage: null,
    actorData: {
      name: null,
      description: null,
      image: null,
      code: null,
      _country_id: null,
      tags: [],
      local: false,
      international: false,
      national: false,
      charges: [],
      politicalParties: []
    },
    categoryInput: '',
    chargeInput: '',
    politicalPartiesInput: '',
    actorTypes: ['PERSONA', 'SUCESO', 'ELEMENTO', 'PARTIDO POLITICO'],
    categories: [],
    countries: []
  }),
  methods: {
    ...mapActions('countries', { findCountries: 'find' }),
    ...mapActions('actor-categories', { findCategories: 'find' }),
    // ...mapActions("countries", { findCountries: "find" }),
    setCurrentImg (data) {
      this.actorData.image = data.path
    },
    saveActor () {
      this.$emit('saveActor', Object.assign({}, this.actorData))
    },
    setCodeField (val) {
      let str = val
        .toUpperCase()
        .split(' ')
        .join('_')
      this.actorData.code = str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    },
    addTag () {
      this.actorData.tags.push(this.categoryInput)
      this.categoryInput = ''
    },
    addCharge () {
      this.actorData.charges.push(this.chargeInput)
      this.chargeInput = ''
    },
    addPoliticalParties () {
      this.actorData.politicalParties.push(this.politicalPartiesInput)
      this.politicalPartiesInput = ''
    },
    deleteTag (index) {
      this.actorData.tags.splice(index, 1)
    },
    deleteCharge (index) {
      this.actorData.charges.splice(index, 1)
    },
    deletePoliticalParties (index) {
      this.actorData.politicalParties.splice(index, 1)
    }
  },
  computed: {
    ...mapState(['currentEnv']),
    ...mapGetters('countries', { findCountriesInStore: 'find' }),
    incomplete () {
      let {
        national,
        international,
        local,
        politicalParties,
        charges,
        actorCategories,
        image,
        ...rest
      } = this.actorData
      return Object.values(rest).includes(null)
    },
    getCountries () {
      return this.findCountriesInStore({ query: { removed: false } }).data
    }
  },
  mounted () {
    this.findCategories({ query: { removed: false } }).then(response => {
      this.categories = response.data
    })
    // this.findCountries({ query: { removed: false } }).then(response => {
    //   this.countries = response.data;
    //   console.log(response.data);
    // });
  },
  watch: {
    actor: function (val) {
      if (val) {
        this.currentImage = val.image
        this.actorData = val
      }
    }
  },
  created () {
    this.findCountries({ query: { removed: false } }).then(response => {
      const countries = response.data || response
      console.log(countries)
    })
  },
  components: { PictureUpload }
}
</script>

<style scoped>
.charge-chip {
  text-transform: capitalize;
}
</style>
