<template>
    <div class="fixed-parent">
        <el-row class="fixed-div" style="justify-content: space-between; align-items: center;">
            <div>
                <h1 style="font-size: 1.5em;">
                    产品经理
                </h1>
            </div>
            <div>
                <selectUser :name="'添加产品经理'" :disable-list="pmIdList" @confirm="confirmHandler" />
            </div>
        </el-row>

        <el-table :data="pms" header-cell-class-name="table-header-cell" cell-class-name="table-cell">
            <el-table-column label="成员">
                <template #default="scope">
                    <el-row style="align-items: center;">
                        <div v-if="scope.row"
                            style="display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 1em; overflow: hidden;">
                            <img style="width: 2em; height: 2em;" :src="scope.row.avatar.avatar_72" alt="">
                        </div>
                        <div>
                            <span>{{ scope.row.name }}</span>
                        </div>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column prop="mobile" label="电话" />
            <el-table-column prop="city" label="城市" />
            <el-table-column label="操作">
                <div>
                    <el-button>
                        移除
                    </el-button>
                </div>
            </el-table-column>
        </el-table>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import selectUser from '../../../a_comment/selectUser.vue';
import { GetPManages } from '@/api/pManage/getPManageList';
import { AddPMs } from '@/api/pManage/addPMs';
import { ElMessage } from 'element-plus';
import { debounce } from 'lodash';

const route = useRoute()

const nodeId = computed(() => route.params.id)

const pms = ref([])

const pmIdList = ref([])

watch(nodeId, (newNode) => {
    pms.value = []
    pmIdList.value = []
    getPManages()
})

const confirmHandler = (members) => {
    let unionIdList = []
    members.forEach(item => {
        unionIdList.push(item.union_id)
    });
    AddPMs(nodeId.value, unionIdList).then(res => {
        if (res.state == 200) {
            let d = []
            pms.value = JSON.parse(res.data).data.items
            pms.value.forEach(item => {
                d.push(item.union_id)
            })
            pmIdList.value = d
        } else {
            ElMessage.error(res.message)
        }
    })
}

const getPManages = () => {
    GetPManages(nodeId.value).then(res => {
        if (res.state == 200) {
            let d = []
            pms.value = JSON.parse(res.data).data.items
            pms.value.forEach(item => {
                d.push(item.union_id)
            })
            pmIdList.value = d
        } else {
            ElMessage.error(res.message)
        }
    })
}
onMounted(() => {
    setTimeout(() => {
        getPManages()
    }, 100)
})
</script>
<style scoped></style>