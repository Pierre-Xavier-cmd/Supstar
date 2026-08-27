
export const authentificationService = {
    logout : () => {
        localStorage.removeItem("token")
    },
    isConnected : () => {
        return !!localStorage.getItem("token")
    }
}