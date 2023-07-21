import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { APIURL } from "../../../contants"
import { FormErrors } from "../components/FormErrors"

export const UserList = ({user}) => {
  const [items, setItems] = useState([])

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/user/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setItems(res.data)
    } catch (error) {
      alert("Failed to load items!")
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const deleteItem = async (id) => {
    if (!user.is_superuser) {
        alert("U need to be a superuser to delete users!!!")
        return
    }
    const confirmed = window.confirm(`Are you sure you want to delete user with id #${id}?`)
    if (confirmed) {
      try {
        await axios.delete(`${APIURL}api/user/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
        loadData()
        alert("Item Deleted")
      } catch (error) {
        alert("Failed to delete!")
      }
    }
  }

  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start mb-3">
          <i className="fa fa-users"></i>&nbsp;User List
        </h4>
        <div className="text-end">
          <button onClick={loadData} className="btn btn-sm btn-secondary mx-1">
            <i className="fa fa-refresh"></i>&nbsp;Refresh
          </button>
          <Link to="/admin/user/add" className="btn btn-sm btn-primary">
            <i className="fa fa-plus"></i>&nbsp;Add
          </Link>
        </div>
      </div>
      <div className="col-12">
        <div className="table-responsive">
          <table className="table table-sm table-bordered table-striped table-hover w-100">
            <thead>
              <tr>
                <th>ID</th>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.first_name}</td>
                  <td>{item.last_name}</td>
                  <td>{item.username}</td>
                  <td>{item.email}</td>
                  <td>{item.role}</td>
                  <td className="text-center">
                    <span className="btn-group">
                      <Link className="btn btn-sm btn-success" to={`/admin/user/detail/${item.id}`}>
                        <i className="fa fa-eye"></i>
                      </Link>
                      <Link className="btn btn-sm btn-secondary" to={`/admin/user/edit/${item.id}`}>
                        <i className="fa fa-edit"></i>
                      </Link>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteItem(item.id)}>
                        <i className="fa fa-trash"></i>
                      </button>
                    </span>
                  </td>
                </tr>
              ))
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

export const UserAddUpdate = ({user}) => {
  const [options, setOptions] = useState({})
  const [item, setItem] = useState({})
  const [errors, setErrors] = useState({})
  const {id}= useParams()
  const formElement = useRef()
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/user/form/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setOptions(res.data)
    } catch (error) {
      alert("Failed to load form options!")
    }
    if (id) {
      try {
        const res = await axios.get(`${APIURL}api/user/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
        setItem(res.data)
      } catch (error) {
        alert("Failed to load update item!")
      }
    }
  }, [user, id])

  useEffect(() => {
    loadData()
  }, [loadData])

  const submitForm = async (e) => {
    e.preventDefault()
    if (id && !user.is_superuser) {
        alert("U need to be a superuser to update users!!!")
        return false
    }
    const formData = new FormData(formElement.current)
    try {
      setErrors({})
      const res = await axios[id ? "put" : "post"](`${APIURL}api/user/${id ? `${id}/` : ""}`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Item ${id ? "Updated" : "Created"}!`)
        navigate('/admin/user/list')
      } else {
        alert("Failed to save!")
      }
    } catch (error) {
      setErrors(error?.response?.data || {})
      alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
    }
    return false
  }


  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start">
          <i className="fa fa-users"></i>&nbsp;User {id ? `Update #${id}` : "Add"}
        </h4>
      </div>
      <div className="col-12">
       {
        id && !item?.id ? (
          <div className="alert w-75 mx-auto py-5">
            <p className="display-3">Loading</p>
          </div>
        ) : (
        <form className="row" ref={formElement} onSubmit={submitForm}>
          {
            Object.keys(errors).length ? (
              <div className="col-12 mb-3">
                <FormErrors errors={errors} />
              </div>
            ) : ""
          }
          {/* <div className="col-md-6 mb-3">
            <label className="form-label">Permissions</label>
            <select name="user_permissions" required={true} defaultValue={item.user_permissions || []} type="text" className="form-select" multiple={true}>
              <option value=""></option>
              {
                (options?.user_permissions?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Groups</label>
            <select name="groups" required={true} defaultValue={item.groups || []} type="text" className="form-select" multiple={true}>
              <option value=""></option>
              {
                (options?.groups?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div> */}
          <div className="col-md-6 mb-3">
            <label className="form-label">Role</label>
            <select name="role" required={true} defaultValue={item.role || ""} type="text" className="form-select" multiple={false}>
              {
                (options?.role?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input name="first_name" required={true} defaultValue={item.first_name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input name="last_name" required={true} defaultValue={item.last_name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input name="username" required={true} defaultValue={item.username || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input name="email" required={true} defaultValue={item.email || ""} type="email" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Password</label>
            <input name="password" required={true} defaultValue={item.password || ""} type="password" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Is Active</label>
            <input name="is_active" defaultChecked={item.is_active} type="checkbox" className="form-check" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Is Superuser</label>
            <input name="is_superuser" defaultChecked={item.is_superuser} type="checkbox" className="form-check" />
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/user/list">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}

export const UserDetails = ({user}) => {
  const [item, setItem] = useState({})
  const { id }= useParams()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/user/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setItem(res.data)
    } catch (error) {
      alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
    }
  }, [user, id])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start">
          <i className="fa fa-users"></i>&nbsp;User #{id}
        </h4>
      </div>
      <div className="col-12">
       {
        id && !item?.id ? (
          <div className="alert w-75 mx-auto py-5">
            <p className="display-3">Loading</p>
          </div>
        ) : (
        <form className="row">
          <div className="col-md-6 mb-3">
            <p className="form-label">First Name</p>
            <p>{item.first_name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Last Name</p>
            <p>{item.last_name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Username</p>
            <p>{item.username}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Email</p>
            <p>{item.email}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Role</p>
            <p>{item.role}</p>
          </div>
          {/* <div className="col-md-6 mb-3">
            <p className="form-label">Is Active</p>
            <p>{item.is_active}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Is Super User</p>
            <p>{item.is_superuser}</p>
          </div> */}
          <div className="col-md-6 mb-3">
            <p className="form-label">Last Login</p>
            <p>{item.last_login}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Date Joined</p>
            <p>{item.date_joined}</p>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/user/list">Back</Link>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}
