<template>
    <div>
        <el-button type="primary" size="large" @click="firmwareDialog = true">发布新版本</el-button>
    </div>

    <el-row style="margin-top: 1em;">
        <span>产品Id：
            <span style="color: #33b8b9;">
                {{ route.params.id }}
            </span>
        </span>
    </el-row>

    <el-row style="margin-top: 1em;">
        <span>主动升级_mqtt_Topic：
            <span style="color: #33b8b9;">
                {{ 'IECUBE/OTA/' + route.params.id + '/ActiveUpgrade' }}
            </span>
        </span>
    </el-row>

    <el-descriptions v-for="(item, i) in firmwareVoList" :title="item.version" style="margin-top: 30px;">
        <el-descriptions-item label="包名称：">{{ item.originFilename }}</el-descriptions-item>
        <el-descriptions-item label="包类型：">{{ item.type }}</el-descriptions-item>
        <el-descriptions-item label="包上传时间：">{{ formatDate(item.createTime) }}</el-descriptions-item>
        <el-descriptions-item label="字节大小：">{{ item.size }}</el-descriptions-item>
        <el-descriptions-item label="MD5 :">
            {{ item.md5 }}
        </el-descriptions-item>
        <el-descriptions-item label="原始包地址:">
            <a :href="item.link">
                {{ item.link }}
            </a>
        </el-descriptions-item>

        <el-descriptions-item label="CDN地址:">
            <a :href="item.cdn">
                {{ item.cdn }}
            </a>
        </el-descriptions-item>

        <el-descriptions-item label="版本特性 :">
            {{ item.description }}
        </el-descriptions-item>
    </el-descriptions>


    <el-dialog :title="route.meta.title + '-版本发布'" v-model="firmwareDialog" width="700">
        <el-form label-width="100px" style="max-width: 600px" :rules="rules" ref="ruleFormRef" :model="newFirmware">
            <el-form-item label="版本号：" prop="version">
                <el-input v-model="newFirmware.version"></el-input>
            </el-form-item>
            <el-form-item label="版本特性：" prop="description">
                <el-input autosize type="textarea" v-model="newFirmware.description"></el-input>
            </el-form-item>
            <el-form-item label="软件包：" prop="resourceId">
                <el-upload ref="upload" class="upload-demo" drag action="/dev-api/files/upfile" :limit="1"
                    :on-success="uploadSuccess" clear-files>
                    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                    <div class="el-upload__text">
                        拖入文件 或<em> 点击上传 </em>
                    </div>
                    <template #tip>
                        <div class="el-upload__tip">
                            如果上传zip包，则自动解压到cdn站点。
                        </div>
                    </template>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="firmwareDialog = false">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">发布</el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { GETProductFirmware } from '@/api/firmware/getProductFirmware.js'
import { ADDProductFirmware } from '@/api/firmware/addProductFirmware.js'
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs'


const route = useRoute();
const productId = ref()

interface firmwareVo {
    productId: number
    productName: string
    version: string
    description: string
    filename: string
    originFilename: string
    type: string
    size: number
    md5: string
    createTime: Date
    link: string
    cdn: string
}
interface RuleForm {
    nodeId: number
    resourceId: number
    version: string
    description: string
}
const ruleFormRef = ref<FormInstance>()

const newFirmware = ref<RuleForm>({
    nodeId: <any>route.params.id,
    resourceId: null,
    version: '',
    description: '',
})

const rules = ref<FormRules>(
    {
        resourceId: [
            { required: true, message: '请上传版本软件包', trigger: 'blur' },
        ],
        version: [
            { required: true, message: '请输入版本号', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入版本特性', trigger: 'blur' },
        ],
    }
)

const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            addProductFirmware(JSON.parse(JSON.stringify(newFirmware.value)))
        } else {
            ElMessage.warning('请完善数据')
        }
    })
}
const formatDate = (time: string | Date) => {
    if (!time) {
        return ''
    }
    return dayjs(time).format('YYYY/MM/DD HH:mm')
}
const firmwareDialog = ref(false)
const firmwareVoList = ref<firmwareVo[] | []>()

const newFirmwareReset = () => {
    newFirmware.value.nodeId = <any>route.params.id
    newFirmware.value.description = ''
    newFirmware.value.version = ''
    newFirmware.value.resourceId = null
    upload.value.clearFiles()
}

const addProductFirmware = (data) => {
    ADDProductFirmware(data).then(res => {
        if (res.state == 200) {
            firmwareVoList.value = res.data
            firmwareDialog.value = false
            newFirmwareReset()
        }
        else {
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
const fileList = ref([])
const upload = ref()
const uploadSuccess = (res) => {
    if (res.state = 200) {
        newFirmware.value.resourceId = res.data.id
        console.log(fileList.value)
    } else {
        ElMessage.error("上传失败" + res.message)
    }

}

onBeforeMount(() => {
    setTimeout(() => {
        productId.value = route.params.id
        getFirmwareVoList(productId.value)


    }, 10);
})



</script>
<style scoped>
.upload-demo {
    width: 100%;
}
</style>