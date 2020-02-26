<template>
<v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Información de la empresa:</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Empresa
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <company-form :values="dataCompany" @dataSubmited="edit"></company-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>
<script>
import {mapActions} from 'vuex'
import CompanyForm from './CompanyForm'
export default {
  data () {
    return {
      dataCompany: null,
      company_id: null
    }
  },
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    ...mapActions('companies', { getCompany: 'get' }),
    edit (values) {
      const {Company} = this.$FeathersVuex
      const company = new Company(values)
      company.patch().then((result) => {
        this.goToList()
      }, (err) => {
        this.setShowSnack(true)
        this.setSnackColor('error')
        this.setSnackMessage('Error al modificar empresa', err)
      })
    },
    goToList () {
      this.$router.push('/company-list')
    }
  },
  computed: {},
  created () {
    this.getCompany(this.$route.params._id).then(result => {
      this.dataCompany = Object.assign({}, result)
    }).catch(err => console.log('este es el error', err))
  },
  components: {CompanyForm}
}
</script>
<style>
</style>
