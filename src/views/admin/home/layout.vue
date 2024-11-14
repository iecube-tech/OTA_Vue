<template>
    <div class="home-layout">
        <el-container style="max-height: 100vh;">
            <el-aside class="aside_left">
                <MENU :isCollapse="isCollapse"></MENU>
            </el-aside>
            <el-container>
                <el-header class="header">
                    <HEADER @collapse="collapseAside()" @expand="expandAside()"></HEADER>
                </el-header>
                <el-main style="padding: 0px;">
                    <RouterView />
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script setup lang="ts">
import MENU from "./menu.vue";
import HEADER from "./header.vue"
import { RouterView } from "vue-router";
import { ref } from "vue";

const isCollapse = ref(false)

const collapseAside = () => {
    isCollapse.value = false

}

const expandAside = () => {
    isCollapse.value = true
}
</script>
<style scoped>
.aside_left {
    width: auto
}

.header {
    padding: 0 0;
    height: 50px;
}
</style>