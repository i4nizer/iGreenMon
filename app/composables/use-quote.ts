import { techQuotes } from "~/constants/qoute"

//

export const useQuote = () => {
    /** Provides random tech quote. */
    const getRandomQuote = () => {
        const len = techQuotes.length
        const idx = Math.ceil((len - 1) * Math.random())
        return techQuotes[idx]
    }

    // --- Expose
    return { getRandomQuote }
}