import httpInstance from "@/utils/http";
export function AddDevelopers(nodeId, developerList) {
    return httpInstance({
        url: '/pm/' + nodeId + '/add_developer',
        method: 'POST',
        data: developerList
    })
}