import httpInstance from "@/utils/http";
export function GetProduction(productId) {
    return httpInstance({
        url: '/production/get/' + productId,
        method: 'GET',
    })
}