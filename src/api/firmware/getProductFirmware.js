import httpInstance from "@/utils/http";
export function GETProductFirmware(id) {
    return httpInstance({
        url: '/firmware/list/' + id,
        method: 'GET',
    })
}