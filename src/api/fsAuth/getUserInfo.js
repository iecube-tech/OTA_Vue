import httpInstance from "@/utils/http";
export function GetUserInfo(code) {
    return httpInstance({
        url: '/auth/login',
        method: 'GET',
        params: { code: code }
    })
}