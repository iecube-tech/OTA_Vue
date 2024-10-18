import httpInstance from "@/utils/http";
export function GetUserInfo(code) {
    return httpInstance({
        url: '/auth/callback',
        method: 'GET',
        params: { code: code }
    })
}