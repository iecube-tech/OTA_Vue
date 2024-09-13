<template>
    <div>
        <!-- <div>
            <el-button v-if="!isCollapse" type="primary" @click="isCollapse = true">折叠</el-button>
            <el-button v-else @click="isCollapse = false">展开</el-button>
        </div> -->
        <el-menu :default-active="active" class="menu" :collapse="props.isCollapse" router unique-opened>
            <el-menu-item index="/">
                <el-icon>
                    <Guide />
                </el-icon>
                <template #title>首页</template>
            </el-menu-item>
            <el-menu-item index="/product">
                <el-icon><icon-menu /></el-icon>
                <template #title>产品管理</template>
            </el-menu-item>
            <el-menu-item index="/firmware">
                <el-icon>
                    <Suitcase />
                </el-icon>
                <template #title>版本管理</template>
            </el-menu-item>
            <!-- <el-menu-item index="/">
                <el-icon>
                    <Suitcase />
                </el-icon>
                <template #title>软件管理</template>
            </el-menu-item> -->
            <el-menu-item index="/device">
                <el-icon>
                    <Grid />
                </el-icon>
                <template #title>设备管理</template>
            </el-menu-item>
            <!-- <el-menu-item index="/">
                <el-icon>
                    <UserFilled />
                </el-icon>
                <template #title>用户管理</template>
            </el-menu-item> -->
            <!-- <el-menu-item index="/other">
                <el-icon>
                    <document />
                </el-icon>
                <template #title>其他</template>
            </el-menu-item> -->

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