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
    return config
}, e => Promise.reject(e))
//响应拦截器
httpInstance.interceptors.response.use(res => res.data, e => {
    if (e.response.status !== 200) {
        if (e.response.status == 302) {
            router.push('/login')
        } else {
            ElMessage.error("响应错误：" + e.response.status)
        }
    }
    return Promise.reject(e)
})


export default httpInstance