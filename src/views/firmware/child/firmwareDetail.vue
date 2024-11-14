<template>

    <div class="fixed-parent">
        <el-row class="fixed-div" v-if="leaf" style="align-items: center; justify-content: space-between;">
            <div>
                <span>
                    {{ leaf.name }}
                </span>

                <span style="margin-left: 2em;">
                    <span id="product-topic" style="color: #33b8b9;">
                        {{ 'IECUBE/OTA/' + route.params.id + '/ActiveUpgrade' }}
                    </span>
                    <el-button link :icon="CopyDocument" title="复制"
                        @click="handleCopy('IECUBE/OTA/' + route.params.id + '/ActiveUpgrade')"></el-button>
                </span>
            </div>
            <div>
                <el-button v-if="isDeveloper" type="primary" size="large"
                    @click="firmwareDialog = true">发布新版本</el-button>
            </div>
        </el-row>

        <el-table :data="firmwareVoList" header-cell-class-name="table-header-cell" cell-class-name="table-cell"
            style="margin-top: 2em;">
            <el-table-column prop="version" label="版本" width="150"></el-table-column>
            <el-table-column prop="originFilename" label="软件包名称"></el-table-column>
            <el-table-column prop="size" label="字节大小" width="150"></el-table-column>
            <el-table-column prop="md5" label="MD5"></el-table-column>
            <el-table-column label="更新时间">
                <template #default="scope">
                    {{ formatDate(scope.row.createTime) }}
                </template>
            </el-table-column>
            <el-table-column label="操作" width=150>
                <template #default="scope">
                    <el-row>
                        <el-button @click="versionDetail(scope.row)">详情</el-button>
                    </el-row>
                </template>
            </el-table-column>
        </el-table>
    </div>

    <el-dialog :title="route.meta.title + '-版本发布'" v-model="firmwareDialog" width="700">
        <el-form label-width="100px" style="max-width: 600px" :rules="rules" ref="ruleFormRef" :model="newFirmware">
            <el-form-item label="版本号：" prop="version">
                <el-input v-model="newFirmware.version"></el-input>
            </el-form-item>
            <el-form-item label="全量包：" prop="isFull">
                <el-radio-group v-model="newFirmware.isFull">
                    <el-radio :value="true">是</el-radio>
                    <el-radio :value="false">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="版本特性：" prop="description">
                <el-input autosize type="textarea" v-model="newFirmware.description"></el-input>
            </el-form-item>
            <el-form-item label="软件包：" prop="resourceId">
                <el-upload ref="upload" class="upload-demo" drag action="/dev-api/files/upfile" :limit="1"
                    :headers="header" :on-success="uploadSuccess" clear-files>
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
            <el-form-item label="审批人：" prop="examineUnionId">
                <el-select v-model="newFirmware.examineUnionId" placeholder="选择审批人员" style="width: 100%">
                    <el-option v-for="item in assessingOfficerList" :key="item.union_id" :label="item.name"
                        :value="item.union_id">
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
        <template #footer>
            <div class="dialog-footer">
                <el-button @click="firmwareDialog = false">取消</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)">发布</el-button>
            </div>
        </template>
    </el-dialog>

    <el-dialog v-model="versionDetailDialog" :title="'版本详情'">
        <div v-if="selectFirmware != null">
            <el-form label-width="100px">
                <el-form-item label="版本号：">
                    <span>{{ selectFirmware.version }}</span>
                </el-form-item>
                <el-form-item label="全量包：">
                    <span>{{ selectFirmware.isFull ? "是" : "否" }}</span>
                </el-form-item>
                <el-form-item label="软件包：">
                    <span>{{ selectFirmware.filename }}</span>
                </el-form-item>
                <el-form-item label="包类型：">
                    <span>{{ selectFirmware.type }}</span>
                </el-form-item>
                <el-form-item label="MD5：">
                    <span>{{ selectFirmware.md5 }}</span>
                    <el-button link :icon="CopyDocument" title="复制" @click="handleCopy(selectFirmware.md5)"></el-button>
                </el-form-item>
                <el-form-item label="字节大小：">
                    <span>{{ selectFirmware.size }}</span>
                </el-form-item>
                <el-form-item label="更新时间：">
                    <span>{{ formatDate(selectFirmware.createTime) }}</span>
                </el-form-item>
                <el-form-item label="版本特性：">
                    <span>{{ selectFirmware.description }}</span>
                </el-form-item>
                <el-form-item label="CDN：">
                    <a :href="selectFirmware.cdn">{{ selectFirmware.cdn }}</a>
                </el-form-item>
                <el-form-item label="下载地址：">
                    <a :href="selectFirmware.link">{{ selectFirmware.link }}</a>
                </el-form-item>
                <el-form-item v-if="isDeveloper" label="操作:">
                    <el-button type="primary" size="small" @click="pushToProduction(selectFirmware.id)">推送生产</el-button>
                </el-form-item>
            </el-form>
        </div>


    </el-dialog>

    <el-dialog v-model="pushProductionDialog" title="推送生产" style="max-width:800px">
        <el-form label-width="100px" style="max-width: 600px" :rules="productionQoRules" ref="pushProductionFormRef"
            :model="productionQo">
            <el-form-item label="审批人：" prop="unionId">
                <el-select v-model="productionQo.unionId" placeholder="选择审批人员" style="width: 100%">
                    <el-option v-for="item in assessingOfficerList" :key="item.union_id" :label="item.name"
                        :value="item.union_id">
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
        <template #footer>
            <el-button @click="pushProductionDialog = false">取消</el-button>
            <el-button type="primary" @click="confirmPushProduction(pushProductionFormRef)"> 确定 </el-button>
        </template>
    </el-dialog>

