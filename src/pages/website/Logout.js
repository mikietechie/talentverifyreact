import { useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";

export default function Logout() {
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()
    
    useEffect(() => {
        setUser(null)
        localStorage.clear()
        setTimeout(() => {
            navigate('/')
        }, 0)
    })

    return (
        <div className="alert alert-info">
            <p>You have been logged out!</p>
        </div>
    )
    
}