import httpInstance from "@/utils/http";
export function GetProductParentList(id) {
    return httpInstance({
        url: '/product/parent/' + id,
        method: 'GET',
    })
}