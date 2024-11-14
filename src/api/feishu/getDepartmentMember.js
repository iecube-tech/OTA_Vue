import httpInstance from "@/utils/http";
export function GetDepartmentMember(departmentId) {
    return httpInstance({
        url: '/fs/members/' + departmentId,
        method: 'GET',
    })
}