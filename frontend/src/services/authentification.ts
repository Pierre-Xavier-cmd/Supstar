import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: string;
  email: string;
  nom: string;
  prenom: string;
};


export const authentificationService = {
    logout : () => {
        localStorage.removeItem("token")
    },
    isConnected : () => {
        return !!localStorage.getItem("token")
    },

    getUser(): DecodedToken | null {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      return jwtDecode<DecodedToken>(token);
    } catch {
      return null;
    }
  },
}