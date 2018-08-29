<template>
    <div>
        <v-form
            @submit.prevent="sendData"
            @keydown.prevent.enter
            v-model="valid"
            >
        <v-container>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                  box
                  color="blue-grey lighten-2"
                  label="Nombre"
                  :append-icon="'name'"
                  v-model="board.name"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
        </v-container>
        </v-form>
    </div>
</template>
<script>
export default {
  data () {
    return {
      valid: false,
      notify: true,
      board: {}
    }
  }
}
</script>

<style>

</style>
