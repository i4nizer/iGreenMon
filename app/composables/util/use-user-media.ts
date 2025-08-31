
//

export const useUserMedia = () => {
    // --- Request access to cameras
    const requestVideo = async (): Promise<SafeResult<MediaDeviceInfo[]>> => {
        try {
            const perm = await navigator.permissions.query({ name: "camera" })
    
            if (perm.state != "granted") {
                await navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then((stream) => stream.getTracks())
                    .then((tracks) => tracks.forEach((t) => t.stop()))
            }
            
            const devices = await navigator.mediaDevices.enumerateDevices()
            const videos = devices.filter((d) => d.kind === "videoinput")
            return { success: true, data: videos }
        } catch (error) {
            return { success: false, error: "Video request permission denied." }
        }
    }

    return { requestVideo }
}