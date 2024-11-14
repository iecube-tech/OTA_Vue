<template>
    <div>
        <el-menu :default-active="active" class="menu" :collapse="props.isCollapse" router unique-opened>
            <el-menu-item index="/admin">
                <el-icon>
                    <Guide />
                </el-icon>
                <template #title>首页</template>
            </el-menu-item>
            <el-menu-item index="/admin/product">
                <el-icon><icon-menu /></el-icon>
                <template #title>产品管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/administrator">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <template #title>系统管理员</template>
            </el-menu-item>
            <el-menu-item index="/admin/production_member">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <template #title>生产人员</template>
            </el-menu-item>
        </el-menu>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router';

import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    Cpu,
    Suitcase,
    Grid,
    UserFilled,
    Guide,
    Loading,
} from '@element-plus/icons-vue'

const props = defineProps({
    isCollapse: Boolean
})
const route = useRoute();

const path = route.path;

// 找到第二个斜杠的索引
let secondSlashIndex = path.indexOf('/', path.indexOf('/') + 1);

const active = secondSlashIndex !== -1 ? path.substring(0, secondSlashIndex) : path;




</script>

<style>
.menu:not(.el-menu--collapse) {
    width: 240px;
}

.menu {
    height: 100vh;
}
</style>