</template>

<script setup lang="ts">
import { onBeforeMount, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import type { ComponentSize, FormInstance, FormRules } from 'element-plus'
import { CopyDocument } from '@element-plus/icons-vue'
import { GETProductFirmware } from '@/api/firmware/getProductFirmware.js'
import { ADDProductFirmware } from '@/api/firmware/addProductFirmware.js'
import { GetProduct } from '@/api/product/getProductNodeById.js'
import { IsDeveloper } from '@/api/pManage/isDeveloper';
import { PushProduction } from '@/api/production/pushProduction';
import { GetAssessingOfficer } from '@/api/pManage/getAssessingOfficer';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs'
import useClipboard from 'vue-clipboard3'


const route = useRoute();
const productId = ref()

interface firmwareVo {
    id: number
    productId: number
    productName: string
    version: string
    isFull: Boolean
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
    isFull: Boolean
    description: string
    examineUnionId: string
}
const ruleFormRef = ref<FormInstance>()

const header = ref({
    "Authorization": localStorage.getItem("Authorization")
})

const newFirmware = ref<RuleForm>({
    nodeId: <any>route.params.id,
    resourceId: null,
    version: '',
    isFull: null,
    description: '',
    examineUnionId: null
})

const rules = ref<FormRules>(
    {
        resourceId: [
            { required: true, message: '请上传版本软件包', trigger: 'blur' },
        ],
        version: [
            { required: true, message: '请输入版本号', trigger: 'blur' },
        ],
        isFull: [
            { required: true, message: '请说明是否为全量包', trigger: 'blur' },
        ],
        description: [
            { required: true, message: '请输入版本特性', trigger: 'blur' },
        ],
        examineUnionId: [
            { required: true, message: '请选择审批人', trigger: 'blur' },
        ]

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

const versionDetailDialog = ref(false)
const selectFirmware = ref<firmwareVo>()
const versionDetail = (f: firmwareVo) => {
    versionDetailDialog.value = true
    console.log(f)
    selectFirmware.value = f
}

const { toClipboard } = useClipboard()
const handleCopy = async (text) => {
    try {
        await toClipboard(text)
        ElMessage.info("已复制")
    } catch (e) {
        ElMessage.error("复制失败")
    }
}

const pushProductionFormRef = ref<FormInstance>()

const productionQo = ref({
    firmwareId: null,
    unionId: null
})

const productionQoRules = ref<FormRules>({
    unionId: [{ required: true, message: '请选择审批人', trigger: 'blur' }]
})

const pushProductionDialog = ref(false)
const pushToProduction = (firmwareId) => {
    productionQo.value.firmwareId = firmwareId
    // productionQo.value.unionId = "on_04441ed8744548c69a9bc83a06e4ab2a"
    pushProductionDialog.value = true
}

const confirmPushProduction = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate((valid, fields) => {
        if (valid) {
            PushProduction(productionQo.value).then(res => {
                if (res.state == 200) {
                    ElMessage.success("已提交")
                    pushProductionDialog.value = false
                } else {
                    ElMessage.error(res.message)
                }
            })
        } else {
            ElMessage.warning('请完善数据')
        }
    })
}

const assessingOfficerList = ref()
const getAssessingOfficer = (id) => {
    GetAssessingOfficer(id).then(res => {
        if (res.state == 200) {
            if (res.data) {
                assessingOfficerList.value = JSON.parse(res.data).data.items
            }
        } else {
            ElMessage.error("error" + res.message)
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
        getThisProduct(productId.value)
        getFirmwareVoList(productId.value)
        getAssessingOfficer(productId.value)
        checkIsDeveloper(productId.value)
    }, 50);
})



</script>
<style scoped>
.upload-demo {
    width: 100%;
}
</style>