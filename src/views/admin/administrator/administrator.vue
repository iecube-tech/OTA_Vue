<template>
    <div class="fixed-parent" style="margin: 1em 2em;">
        <el-row class="fixed-div" style="justify-content: space-between; align-items: center;">
            <div style="font-size: 1.5em;">
                系统管理员
            </div>
            <div>
                <selectUser name="添加系统管理员" :disable-list="disbleList" @confirm="confirmHandler" />
            </div>
        </el-row>

        <div>
            <el-table :data="adminList" header-cell-class-name="table-header-cell" cell-class-name="table-cell"
                style="margin-top: 2em;">
                <el-table-column label="管理员">
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
import { GetAdmin } from '@/api/admin/getAdmin';
import { DelAdmin } from '@/api/admin/delAdmin';
import { AddAdmin } from '@/api/admin/addAdmin';
import { ElMessage } from 'element-plus';

const formatDate = (time: string | Date) => {
    if (!time) {
        return ''
    }
    return dayjs(time).format('YYYY/MM/DD HH:mm')
}

interface AdminMember {
    id: number,
    unionId: string,
    name: string,
    avatar: string,
    createTime: Date,
    creatorName: string,
    creatorUnionId: string,
    creatorAvatar: string,
}

interface AdminQo {
    unionId: string,
    name: string,
    avatar: string,
}

const adminList = ref<Array<AdminMember>>()
const disbleList = ref<Array<String>>([])

const flushDisbleList = (list: Array<AdminMember>) => {
    disbleList.value = []
    list.forEach(item => {
        disbleList.value.push(item.unionId)
    });
}

const getAdminMembers = () => {
    GetAdmin().then(res => {
        if (res.state == 200) {
            adminList.value = res.data
            flushDisbleList(adminList.value)
        } else {
            ElMessage.error(res.message)
        }
    })
}

const addAdminMember = (adminQoList: Array<AdminQo>) => {
    AddAdmin(adminQoList).then(res => {
        if (res.state == 200) {
            adminList.value = res.data
            flushDisbleList(adminList.value)
        } else {
            ElMessage.error(res.message)
            getAdminMembers()
        }
    })
}

const delAdminMember = (adminQo: AdminQo) => {
    DelAdmin(adminQo).then(res => {
        if (res.state == 200) {
            adminList.value = res.data
            flushDisbleList(adminList.value)
        } else {
            ElMessage.error(res.message)
            getAdminMembers()
        }
    })
}

const confirmHandler = (members) => {
    let addList = []
    members.forEach(item => {
        let qo = <AdminQo>{}
        qo.name = item.name
        qo.avatar = item.avatar.avatar_72
        qo.unionId = item.union_id
        addList.push(qo)
    });
    addAdminMember(addList)
}

const deleteHandler = (adminMember: AdminMember) => {
    let qo = <AdminQo>{}
    qo.unionId = adminMember.unionId
    qo.name = adminMember.name
    qo.avatar = adminMember.avatar
    console.log(qo)
    delAdminMember(qo)
}


onBeforeMount(() => {
    setTimeout(() => {
        getAdminMembers();
    }, 50)
})
</script>
<style scoped></style>