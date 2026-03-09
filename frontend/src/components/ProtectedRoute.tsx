import { jwtDecode } from "jwt-decode";
import { ACCESS_TOKEN, REFRESH_TOKEN} from "../constants";
import { useEffect, useState, type ReactNode } from "react";
import api from "../api";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: ReactNode
}

function ProtectedRoute ({children}:ProtectedRouteProps) {
    const [isAuthorized, setAuthorize] = useState<null | boolean>(null)
    
    useEffect(() => {
        auth().catch(() => setAuthorize(false));
    }, [])

    const refreshToken = async () =>  {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN)
        try {
            const resp = await api.post("/api/token/refresh/", {refresh: refreshToken,})

            if (resp.status === 200){
                localStorage.setItem(ACCESS_TOKEN, resp.data.access)
                setAuthorize(true)
            } else {
                setAuthorize(false)
            }

        } catch (error){
            console.log(error)
            setAuthorize(false)
        }

    }

    const auth = async () => {

        console.log("test log to see if this work")

        const access_token = localStorage.getItem(ACCESS_TOKEN)
        
        if ( access_token == null) {
            setAuthorize(false)
            console.log("no access token found")
            return
        }

        const decoded = jwtDecode(access_token)
        
        
        const expiration = decoded.exp

        if (expiration === undefined){
            setAuthorize(false)
            console.log("error occured in jwt")
            return
        }

        const now = Date.now() / 1000 // to get it in seconds

        if (expiration < now) {
            await refreshToken()

        } else {
            setAuthorize(true)
            console.log("authorized")
        }

    }

        if (isAuthorized === null){
            return <div>Loading...</div>
        
        }
    return isAuthorized ? children : <Navigate to="/login"/>
}

export default ProtectedRoute