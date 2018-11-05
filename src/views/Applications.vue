<template>
  <v-app id="applications">
    <v-layout row wrap>
        <v-flex xs12 sm4 style="margin:20px;" v-if="user.application_permissions.management_propraxis === true">
          <v-card title="Gestión Propraxis">
            <v-img
              src="images/gestion.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Gestión Propraxis</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://gestion.propraxis.ec/#/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex  xs12 sm4 style="margin:20px;" v-if="user.application_permissions.mind_map === true">
          <v-card title="Mapas Mentales">
            <v-img
              src="images/mapas_mentales.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Mapas Mentales</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://mapas-mentales.propraxis.ec/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex  xs12 sm4 style="margin:20px;" v-if="user.application_permissions.management_projectta === true">
          <v-card title="Gestión Proyectta">
            <v-img
              src="images/gestion.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Gestión Projectta</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://projectta.propraxis.ec/#/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex  xs12 sm4 style="margin:20px;" v-if="user.application_permissions.management_proprint === true">
          <v-card title="Gestión Proprint">
            <v-img
              src="images/gestion.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Gestión Proprint</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://proprint.propraxis.ec/#/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex  xs12 sm4 style="margin:20px;" v-if="user.application_permissions.polls === true">
          <v-card title="Encuestas">
            <v-img
              src="images/encuestas.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Encuestas</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://encuestas.propraxis.ec/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>

        <v-flex  xs12 sm4 style="margin:20px;" v-if="user.application_permissions.territory === true">
          <v-card title="Territorio">
            <v-img
              src="images/encuestas.png"
              img-alt="Image"
              aspect-ratio="2.75"
            ></v-img>
            <v-card-title primary-title>
              <div>
                <h3 class="headline mb-0">Territorio</h3>
                <div>Located two hours south of Sydney in the <br>Southern Highlands of New South Wales, ...</div>
              </div>
            </v-card-title>
            <v-card-actions>
              <v-btn href="http://territorio.propraxis.ec/dashboard">Ingresar</v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
  </v-app>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: 'applications',
  components: {},
  data: function () {
    return {
    }
  },
  methods: {
    variant (value) {
      let $variant
      if (value <= 25) {
        $variant = 'info'
      } else if (value > 25 && value <= 50) {
        $variant = 'success'
      } else if (value > 50 && value <= 75) {
        $variant = 'warning'
      } else if (value > 75 && value <= 100) {
        $variant = 'danger'
      }
      return $variant
    }
  },
  computed: {
    ...mapState('auth', { user: 'user' })
  }
}
</script>
