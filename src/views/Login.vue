<template>
    <v-app id="inspire">
      <div class="particles">
           <particles-background></particles-background>
      </div>
       <v-content>
         <v-container fluid fill-height>
          <v-layout align-center justify-center>
                <v-card
                  id="e3"
                  style="max-width: 600px; margin: auto; margin-top: 10%;"
                  class="appear"
                >
                  <v-toolbar
                    color="blue"
                    light
                    dense
                  >
                  <v-toolbar-title class="white--text">Mapas Mentales</v-toolbar-title>
                  </v-toolbar>
                  <v-card>
                    <div class="logo">
                      <img src="https://via.placeholder.com/100x100" alt="Logo">
                    </div>
                    <v-container
                      fluid
                      grid-list-lg
                    >
                      <v-layout row wrap>
                        <v-flex xs12>
                          <v-form v-model="valid">
                              <v-text-field
                                :append-icon="'email'"
                                v-model="email"
                                :rules="rules.emailRules"
                                :counter="10"
                                label="Email"
                                required
                              ></v-text-field>
                              <v-text-field
                                :append-icon="showPass ? 'visibility_off' : 'visibility'"
                                v-model="password"
                                :rules="rules.passwordRules"
                                :type="showPass ? 'text' : 'password'"
                                label="Contraseña"
                                value=""
                                @click:append="showPass = !showPass"
                                required
                              ></v-text-field>
                          </v-form>

                        </v-flex>
                      </v-layout>
                    </v-container>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn flat small color="blue">Entrar</v-btn>
                  </v-card-actions>
                  </v-card>
                </v-card>
          </v-layout>
         </v-container>
       </v-content>
     </v-app>
</template>

<script>
import ParticlesBackground from './../components/docaration/ParticlesBackground'
export default {
  data: () => ({
    valid: false,
    email: '',
    password: '',
    showPass: false,
    rules: {
      emailRules: [
        v => !!v || 'Email es requerido',
        v => /.+@.+/.test(v) || 'Email no es Valido'
      ],
      passwordRules: [
        v => !!v || 'Contraseña es requerida',
        v => v.length <= 8 || 'Al menos 8 caracteres'
      ]
    }
  }),
  components: {ParticlesBackground}
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
  .logo {
    text-align: center;
  }
  .logo img {
    margin: 10px;
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
