<template>
    <div class="fixed-parent">
        <el-row class="fixed-div" style="justify-content: space-between; align-items: center;">
            <div style="font-size: 1.5em;">
                <span v-if="leaf">
                    {{ leaf.name }}
                </span>
                设备列表
            </div>
            <div>
            </div>
        </el-row>

        <el-table :data="deviceList" header-cell-class-name="table-header-cell" cell-class-name="table-cell"
            style="width: 100%;margin-top: 2em;">
            <el-table-column prop="did" label="设备Id" width="180" />
            <el-table-column prop="fun" label="设备类型" width="180" />
            <el-table-column prop="name" label="设备名" />
            <el-table-column prop="version" label="版本" />
            <el-table-column label="上线时间">
                <template #default="scope">
                    {{ dateFormat(scope.row.timeStamp) }}
                </template>
            </el-table-column>
            <el-table-column label="在线状态">
                <template #default="scope">
                    <el-button v-if="scope.row.connecting" link type="primary">在线 </el-button>
                    <el-button v-else link type="danger">离线 </el-button>
                </template>
            </el-table-column>

            <el-table-column label="离线行为">
                <template #default="scope">
                    <div v-if="!scope.row.connecting">
                        <el-button v-if="scope.row.activeDisconnection" link>正常离线</el-button>
                        <el-button v-else link type="danger">异常离线</el-button>
                    </div>
                </template>
            </el-table-column>
            <el-table-column v-if="isDeveloper" fixed="right" label="操作" width="200">
                <template #default="scope">
                    <el-button :disabled="!(scope.row.status && scope.row.connecting)"
                        @click="handleDeviceUpgrade(scope.row, scope.$index)">
                        下发版本
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="upgradeDialog" title="选择版本">
        <el-select v-model="firmwareIdChoice" placeholder="选择要下发的版本">
            <el-option v-for="item in firmwareVoList" :key="item.id" :value="item.id" :label="item.version">
                {{ item.version }}
            </el-option>
        </el-select>
        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSure">确定</el-button>
        </template>
    </el-dialog>
</template>
<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs'
import { GetDeviceList } from '@/api/device/getDeviceList.js'
import { DevicePassiveUpgrade } from '@/api/device/devicePassiveUpgrade.js'
import { GETProductFirmware } from '@/api/firmware/getProductFirmware.js'
import { GetProduct } from '@/api/product/getProductNodeById.js'
import { IsDeveloper } from '@/api/pManage/isDeveloper';
import { ElMessage } from 'element-plus';

const route = useRoute();
const productId = ref()

const deviceList = ref([])
const firmwareVoList = ref([])

const currentDeviceId = ref()
const currentRow = ref()
const firmwareIdChoice = ref()

const upgradeDialog = ref(false)

const dateFormat = (timestamp) => {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
const getDeviceList = (productId) => {
    GetDeviceList(productId).then(res => {
        if (res.state == 200) {
            deviceList.value = res.data
            for (let i = 0; i < 30; i++) {
                deviceList.value.push(deviceList.value[0])
            }
        } else {
            ElMessage.error(res.message)
        }
    })
}

const getFirmwareVoList = (id) => {
    GETProductFirmware(id).then(res => {
        if (res.state == 200) {
            firmwareVoList.value = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
}

const handleDeviceUpgrade = (row, index) => {
    console.log(row)
    console.log(index)
    currentRow.value = index
    currentDeviceId.value = row.did
    upgradeDialog.value = true
}

const handleCancel = () => {
    upgradeDialog.value = false
    firmwareIdChoice.value = null
    currentRow.value = null
}

const handleSure = () => {
    if (firmwareIdChoice.value == null) {
        ElMessage.warning("请选择版本")
        return
    }
    DevicePassiveUpgrade(currentDeviceId.value, firmwareIdChoice.value).then(res => {
        if (res.state == 200 && currentRow.value != null) {
            deviceList.value[currentRow.value] = res.data
            handleCancel()
        }
        else {
            ElMessage.error(res.message)
        }
    })
}

interface Tree {
    id: number
    pId: number
    name: string
    type: number
    children?: Tree[]
}

const leaf = ref<Tree>()
const getThisProduct = (id) => {
    GetProduct(id).then(res => {
        if (res.state == 200) {
            leaf.value = res.data
        } else {
            ElMessage.error(res.message)
        }
    })
}

const isDeveloper = ref(false)

const checkIsDeveloper = (nodeId) => {
    IsDeveloper(nodeId).then(res => {
        if (res.state == 200) {
            isDeveloper.value = res.data
        }
    })
}

onBeforeMount(() => {
    setTimeout(() => {
        productId.value = route.params.id
        getDeviceList(productId.value)
        getFirmwareVoList(productId.value)
        getThisProduct(productId.value)
        checkIsDeveloper(productId.value)
    }, 50)

})
</script>
<style scoped></style>