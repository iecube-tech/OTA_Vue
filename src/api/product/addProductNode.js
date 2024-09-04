import httpInstance from "@/utils/http";
export function AddProduct(nodeQo) {
    return httpInstance({
        url: '/product/add',
        method: 'POST',
        data: nodeQo
    })
}