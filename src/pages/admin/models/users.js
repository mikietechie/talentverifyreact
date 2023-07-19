import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Users () {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const users = localStorage.getItem('users')
        if (!users) {
            fetch('https://jsonplaceholder.typicode.com/users')
                .then(response => response.json())
                .then(json => {
                    const users = json.map(user => ({ id: user.id, name: user.name, email: user.email }))
                    setUsers(users)
                    localStorage.setItem('users', JSON.stringify(users))
                    setLoading(false)
                })
            } else {
                setUsers(JSON.parse(users))
                setLoading(false)
            }
    }, [])

    return (
        <div className="col-12">
            <h1>Users</h1>
            {loading && <p>Loading...</p>}
            <div>
                <Link to="/admin/users/add" className="btn btn-success">Add User</Link>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    <Link to={`/admin/users/edit/${user.id}`} className="btn btn-sm btn-primary ">Edit</Link>
                                    <Link to={`/admin/users/delete/${user.id}`} className="btn btn-sm btn-danger">Delete</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export function UsersAdd({ user }) {
    const navigate = useNavigate()
    user = user || { name: '', email: '' }
    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)

    const handleSubmit = (e) => {
        e.preventDefault()
        const users = localStorage.getItem('users')
        const usersArray = users ? JSON.parse(users) : []
        const newUser = { name, email }
        if (user.id) {
            usersArray[user.id - 1] = newUser
        } else {
            usersArray.push({...newUser, id: usersArray.length + 1})
        }
        localStorage.setItem('users', JSON.stringify(usersArray))
        navigate('/admin/users')
    }

    return (
        <div className="col-12">
            
            <h5 className="mb-3">User</h5>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="mb-3 text-center">
                    <Link to="/admin/users" className="btn btn-secondary mx-1">Back</Link>
                    <button type="submit" className="btn btn-primary mx-1">Save changes</button>
                </div>
            </form>
        </div>
    )
}
