import httpInstance from "@/utils/http";
export function PushProduction(productionQo) {
    return httpInstance({
        url: '/production/push',
        method: 'POST',
        data: productionQo
    })
}