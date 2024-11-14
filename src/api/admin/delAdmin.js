import httpInstance from "@/utils/http";
export function DelAdmin(adminMemberQo) {
    return httpInstance({
        url: '/admin/del',
        method: 'POST',
        data: adminMemberQo
    })
}