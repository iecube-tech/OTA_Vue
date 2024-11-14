import httpInstance from "@/utils/http";
export function AllDepartments() {
    return httpInstance({
        url: '/fs/departments',
        method: 'GET',
    })
}