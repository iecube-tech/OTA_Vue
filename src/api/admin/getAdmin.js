import httpInstance from "@/utils/http";
export function GetAdmin() {
    return httpInstance({
        url: '/admin/all',
        method: 'GET',
    })
}