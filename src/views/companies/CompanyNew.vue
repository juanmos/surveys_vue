<template>
    <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Empresas del sistema</v-subheader>
                <v-tabs right>
                  <v-tab>
                    Empresa
                  </v-tab>
                  <v-tab-item>
                    <v-card flat>
                      <v-card-text>
                        <company-form @dataSubmited="create"></company-form>
                      </v-card-text>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
                <v-btn
                absolute
                dark
                fab
                small
                top
                right
                color="primary"
                @click="goToList"
                >
                    <v-icon>list</v-icon>
                </v-btn>
            </v-card>
        </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
import CompanyForm from './CompanyForm'
export default {
  methods: {
    create (values) {
      const { Company } = this.$FeathersVuex
      let company = new Company(values)
      company.save().then((result) => {
        this.goToList()
      }, (err) => {
        console.log(err)
      })
    },
    goToList () {
      this.$router.push('/company-list')
    }
  },
  computed: {},
  mounted () {},
  components: {CompanyForm}
}
</script>

<style>

</style>
