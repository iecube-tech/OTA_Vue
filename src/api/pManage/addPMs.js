import httpInstance from "@/utils/http";
export function AddPMs(nodeId, developerList) {
    return httpInstance({
        url: '/pm/' + nodeId + '/add_pm',
        method: 'POST',
        data: developerList
    })
}