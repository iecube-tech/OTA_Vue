<template>
    <div>
        <el-table :data="deviceList" border style="width: 100%">
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
            <el-table-column fixed="right" label="操作" min-width="120">
                <template #default="scope">
                    <el-button v-if="scope.row.status && scope.row.connecting" link type="primary"
                        @click="handleDeviceUpgrade(scope.row, scope.$index)">
                        设备升级
                    </el-button>
                    <el-button v-else link>
                        设备升级
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog v-model="upgradeDialog" title="选择升级版本">
        <el-select v-model="firmwareIdChoice" placeholder="选择要升级的版本">
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


onBeforeMount(() => {
    setTimeout(() => {
        productId.value = route.params.id
        getDeviceList(productId.value)
        getFirmwareVoList(productId.value)
    }, 10)

})
</script>
<style scoped></style>