
//

type ToastItem = {
	text: string
	color: string
	timeout: number
}

//

export const useToast = () => {
	// --- Data
	const toasts = useState<ToastItem[]>("toast", () => [])

	// --- Loggers
	const log = (text: string, color: string, timeout: number = 3000) => {
		toasts.value.push({ text, color, timeout })
	}

    const info = (text: string, timeout: number = 3000) => {
        toasts.value.push({ text, color: "info", timeout })
    }
    
    const error = (text: string, timeout: number = 3000) => {
        toasts.value.push({ text, color: "error", timeout })
    }
    
    const warning = (text: string, timeout: number = 3000) => {
        toasts.value.push({ text, color: "warning", timeout })
    }

    const success = (text: string, timeout: number = 3000) => {
        toasts.value.push({ text, color: "success", timeout })
    }

    // --- Expose
    return { toasts, log, info, error, warning, success }
}
