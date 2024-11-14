<template>
    <div class="header_container">
        <el-button v-if="!isCollapse" class="collapse_btn" @click="expandAside">
            <el-icon :size="24">
                <Fold />
            </el-icon>
        </el-button>
        <el-button v-else class="collapse_btn" @click="collapseAside">
            <el-icon :size="24">
                <Expand />
            </el-icon>
        </el-button>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// import {Expand, Fold} from ""
const isCollapse = ref(false)


const emits = defineEmits(['collapse', 'expand'])

const collapseAside = () => {
    isCollapse.value = !isCollapse.value
    emits('collapse')
}

const expandAside = () => {
    isCollapse.value = !isCollapse.value
    emits('expand')
}
</script>
<style scoped>
.header_container {
    height: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
}

.collapse_btn {
    height: 50px;
    width: 50px;
    border: none;
}
</style>