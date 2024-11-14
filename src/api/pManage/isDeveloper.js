import httpInstance from "@/utils/http";
export function IsDeveloper(nodeId) {
    return httpInstance({
        url: '/pm/developer/is/' + nodeId,
        method: 'GET',
    })
}