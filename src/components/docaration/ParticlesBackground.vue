<template>
    <vue-particles
        color="#01579B"
        :particleOpacity="0.5"
        :particlesNumber="30"
        shapeType="triangle"
        :particleSize="5"
        linesColor="#01579B"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.5"
        :linesDistance="150"
        :moveSpeed="4"
        :hoverEffect="false"
        hoverMode="grab"
        :clickEffect="false"
        clickMode="push"
        >
    </vue-particles>
</template>

<script>
export default {
}
</script>
<style scoped>
    vue-particles {

    }
</style>
