<template>
<div></div>
</template>
<script>
export default {
  methods: {
    create (values) {
      // method with feathers vuex to create an user
      const { User } = this.$FeathersVuex
      const user = new User(values)
      user.save()
    }
  }
}
</script>

<style>

</style>
