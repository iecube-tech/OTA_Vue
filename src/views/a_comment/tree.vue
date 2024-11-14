<template>
    <div class="tree_div">
        <el-tree class="tree" :data="product" node-key="id" @node-click="handleNodeClick" highlight-current
            default-expand-all>
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span v-if="data.type == 1" class="node-left">
                        <el-icon :size="'1em'" style="margin-right: 0.5em;">
                            <Folder />
                        </el-icon>
                        <span>{{ data.name }}</span>
                    </span>
                    <span v-else class="node-left">
                        {{ data.name }}
                    </span>
                </span>
            </template>
        </el-tree>
    </div>
</template>

<script setup lang="ts">

import { AllProduct } from '@/api/product/allProduct.js'
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

interface Tree {
    id: number
    pId: number
    name: string
    type: number
    edit: number
    children?: Tree[]
}

const defaultProps = {
    children: 'children',
    label: 'name',
}

const emits = defineEmits(["leafClick"])

const handleNodeClick = (data: Tree) => {
    if (data.type == 0) {
        emits("leafClick", data)
    }
}

const product = ref<Tree[] | [] | any>([])



onBeforeMount(() => {
    AllProduct().then(res => {
        if (res.state == 200) {
            product.value.push(res.data)
        } else {
            ElMessage.error(res.message)
        }
    })
})
</script>
<style scoped>
.tree_div {
    height: 100%;
}

.tree {
    width: auto;
    height: 100%;
}

.custom-tree-node {
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.node-left {
    display: flex;
    align-items: center;
}

.node-right {
    display: flex;
    align-items: center;
}
</style>