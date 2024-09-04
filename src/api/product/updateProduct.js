import httpInstance from "@/utils/http";
export function UpdateProduct(nodeQo) {
    return httpInstance({
        url: '/product/up',
        method: 'POST',
        data: nodeQo
    })
}