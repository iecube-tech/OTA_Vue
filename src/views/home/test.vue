<template>
    <div>
        <el-button @click="HandleGetParent()">父节点</el-button>

        <div v-if="data">
            {{ data }}
        </div>
        <el-button @click="HandleGetAssessingOfficer()"> 审批人员</el-button>
        <div v-if="data2">
            {{ data2 }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { GetProductParentList } from '@/api/product/getParentTree';
import { GetAssessingOfficer } from '@/api/pManage/getAssessingOfficer';
import { ElMessage } from 'element-plus';
import { ref } from 'vue';
const data = ref()
const HandleGetParent = () => {
    GetProductParentList(11).then(res => {
        if (res.state == 200) {
            data.value = res.data
        } else {
            ElMessage.error("error" + res.message)
        }
    })
}


const data2 = ref()
const HandleGetAssessingOfficer = () => {
    GetAssessingOfficer(11).then(res => {
        if (res.state == 200) {
            data2.value = JSON.parse(res.data).data.items
        } else {
            ElMessage.error("error" + res.message)
        }
    })
}
</script>
<style scoped></style>