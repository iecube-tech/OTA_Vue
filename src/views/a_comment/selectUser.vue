<template>
    <el-button type="primary" :size="size" @click="selectDepartmentDiaglog = true">
        {{ name }}
    </el-button>

    <el-dialog v-model="selectDepartmentDiaglog" title="选择成员" style="height: 50%;" @open="getContact()">
        <div style="height: 100%;">
            <el-form label-position="top">
                <el-form-item label="选择部门">
                    <el-select v-model="selectedDepartment" placeholder="选择部门" style="width: 100%" remote
                        @change="departmentsChanged">
                        <el-option key="open_department_id0" label="IECUBE" value="0" />
                        <el-option v-for="item in departments" :key="item.open_department_id" :label="item.name"
                            :value="item.open_department_id" />
                    </el-select>
                </el-form-item>

                <el-form-item label="选择成员">
                    <el-select v-model="selectedMembers" multiple placeholder="请先选择部门" style="width: 100%"
                        value-key="union_id" @change="debounce(departmentsChanged, 200)">
                        <el-option v-for="item in members" :key="item.union_id" :label="item.name" :value="item"
                            :disabled="disableList.includes(item.union_id)">
                            <el-row style="align-items: center;">
                                <div
                                    style="display: flex; align-items: center; border-radius: 50%; overflow: hidden; margin-right: 1em;">
                                    <img style="width: 2em; height: 2em;" :src="item.avatar.avatar_72" alt="">
                                </div>
                                <span>
                                    {{ item.name }}
                                </span>
                            </el-row>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <div>
                <el-button @click="selectDepartmentDiaglog = false">取消</el-button>
                <el-button type="primary" @click="SubmitEvent">
                    确定
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { AllDepartments } from '@/api/feishu/getAllDepartment'
import { GetDepartmentMember } from '@/api/feishu/getDepartmentMember'
import { ElMessage } from 'element-plus';
import { computed, onBeforeMount, onMounted, ref } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
    name: String,
    size: String,
    disableList: Array<String>
})

// const name = ref('选择成员')

// if (props.name) {
//     name.value = props.name
// }
const name = computed(() => props.name)

const size = computed(() => props.size)

const disableList = computed(() => props.disableList)

const departments = ref()

const selectedDepartment = ref()

const selectDepartmentDiaglog = ref(false)

const members = ref()

const selectedMembers = ref([])

const emits = defineEmits([
    'confirm'
])

const SubmitEvent = () => {
    console.log(selectedMembers)
    emits('confirm', selectedMembers.value)
    selectDepartmentDiaglog.value = false
    selectedMembers.value = null
}

const getContact = () => {
    AllDepartments().then(res => {
        if (res.state == 200) {
            departments.value = JSON.parse(res.data).data.items
        } else {
            ElMessage.warning(res.message)
        }
    })
}

const departmentsChanged = () => {
    console.log("already selected department:" + selectedDepartment.value)
    GetDepartmentMember(selectedDepartment.value).then(res => {
        if (res.state == 200) {
            members.value = JSON.parse(res.data).data.items
        } else {
            ElMessage.warning(res.message)
        }
    })
}

onMounted(() => {
    setTimeout(() => {

    }, 200)

})
</script>
<style scoped></style>