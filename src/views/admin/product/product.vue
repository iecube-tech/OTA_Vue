<template>
    <el-container class="container">
        <el-aside class="left-aside">
            <EditTree @leaf-click="leafClick"> </EditTree>
        </el-aside>
        <el-main class="fixed-main" v-if="leaf != null">
            <RouterView />
            <!-- <RouterView :key="leaf.id + leaf.name" /> -->
        </el-main>
    </el-container>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import EditTree from '../../a_comment/editTree.vue';
import router from '@/router';
import { ref } from 'vue';

interface Tree {
    id: number
    pId: number
    name: string
    type: number
    deep: number
    children?: Tree[]
}

const leaf = ref<Tree>()
const leafClick = (data: Tree) => {
    leaf.value = data
    if (data.deep == 0) {
        router.push({
            name: 'productDetailInstruction'
        })
    } else if (data.deep >= 3) {
        if (data.type == 0) {
            router.push({
                name: 'productDetailDeveloper',
                params: { id: data.id }
            })
        }
        else {
            router.push({
                name: 'productDetailManager',
                params: { id: data.id }
            })
        }

    } else {
        router.push({
            name: 'productDetailMakePm',
            params: { id: data.id }
        })
    }
}
</script>
<style scoped>
.container {
    height: 100%;
}
</style>