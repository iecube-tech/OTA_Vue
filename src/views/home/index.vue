<template>
    <div style="padding: 1em 2em;">
        <div>
            <p>设备主动升级检查的路径是:版本管理中最新的审核通过的版本。</p>
            <p>设备被动升级，向设备推送的版本是版本管理中最新的审核通过的版本。</p>
            <p>提交生产的版本：需要在版本管理中最新的审核通过的版本详情中【推送生产】， 经审核后推送到【生产】。</p>
        </div>

        <div v-if="admin">
            <a href="/admin">去系统管理端</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { IsAdmin } from '@/api/admin/isAdmin';
import { onMounted, ref } from 'vue';

const admin = ref(false)

onMounted(() => {
    IsAdmin().then(res => {
        if (res.state == 200) {
            admin.value = res.data
        }
    })
})
</script>
<style scoped></style>