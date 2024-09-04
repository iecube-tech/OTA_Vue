import httpInstance from "@/utils/http";
export function DelProduct(nodeQo) {
    return httpInstance({
        url: '/product/del',
        method: 'POST',
        data: nodeQo
    })
}