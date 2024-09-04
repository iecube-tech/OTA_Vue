<template>
    <el-container class="container">
        <el-aside>
            <EditTree> </EditTree>
        </el-aside>
        <el-main>

        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import EditTree from '../a_comment/editTree.vue';
</script>
<style scoped>
.container {
    height: 100%;
}
</style>