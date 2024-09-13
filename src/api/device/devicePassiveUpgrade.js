import httpInstance from "@/utils/http";
export function DevicePassiveUpgrade(terminalDid, firmwareId) {
    return httpInstance({
        url: '/device/upgrade',
        method: 'POST',
        params: { terminalDid: terminalDid, firmwareId: firmwareId }
    })
}