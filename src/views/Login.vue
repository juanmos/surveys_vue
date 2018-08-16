<template>
    <div>
        <v-flex xs12 sm6 offset-sm3>
            <v-card>
                <v-container
                  fluid
                  grid-list-lg
                >
                    <login-form></login-form>
                </v-container>
            </v-card>
        </v-flex>
    </div>
</template>

<script>
import LoginForm from './../components/forms/LoginForm'
export default {
  components: {LoginForm}
}
</script>

<style>

</style>
