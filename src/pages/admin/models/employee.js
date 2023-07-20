import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { APIURL } from "../../../contants"
import { FormErrors } from "../components/FormErrors"

export const EmployeeList = ({user}) => {
  const [items, setItems] = useState([])

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/employee/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setItems(res.data)
    } catch (error) {
      alert("Failed to load items!")
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const deleteItem = async (id) => {
    const confirmed = window.confirm(`Are you sure you want to delete employee with id #${id}?`)
    if (confirmed) {
      try {
        await axios.delete(`${APIURL}api/employee/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-people-group"></i>&nbsp;Employee List
        </h4>
        <div className="text-end">
          <button onClick={loadData} className="btn btn-sm btn-secondary mx-1">
            <i className="fa fa-refresh"></i>&nbsp;Refresh
          </button>
          <Link to="/admin/employee/add" className="btn btn-sm btn-primary">
            <i className="fa fa-plus"></i>&nbsp;Add
          </Link>
        </div>
      </div>
      <div className="col-12">
        <div className="table-response">
          <table className="table table-sm table-bordered table-striped table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>ID Number</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Trade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.id_number}</td>
                  <td>{item.email_address}</td>
                  <td>{item.contact_phone}</td>
                  <td>{item.trade}</td>
                  <td className="text-center">
                    <span className="btn-group">
                      <Link className="btn btn-sm btn-success" to={`/admin/employee/detail/${item.id}`}>
                        <i className="fa fa-eye"></i>
                      </Link>
                      <Link className="btn btn-sm btn-secondary" to={`/admin/employee/edit/${item.id}`}>
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

export const EmployeeAddUpdate = ({user}) => {
  const [item, setItem] = useState({})
  const [errors, setErrors] = useState({})
  const {id}= useParams()
  const formElement = useRef()
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    if (id) {
      try {
        const res = await axios.get(`${APIURL}api/employee/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
    const formData = new FormData(formElement.current)
    try {
      setErrors({})
      const res = await axios[id ? "put" : "post"](`${APIURL}api/employee/${id ? `${id}/` : ""}`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Item ${id ? "Updated" : "Created"}!`)
        navigate('/admin/employee/list')
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
          <i className="fa fa-people-group"></i>&nbsp;Employee {id ? `Update #${id}` : "Add"}
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
          <div className="col-md-6 mb-3">
            <label className="form-label">Full Name</label>
            <input name="name" required={true} defaultValue={item.name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">ID Number</label>
            <input name="id_number" required={true} defaultValue={item.id_number || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Phone</label>
            <input name="contact_phone" required={true} defaultValue={item.contact_phone || ""} type="tel" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input name="email_address" required={true} defaultValue={item.email_address || ""} type="email" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Trade</label>
            <input name="trade" required={true} defaultValue={item.trade || ""} type="text" className="form-control" />
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/employee/list">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}

export const EmployeeDetails = ({user}) => {
  const [item, setItem] = useState({})
  const { id }= useParams()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/employee/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-people-group"></i>&nbsp;Employee #{id}
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
            <p className="form-label">Name</p>
            <p>{item.name}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">ID Number</p>
            <p>{item.id_number}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Contact Phone</p>
            <p>{item.contact_phone}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Email</p>
            <p>{item.email_address}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Trade</p>
            <p>{item.trade}</p>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/employee/list">Back</Link>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}
