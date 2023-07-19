import { AuthContext } from "../../../contexts/auth";
import { Link } from "react-router-dom";
import { useContext } from "react";

export default function Navbar() {
    const { user } = useContext(AuthContext)

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">Talent Verify</Link>
                {
                    user ? <Link className="nav-link float-end" to="/admin">Admin</Link>
                    :<Link className="nav-link float-end" to="/login">Login</Link>
                }
            </div>
        </nav>
    )
}
