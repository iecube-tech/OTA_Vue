import httpInstance from "@/utils/http";
export function AllProduct() {
    return httpInstance({
        url: '/product/all',
        method: 'GET',
    })
}