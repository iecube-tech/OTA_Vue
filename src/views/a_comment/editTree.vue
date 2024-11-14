<template>
    <div class="tree_div">
        <el-tree class="tree" :data="product" node-key="id" default-expand-all :expand-on-click-node="false"
            :highlight-current="true" @node-click="handleNodeClick">
            <template #default="{ node, data }">
                <span class="custom-tree-node">
                    <span v-if="data.type == 1" class="node-left">
                        <el-icon :size="'1em'" style="margin-right: 0.5em;">
                            <Folder />
                        </el-icon>
                        <span v-if="data.edit === 0">{{ data.name }}</span>
                        <el-input v-else v-model="data.name" class="node-left-input" @change="nodeNameChange(data)"
                            @blur="data.edit = 0"></el-input>
                    </span>
                    <span v-else class="node-left">
                        <span v-if="data.edit === 0">{{ data.name }}</span>
                        <el-input v-else v-model="data.name" class="node-left-input" @change="nodeNameChange(data)"
                            @blur="data.edit = 0"></el-input>
                    </span>
                    <span class="node-right">
                        <el-popover ref="popover1" v-if="data.type == 1" placement="bottom" :width="80" trigger="click">
                            <template #reference>
                                <el-button link :icon="Plus"></el-button>
                            </template>
                            <div
                                style="display: flex; flex-direction: column; justify-content: flex-start; align-items: center;">
                                <el-row style="width: 100%;">
                                    <el-button link style="width: 100%;line-height: 2;"
                                        @click="appendNode(data)">分枝</el-button>
                                </el-row>
                                <el-row style="width: 100%;">
                                    <el-button link style="width: 100%;line-height: 2;"
                                        @click="appendLeaf(data)">节点</el-button>
                                </el-row>
                            </div>
                        </el-popover>
                        <el-popover ref="popover" v-if="data.pId !== 0" placement="bottom" :width="80" trigger="click">
                            <template #reference>
                                <el-button link :icon="MoreFilled"></el-button>
                            </template>
                            <div>
                                <el-row style="width:100%">
                                    <el-button link :icon="Edit" style="width: 100%; line-height: 2;"
                                        @click="data.edit = 1; popover.hide()">编辑</el-button>
                                </el-row>
                                <el-row style="width:100%">
                                    <el-button type="danger" link :icon="Delete" style="width: 100%; line-height: 2;"
                                        @click="deleteNode(data)">删除</el-button>
                                </el-row>
                            </div>
                        </el-popover>
                    </span>
                </span>
            </template>
        </el-tree>
        <el-dialog v-model="delDialog" title="确认删除" width="500" align-center>
            <span>删除后不可恢复，确定删除吗？</span>
            <template #footer>

                <el-button @click="delDialog = false">取消</el-button>
                <el-button type="danger" @click="delNode()">
                    确认
                </el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { AllProduct } from '@/api/product/allProduct.js';
import { UpdateProduct } from '@/api/product/updateProduct.js';
import { AddProduct } from '@/api/product/addProductNode.js';
import { DelProduct } from '@/api/product/delProductNode.js';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import {
    Plus,
    MoreFilled,
    Delete,
    Edit
} from '@element-plus/icons-vue'

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
    console.log('dian')
    emits("leafClick", data)
}

const product = ref<Tree[] | [] | any>([])

const nodeNameChange = (data: Tree) => {
    data.edit = 0
    if (data.id) {
        UpdateProduct(data).then(res => {
            if (res.state == 200) {
                data = res.data
            } else {
                ElMessage.error(res.state + res.message)
            }
        })
    } else {
        AddProduct(data).then(res => {
            if (res.state == 200) {
                product.value = []
                product.value.push(res.data)
            } else {
                ElMessage.error(res.state + res.message)
                getAll();
            }
        })
    }

}

const appendLeaf = (data: Tree) => {
    popover1.value.hide()
    const newChild = {
        id: null,
        pId: data.id,
        name: '未命名',
        type: 0,
        edit: 1,
    }
    if (!data.children) {
        data.children = []
    }
    data.children.push(newChild)
    product.value = [...product.value]
}

const appendNode = (data: Tree) => {
    popover1.value.hide()
    const newChild = {
        id: null,
        pId: data.id,
        name: '未命名',
        type: 1,
        edit: 1,
    }
    if (!data.children) {
        data.children = []
    }
    data.children.push(newChild)
    product.value = [...product.value]
}

const willDeleteNode = ref<Tree | null>()
const delDialog = ref(false)
const deleteNode = (data: Tree) => {
    console.log(data.id)
    popover.value.hide()
    willDeleteNode.value = JSON.parse(JSON.stringify(data))
    console.log(willDeleteNode.value)
    delDialog.value = true
}

const delNode = () => {
    console.log(willDeleteNode.value)
    DelProduct(willDeleteNode.value).then(res => {
        if (res.state == 200) {
            product.value = []
            product.value.push(res.data)
            delDialog.value = false
        } else {
            ElMessage.error(res.message)
        }
    })
}


const popover = ref(null)
const popover1 = ref(null)

const getAll = () => {
    AllProduct().then(res => {
        if (res.state == 200) {
            product.value.push(res.data)
        } else {
            ElMessage.error(res.state + res.message)
        }
    })
}


onBeforeMount(() => {
    getAll();
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

.node-left-input {
    height: var(--el-tree-node-content-height);
}

.node-right {
    display: flex;
    align-items: center;
}
</style>