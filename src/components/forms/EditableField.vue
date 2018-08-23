<template>
<span>
    <span class="editable" @click.stop="activateEdit()" :ref="`val`" >
        <span  v-if="typeField === 'number'">
          <span v-if="percent">{{ mutableValue | currency('%') }}</span>
          <span v-else>{{ mutableValue | currency('$', 2, { thousandsSeparator: '.', decimalSeparator: ',' }) }}</span>
        </span>
        <span v-else-if="typeField === 'text'">
          <p v-if="mutableValue" class="text-paragraph">
            {{mutableValue}}
          </p>
          <p v-else class="text-paragraph">
            Editar valor...
          </p>
        </span>

     </span>
    <span style="display:none" :ref="`field`"><single-field-form  :value="value" @dataChanged="changeConfirmed($event)" @cancel=" disactivateEdit()" :type="typeField" :model="mutableModel"></single-field-form></span>
</span>

</template>

<script>
import SingleFieldForm from './SingleFieldForm'
export default {
  props: ['value', 'typeField', 'selectModel', 'percent'],
  data () {
    return {
      mutableValue: 0,
      mutableModel: null
    }
  },
  components: {SingleFieldForm},
  methods: {
    activateEdit () {
      this.$refs[`val`].style.display = 'none'
      this.$refs[`field`].style.display = 'inline'
    },
    disactivateEdit () {
      this.$refs[`val`].style.display = 'inline'
      this.$refs[`field`].style.display = 'none'
    },
    changeConfirmed (event) {
      this.$emit('changeConfirmed', event)
    }
  },
  watch: {
    value (val) {
      this.mutableValue = val
    },
    selectModel (val) {
      this.mutableModel = val
    }
  },
  created () {
    this.mutableValue = this.value
    this.mutableModel = this.selectModel
  }
}
</script>

<style scoped>
 .editable {
    cursor: pointer;
  }
  .add-button {
    margin-right: 15px;
  }
  .amount {
    font-size: 1em;
    font-weight: bold
  }
  .text-paragraph {
    width: 400px;
    overflow-x: scroll;
  }
</style>
