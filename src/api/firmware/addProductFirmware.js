import httpInstance from "@/utils/http";
export function ADDProductFirmware(data) {
    return httpInstance({
        url: '/firmware/add',
        method: 'POST',
        data: data
    })
}