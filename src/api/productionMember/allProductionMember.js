import httpInstance from "@/utils/http";
export function AllProductionMember() {
    return httpInstance({
        url: '/p_member/all',
        method: 'GET',
    })
}