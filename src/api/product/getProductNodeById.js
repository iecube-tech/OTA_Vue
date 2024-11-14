import httpInstance from "@/utils/http";
export function GetProduct(id) {
    return httpInstance({
        url: '/product/' + id,
        method: 'GET',
    })
}