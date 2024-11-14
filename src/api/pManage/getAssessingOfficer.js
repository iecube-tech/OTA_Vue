import httpInstance from "@/utils/http";
export function GetAssessingOfficer(nodeId) {
    return httpInstance({
        url: '/pm/assessing/officer/' + nodeId,
        method: 'GET',
    })
}