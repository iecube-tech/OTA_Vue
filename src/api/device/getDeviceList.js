import httpInstance from "@/utils/http";
export function GetDeviceList(productId) {
    return httpInstance({
        url: '/device/list',
        method: 'POST',
        params: { productId: productId }
    })
}