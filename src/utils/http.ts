//axios 封装
import axios from 'axios'
import router from '@/router';
import { ElMessage } from 'element-plus';

axios.defaults.withCredentials = true


declare module "axios" {
    interface AxiosResponse<T = any> {
        state: null;
        message: null;
    }
    export function create(config?: AxiosRequestConfig): AxiosInstance;
}


const httpInstance = axios.create({
    baseURL: '/dev-api',
    timeout: 100000
})

//拦截器
//请求拦截器
httpInstance.interceptors.request.use(config => {
    config.headers["Authorization"] = localStorage.getItem("Authorization")
    return config
}, e => Promise.reject(e))
//响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status !== 200) {
        if (e.response.status == 401) {
            router.push('/login')
            ElMessage.warning("登录过期 重新授权")

        } else if (e.response.status == 403) {
            router.push('/login')
            ElMessage.error("请求被拒绝，请登录")
        } else {
            ElMessage.error("响应错误：" + e.response.status)
        }
    }
    return Promise.reject(e)
})


export default httpInstance