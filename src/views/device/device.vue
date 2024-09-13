<template>
    <el-container class="container">
        <el-aside class="aside_two">
            <TREE @leafClick="leafClick"></TREE>
        </el-aside>
        <el-main v-if="leaf != null">
            <RouterView :key="leaf.id + leaf.name" />
        </el-main>
    </el-container>

</template>

<script setup lang="ts">
import TREE from '@/views/a_comment/tree.vue';
import router from '@/router';
import { ref } from 'vue';


interface Tree {
    id: number
    pId: number
    name: string
    type: number
    children?: Tree[]
}

const leaf = ref<Tree>()
const leafClick = (data: Tree) => {
    leaf.value = data
    router.push({
        name: 'deviceListOfProduct',
        params: { id: data.id, name: data.name }
    })
}
</script>
<style scoped>
.container {
    height: 100%
}

.aside_two {
    border-right: 1px;
}
</style>