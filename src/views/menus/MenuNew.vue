<template>
    <v-container grid-list-md text-xs-center>
        <loading-component v-if="loading"></loading-component>
        <v-layout row wrap>
        <v-flex xs12>
            <v-card :flat="true">
                <v-subheader>Nuevo Ítem</v-subheader>
                <menu-form @dataSubmited="create"></menu-form>
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
import {mapState, mapActions} from 'vuex'
import MenuForm from './MenuForm'
import LoadingComponent from '../../components/docaration/LoadingComponent'
export default {
  methods: {
    ...mapActions(['setSnackMessage', 'setShowSnack', 'setSnackColor']),
    create (values) {
      // method with feathers vuex to create an category project
      const {Menu} = this.$FeathersVuex
      let menu = new Menu(values)
      menu.save().then((result) => {
        this.setSnackMessage('Registro creado')
        this.setShowSnack(true)
        this.goToList()
      }, (err) => {
        this.setSnackMessage('Error al guardar')
        this.setShowSnack(true)
        // this.setSnackColor('error')
        console.log(err)
      })
    },
    goToList () {
      this.$emit('CreateMessage', { mensaje: 'Registro creado', tipo: 'success' })
      this.$router.push('/menu')
    }
  },
  computed: {
    ...mapState('menus', {loading: 'isCreatePending'})
  },
  components: { MenuForm, LoadingComponent }
}
</script>

<style>

</style>
