import httpInstance from "@/utils/http";
export function GetAppId() {
    return httpInstance({
        url: '/auth/app_id',
        method: 'GET',
    })
}