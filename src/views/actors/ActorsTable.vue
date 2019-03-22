<template>
    <v-data-table
      :headers="headers"
      :items="elements"
    >
    <template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
            <td>
                <v-avatar
                 class="mt-1 mb-1"
                 small
                 :tile="false"
                 :size="50"
                 color="grey darken-4"
                 >
                </v-avatar>
            </td>
            <td>
            <v-edit-dialog
                :return-value.sync="props.item.name"
                lazy
                @save="edit(props.item.name, props.item, 'name')"
                @cancel="cancel"
                @open="open"
                @close="close"
            > {{ props.item.name }}
                <v-text-field
                slot="input"
                v-model="props.item.name"
                label="Editar Nombre"
                single-line
                counter
                ></v-text-field>
            </v-edit-dialog>
            </td>
            <td>
            <v-edit-dialog
                :return-value.sync="props.item.description"
                lazy
                @save="edit(props.item.description, props.item, 'description')"
                @cancel="cancel"
                @open="open"
                @close="close"
            > {{ props.item.description }}
                <v-text-field
                slot="input"
                v-model="props.item.description"
                label="Editar Descripción"
                single-line
                counter
                ></v-text-field>
            </v-edit-dialog>
            </td>
            <td class="justify-center layout px-0">
            <v-menu
                bottom
                transition="slide-y-transition"
            >
                <v-btn
                slot="activator"
                color="primary"
                flat
                icon
                >
                <v-icon>more_vert</v-icon>
                </v-btn>
                <v-list>
                <v-list-tile @click="editar(props.item)">
                    <v-list-tile-title>Editar</v-list-tile-title>
                </v-list-tile>
                <v-list-tile @click="dialog = true; itemSelected=props.item">
                    <v-list-tile-title>Eliminar</v-list-tile-title>
                </v-list-tile>
                <v-dialog
                    v-model="dialog"
                    max-width="290"
                >
                    <v-card>
                    <v-card-title class="headline">Eliminar categoria</v-card-title>

                    <v-card-text>
                        Esta seguro que desea eliminar ítem ?
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>

                        <v-btn
                        color="red darken-4"
                        flat="flat"
                        @click="dialog = false"
                        >
                        Cancelar
                        </v-btn>

                        <v-btn
                        color="teal darken-3"
                        flat="flat"
                        @click="dialog = false, del()"
                        >
                        Aceptar
                        </v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
                </v-list>
            </v-menu>
            </td>
        </tr>
    </template>
    </v-data-table>
</template>

<script>
export default {
  props: {
    headers: Array,
    elements: Array
  }
}
</script>

<style>

</style>
