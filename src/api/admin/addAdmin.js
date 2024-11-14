import httpInstance from "@/utils/http";
export function AddAdmin(adminQoList) {
    return httpInstance({
        url: '/admin/add',
        method: 'POST',
        data: adminQoList
    })
}