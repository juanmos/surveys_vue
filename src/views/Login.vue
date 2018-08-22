<template>
    <v-app id="inspire">
      <loading-component v-if="loading"></loading-component>
      <div class="particles">
           <particles-background></particles-background>
      </div>
       <v-content>
         <v-container fluid fill-height>
          <v-layout align-center justify-center>
                <v-card
                  id="e3"
                  style="min-width: 400px; margin: auto; margin-top: 10%;"
                  class="appear"
                >
                  <v-toolbar
                    color="blue"
                    light
                    dense
                  >
                  <v-toolbar-title class="white--text">Mapas Mentales</v-toolbar-title>
                   <v-spacer></v-spacer>.
                  </v-toolbar>
                  <login-form @dataSubmited="auth($event)"></login-form>
                  <snack-message v-if="logErr" :message="`USUARIO O CONTRASEÑA INVALIDO`" :type="'error'" ></snack-message>
                </v-card>
          </v-layout>
         </v-container>
       </v-content>
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
    auth (credentials) {
      this.authenticate(credentials).then((result) => {
        this.$router.push('/')
      }, (err) => {
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
    background-repeat: no-repeat;
    background-size: cover; background-position: 50% 50%;
    background-color: #fff;
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
