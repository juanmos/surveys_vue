<template>
    <v-app id="inspire">
      <loading-component v-if="loading"></loading-component>
          <particles-background class="particles"></particles-background>
          <v-layout align-center justify-center>
                <v-card
                  color="pink"
                  style="min-width: 400px; margin: auto; margin-top: 10%;"
                  class="appear elevation-20"
                >
                  <login-form @dataSubmited="auth($event)"></login-form>
                  <snack-message></snack-message>
                </v-card>
          </v-layout>
     </v-app>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import ParticlesBackground from './../components/docaration/ParticlesBackground'
import SnackMessage from './../components/docaration/SnackMessage'
import LoginForm from './../components/forms/LoginForm'
import LoadingComponent from './../components/docaration/LoadingComponent'
import {validations} from './../utils/validations'
export default {
  data: () => ({
    valid: false,
    email: '',
    password: '',
    showPass: false,
    rules: validations
  }),
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions([
      'setShowSnack',
      'setSnackMessage'
    ]),
    auth (credentials) {
      this.authenticate(credentials).then((result) => {
        this.setShowSnack(true)
        this.setSnackMessage('Bienvenido a mapas mentales')
        this.$router.push('/')
      }, (err) => {
        this.setShowSnack(true)
        this.setSnackMessage('Usuario o contraseña invalidos')
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState('auth', {
      loading: 'isAuthenticatePending',
      logErr: 'errorOnAuthenticate'
    })
  },
  components: {ParticlesBackground, LoginForm, LoadingComponent, SnackMessage}
}
</script>

<style scoped>
  .particles{
    position:absolute;
    width: 100%; height: 100%;
    background-image: url("");
    background-repeat: repeat;
    background-size: cover; background-position: 50% 50%;
    background-color: #BBDEFB;

  }
  .v-toolbar_title {
    display: none;
  }
  .appear {
    animation: appear 1s;
  }
  @keyframes appear {
    0% {opacity: 0;}
    49% {opacity: 0.4;}
    60% {opacity: 0.6;}
    60% {opacity: 0.8;}
    100% {opacity: 1;}
  }
</style>
