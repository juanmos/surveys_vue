<template>
    <v-card class="m-5">
        <v-combobox
          class="ml-5 mr-5"
          v-model="take"
          :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
          label="Seleccione numero de Toma"
        ></v-combobox>
        <v-flex xs12 sm6 class="ml-5 mr-5">
          <v-date-picker v-model="dateFinished" color="red lighten-1" locale="es-es" header-color="primary"></v-date-picker>
        </v-flex>
        <file-uploader @fileCreated="pollImported" label="Archivo Excel SPSS" inputType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></file-uploader>
    </v-card>
</template>

<script>
import FileUploader from './../../components/FileUploader'
export default {
  components: {FileUploader},
  data: () => ({
    take: 1,
    dateFinished: new Date().toISOString().substr(0, 10)
  }),
  methods: {
    pollImported (event) {
      event.take = this.take
      event.dateFinished = this.dateFinished
      event.status = 'FINALIZADA'
      console.log('esto se va a guardar', event)
      this.$emit('pollImported', Object.assign({}, event))
    }
  }
}
</script>

<style>

</style>
