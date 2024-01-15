<script setup>

const moods = ["#FFFFFF", "#1b3939", "#1d542a", "#1f7d3e", "#6e9b3e", "#b2b937"];
const props = defineProps(["active", "mood"])

</script>

<template>
    <div>
        <svg :class="{ active: props.active }" :style="{ fill: props.mood ? moods[props.mood] : '#E0E0E0' }"
            class="img_mood" viewBox="0 0 23.13 23.17">
            <path class="cls-1"
                d="M.56,1.69A.67.67,0,0,1,1.23,1c4.48.28,20.93-1.16,21,0,.09,1.8.88,20.9,0,21.28-1.66.71-17.37.37-21.09.06a.7.7,0,0,1-.63-.7C.56,18.52.79,5.27.56,1.69Z" />
        </svg>
    </div>
</template>

<style scoped>
.img_mood {
    fill: white;
    width: 34px;
}

.active {
    stroke: green;
}
</style>