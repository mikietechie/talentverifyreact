import { useContext, useState } from "react";
import { AuthContext } from "../../contexts/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { APIURL } from "../../contants";

export default function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null);
    const { setUser } = useContext(AuthContext)
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        if (username === '' || password === '') {
            setError('Username and password required')
            return
        }
        if (password.length < 4) {
            setError('Password must be at least 4 characters')
            return
        }
        try {
            const lres = await axios.post(`${APIURL}auth/get/`, {username, password})
            if (lres.status === 200) {
                const ures = await axios.get(`${APIURL}auth/current/`, {
                    headers: {
                        Authorization: `Bearer ${lres.data.access}`
                    }
                })
                if (ures.status === 200) {
                    const user = ures.data
                    user.tokens = lres.data
                    localStorage.setItem('user', JSON.stringify(user))
                    setUser(user)
                    navigate('/admin')
                } else {
                    alert(ures.status)
                }

            } else {
                alert(lres.status)
            }
        } catch (error) {
            alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
        }
    }

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12 mb-5">
                    <h1 className="text-center">Login</h1>
                </div>
                <div className="col-md-6 mx-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="mb-3 text-center">
                            <button type="submit" className="btn btn-primary px-5">
                                Login&nbsp;<i className="fa fa-sign-in"></i>
                            </button>
                        </div>
                        {error && <div className="alert alert-danger">{error}</div>}
                    </form>
                </div>
            </div>
        </div>
    );
}
