<template>
    <v-data-table
        :headers="headers"
        :items="responses"
        class="elevation-1 resultsTable"
        :rows-per-page-items="[100, 200, 300, 400]"
    >
        <template slot="items" slot-scope="props">
            <td class="text-xs-center" v-for="(value, key) in props.item" :key="value + Math.random()">{{ props.item[key] }}</td>
        </template>
    </v-data-table>
</template>

<script>
export default {
  props: ['responses', 'headers']
}
</script>

<style scoped>

</style>
