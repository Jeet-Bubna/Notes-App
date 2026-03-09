import api from "../api"
import { useState } from "react"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants"
import { Navigate, useNavigate } from "react-router-dom"
import "../styles/Form.css"

interface FormProps {
    route:string;
    method: "login" | "register"
}
function Form({method, route}: FormProps) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [, setLoading] = useState(false)
    const navigate = useNavigate();

    const name = method === "register" ? "register" : "login";  

   const submitData = async (e:React.FormEvent<HTMLFormElement>) => {

        setLoading(true);
        e.preventDefault();
        try{
            const res = await api.post(route, {username, password})
            if(method === "login"){
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/")
            } else {
                navigate("/login")
            }
        }
        catch (error){
            alert(error)
        } finally {
            setLoading(false)
        }
    }

    return <div>
        <h1>{name}</h1>
        <form onSubmit={submitData} className="form-container">
            <input 
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            
            <input 
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <button 
                className="form-button"
                type="submit"
            > {name} </button>
            
        </form>
    </div>
}

export default Form