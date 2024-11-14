import httpInstance from "@/utils/http";
export function DelProductionMember(member) {
    return httpInstance({
        url: '/p_member/del',
        method: 'DELETE',
        data: member
    })
}