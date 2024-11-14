import httpInstance from "@/utils/http";
export function IsAdmin() {
    return httpInstance({
        url: '/admin/is',
        method: 'GET',
    })
}