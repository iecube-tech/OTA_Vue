import httpInstance from "@/utils/http";
export function AddProductionMember(list) {
    return httpInstance({
        url: '/p_member/add',
        method: 'POST',
        data: list
    })
}