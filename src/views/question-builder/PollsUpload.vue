<template>
    <div>
        <file-uploader @fileCreated="pollImported" label="Archivo Excel SPSS" inputType=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"></file-uploader>
    </div>
</template>

<script>
import FileUploader from './../../components/FileUploader'
export default {
  components: {FileUploader},
  methods: {
    pollImported (event) {
      this.$emit('pollImported', Object.assign({}, event))
    }
  }
}
</script>

<style>

</style>
