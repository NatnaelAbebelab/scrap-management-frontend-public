export function capitalizeFirst(text: string): string {
    if (typeof text === "string" && text.length > 0) {
       return text.charAt(0).toUpperCase() + text.slice(1)
    }
    return ""
}