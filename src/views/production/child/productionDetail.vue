<template>
    <div v-if="leaf != null">
        {{ leaf.name }}--生产版本
    </div>
    <div v-if="firmware != null" style="margin-top: 2em;">
        <el-form label-width="100px">
            <el-form-item label="审批时间：">
                <span>{{ formatDate(examine.examineTime) }}</span>
            </el-form-item>
            <el-form-item label="版本号：">
                <span>{{ firmware.version }}</span>
            </el-form-item>
            <el-form-item label="全量包：">
                <span>{{ firmware.isFull ? "是" : "否" }}</span>
            </el-form-item>
            <el-form-item label="软件包：">
                <span>{{ firmware.filename }}</span>
            </el-form-item>
            <el-form-item label="包类型：">
                <span>{{ firmware.type }}</span>
            </el-form-item>
            <el-form-item label="MD5：">
                <span>{{ firmware.md5 }}</span>
                <el-button link :icon="CopyDocument" title="复制" @click="handleCopy(firmware.md5)"></el-button>
            </el-form-item>
            <el-form-item label="字节大小：">
                <span>{{ firmware.size }}</span>
            </el-form-item>
            <el-form-item label="更新时间：">
                <span>{{ formatDate(firmware.createTime) }}</span>
            </el-form-item>
            <el-form-item label="版本特性：">
                <span>{{ firmware.description }}</span>
            </el-form-item>
            <el-form-item label="CDN：">
                <a :href="firmware.cdn">{{ firmware.cdn }}</a>
            </el-form-item>
            <el-form-item label="下载地址：">
                <a :href="firmware.link">{{ firmware.link }}</a>
            </el-form-item>
        </el-form>
    </div>
    <div v-else>
        <span>该产品形态暂无生产版本</span>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';
import { GetProduction } from '@/api/production/getProduction';
import { GetProduct } from '@/api/product/getProductNodeById.js'
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { CopyDocument } from '@element-plus/icons-vue'
import useClipboard from 'vue-clipboard3'
import dayjs from 'dayjs'

const formatDate = (time: string | Date) => {
    if (!time) {
        return ''
    }
    return dayjs(time).format('YYYY/MM/DD HH:mm')
}
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

interface productionExamine {
    id: number
    productId: number
    firmwareId: number
    creator: string
    createTime: string
    examineUnionId: string
    examineStatus: string // 审批状态
    examineMessageId: string // 审批消息id
    examineTime: string
}

const route = useRoute();
const productId = ref()
const productName = ref()
const firmware = ref<firmwareVo>()
const examine = ref<productionExamine>()

const { toClipboard } = useClipboard()
const handleCopy = async (text) => {
    try {
        await toClipboard(text)
        ElMessage.info("已复制")
    } catch (e) {
        ElMessage.error("复制失败")
    }
}


const getProduction = (id) => {
    GetProduction(id).then(res => {
        if (res.state == 200) {
            firmware.value = res.data.firmwareVo
            examine.value = res.data.productionExamine
        } else {
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

onBeforeMount(() => {
    setTimeout(() => {
        productId.value = route.params.id
        productName.value = route.params.name
        getThisProduct(productId.value)
        getProduction(productId.value)
    }, 50)
})
</script>
<style scoped></style>