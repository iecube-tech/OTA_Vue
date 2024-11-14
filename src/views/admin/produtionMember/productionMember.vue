<template>
    <div class="fixed-parent" style="margin: 1em 2em;">
        <el-row class="fixed-div" style="justify-content: space-between; align-items: center;">
            <div style="font-size: 1.5em;">
                生产团队
            </div>
            <div>
                <selectUser name="添加生产人员" :disable-list="disbleList" @confirm="confirmHandler" />
            </div>
        </el-row>

        <div>
            <el-table :data="ProductionMemberList" header-cell-class-name="table-header-cell"
                cell-class-name="table-cell" style="margin-top: 2em;">
                <el-table-column label="生产人员">
                    <template #default="scope">
                        <el-row style="align-items: center;">
                            <div v-if="scope.row"
                                style="display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 1em; overflow: hidden;">
                                <img style="width: 2em; height: 2em;" :src="scope.row.avatar" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.name }}</span>
                            </div>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间">
                    <template #default="scope">
                        {{ formatDate(scope.row.createTime) }}
                    </template>
                </el-table-column>
                <el-table-column label="添加人员">
                    <template #default="scope">
                        <el-row style="align-items: center;">
                            <div v-if="scope.row"
                                style="display: flex; align-items: center; justify-content: center; border-radius: 50%; margin-right: 1em; overflow: hidden;">
                                <img style="width: 2em; height: 2em;" :src="scope.row.creatorAvatar" alt="">
                            </div>
                            <div>
                                <span>{{ scope.row.creatorName }}</span>
                            </div>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-row>
                            <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" title="确定移除该成员吗"
                                @confirm="deleteHandler(scope.row)">
                                <template #reference>
                                    <el-button>移除</el-button>
                                </template>
                            </el-popconfirm>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import selectUser from '@/views/a_comment/selectUser.vue';
import dayjs from 'dayjs'
import { handleError, onBeforeMount, ref } from 'vue';
import { AllProductionMember } from '@/api/productionMember/allProductionMember';
import { AddProductionMember } from '@/api/productionMember/addProductionMember';
import { DelProductionMember } from '@/api/productionMember/delProductionMember';
import { ElMessage } from 'element-plus';

const formatDate = (time: string | Date) => {
    if (!time) {
        return ''
    }
    return dayjs(time).format('YYYY/MM/DD HH:mm')
}

interface ProductionMember {
    id: number,
    unionId: string,
    name: string,
    avatar: string,
    createTime: Date,
    creatorName: string,
    creatorUnionId: string,
    creatorAvatar: string,
}

interface ProductionMemberQo {
    unionId: string,
    name: string,
    avatar: string,
}

const ProductionMemberList = ref<Array<ProductionMember>>()
const disbleList = ref<Array<String>>([])

const flushDisbleList = (list: Array<ProductionMember>) => {
    disbleList.value = []
    list.forEach(item => {
        disbleList.value.push(item.unionId)
    });
}

const getProductionMembers = () => {
    AllProductionMember().then(res => {
        if (res.state == 200) {
            ProductionMemberList.value = res.data
            flushDisbleList(ProductionMemberList.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const addProductionMember = (ProductionMemberQoList: Array<ProductionMemberQo>) => {
    AddProductionMember(ProductionMemberQoList).then(res => {
        if (res.state == 200) {
            ProductionMemberList.value = res.data
            flushDisbleList(ProductionMemberList.value)
        } else {
            ElMessage.error(res.message)
            getProductionMembers()
        }
    })
}

const delProductionMember = (ProductionMemberQo: ProductionMemberQo) => {
    DelProductionMember(ProductionMemberQo).then(res => {
        if (res.state == 200) {
            ProductionMemberList.value = res.data
            flushDisbleList(ProductionMemberList.value)
        } else {
            ElMessage.error(res.message)
            getProductionMembers()
        }
    })
}

const confirmHandler = (members) => {
    let addList = []
    members.forEach(item => {
        let qo = <ProductionMemberQo>{}
        qo.name = item.name
        qo.avatar = item.avatar.avatar_72
        qo.unionId = item.union_id
        addList.push(qo)
    });
    addProductionMember(addList)
}

const deleteHandler = (ProductionMember: ProductionMember) => {
    let qo = <ProductionMemberQo>{}
    qo.unionId = ProductionMember.unionId
    qo.name = ProductionMember.name
    qo.avatar = ProductionMember.avatar
    console.log(qo)
    delProductionMember(qo)
}


onBeforeMount(() => {
    setTimeout(() => {
        getProductionMembers();
    }, 50)
})
</script>
<style scoped></style>