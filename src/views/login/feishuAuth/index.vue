<template>
    <div>
        <div>飞书免登录demo</div>
    </div>

    <div v-if="sdk">
        h5sdk reday
        <div>appid: {{ appId }}</div>
        <div v-if="loginCode">login临时授权码: {{ loginCode }}</div>
        <div v-if="userInfo != null">userInfo:{{ userInfo.userInfoDto.name }}</div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { GetAppId } from '@/api/fsAuth/getAppId';
import { GetUserInfo } from '@/api/fsAuth/getUserInfo';
import router from '@/router';
import { ElMessage } from 'element-plus';

let lang = window.navigator.language;
console.log(lang);

const sdk = ref(false)
const appId = ref()
const loginCode = ref()
const userInfo = ref()

const apiAuth = async () => {
    if (!window.h5sdk) {
        console.log('不存在 h5sdk')
        alert('请在飞书中打开')
        return
    }
    sdk.value = true
    console.log()
    await GetAppId().then(res => {
        if (res.state == 200) {
            appId.value = res.data
            requestAccessLogin()
        } else {
            console.log("get appId error")
        }
    })

}

const requestAccessLogin = () => {
    window.h5sdk.error(err => {
        console.error(JSON.stringify(err))
    })
    window.h5sdk.ready(() => {
        console.log("window.h5sdk.ready");
        console.log("url:", window.location.href);
        tt.requestAccess({
            appID: appId.value,
            scopeList: [],
            success(res) {
                console.log("getAuthCode succeed");
                console.log(res)
                console.log(res.code)
                loginCode.value = res.code
                let code = res.code
                GetUserInfo(code).then(res2 => {
                    if (res2.state == 200) {
                        userInfo.value = res2.data
                        localStorage.setItem("Authorization", userInfo.value.userInfoDto.unionId)
                        localStorage.setItem("userInfo", res2.data)
                        router.push("/")
                    } else {
                        ElMessage.error("获取登录信息失败")
                    }
                })
            },
            // 获取失败后的回调
            fail(err) {
                console.log(`getAuthCode failed, err:`, JSON.stringify(err));
            }
        })
    })
}


onMounted(() => {
    apiAuth();
})

</script>
<style scoped></style>