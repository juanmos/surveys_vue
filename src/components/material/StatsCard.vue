<template>
  <material-card
    class="v-card--material-stats"
  >
    <v-card
      slot="offset"
      :class="`elevation-${elevation}`"
      :color="color"
      class="pa-4"
      dark
    >
        <v-icon
          size="40"
        >
          {{ icon }}
        </v-icon>

    </v-card>
    <div class="text-xs-right">
      <p
        class="colorTitle text-xs-right font"
        v-text="title"
      />
      <h4
        class="colorTitle text-xs-right font" style="margin-left: 10px;">
        {{ value }} <small>{{ smallValue }}</small>
      </h4>
    </div>

    <div class="text-xs-right" v-if="icon === 'room'" style="margin-left: 65%;">
      <v-card-actions class="text-xs-right">
          <v-btn small text @click="showMap()">Ver</v-btn>
      </v-card-actions>
    </div>

    <template slot="actions">
      <v-icon
        :color="subIconColor"
        size="20"
        class="mr-2"
      >
        {{ subIcon }}
      </v-icon>
      <span
        :class="subTextColor"
        style="font-family: Roboto;font-size:12px;"
        class="caption colorTitle"
        v-text="subText"
      />
    </template>
  </material-card>
</template>

<script>
import MaterialCard from './Card'

export default {
  inheritAttrs: false,
  props: {
    ...MaterialCard.props,
    icon: {
      type: String,
      required: true
    },
    subIcon: {
      type: String,
      default: undefined
    },
    subIconColor: {
      type: String,
      default: undefined
    },
    subTextColor: {
      type: String,
      default: undefined
    },
    subText: {
      type: String,
      default: undefined
    },
    title: {
      type: String,
      default: undefined
    },
    value: {
      type: String,
      default: undefined
    },
    smallValue: {
      type: String,
      default: undefined
    }
  },
  methods: {
    showMap () {
      this.$emit('showMap')
    }
  },
  components: {MaterialCard}
}
</script>

<style lang="scss">

.colorTitle {
  color: white !important;
}

.font {
  font-family: Roboto !important;
  font-size: 14px !important;
}

.v-card--material-stats {
  display: flex;
  flex-wrap: wrap;
  background: #000;
  max-width: 344px;
  position: relative;

  .v-offset {
    display: inline-block;
    flex: 0 1;
    margin-top: 0;
    margin-left: 0;
    margin-right: auto;
    margin-bottom: 0 !important;
    max-width: auto;
    padding: 0 16px 0;
  }

  .v-card {
    border-radius: 4px;
    flex: 0 1 auto;
  }

  .v-card__text {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
  }

  .v-card__actions {
    flex: 1 0 100%;
  }
}
</style>
