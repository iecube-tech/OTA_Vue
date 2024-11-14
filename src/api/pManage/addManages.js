import httpInstance from "@/utils/http";
export function AddManagers(nodeId, developerList) {
    return httpInstance({
        url: '/pm/' + nodeId + '/add_manager',
        method: 'POST',
        data: developerList
    })
}