import httpInstance from "@/utils/http";
export function GetPManages(nodeId) {
    return httpInstance({
        url: '/pm/' + nodeId,
        method: 'GET',
    })
}