import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { APIURL } from "../../../contants"
import { FormErrors } from "../components/FormErrors"

export const CompanyList = ({user}) => {
  const [items, setItems] = useState([])

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/company/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setItems(res.data)
    } catch (error) {
      alert("Failed to load items!")
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const deleteItem = async (id) => {
    const confirmed = window.confirm(`Are you sure you want to delete company with id #${id}?`)
    if (confirmed) {
      try {
        await axios.delete(`${APIURL}api/company/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-building"></i>&nbsp;Company List
        </h4>
        <div className="text-end">
          <button onClick={loadData} className="btn btn-sm btn-secondary mx-1">
            <i className="fa fa-refresh"></i>&nbsp;Refresh
          </button>
          <Link to="/admin/company/add" className="btn btn-sm btn-primary">
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
                <th>Contact</th>
                <th>Email</th>
                <th>Phone</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.contact_person}</td>
                  <td>{item.email_address}</td>
                  <td>{item.contact_phone}</td>
                  <td className="text-center">
                    <span className="btn-group">
                      <Link className="btn btn-sm btn-success" to={`/admin/company/detail/${item.id}`}>
                        <i className="fa fa-eye"></i>
                      </Link>
                      <Link className="btn btn-sm btn-secondary" to={`/admin/company/edit/${item.id}`}>
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

export const CompanyAddUpdate = ({user}) => {
  const [options, setOptions] = useState({})
  const [item, setItem] = useState({})
  const [errors, setErrors] = useState({})
  const {id}= useParams()
  const formElement = useRef()
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/company/form/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setOptions(res.data)
    } catch (error) {
      alert("Failed to load form options!")
    }
    if (id) {
      try {
        const res = await axios.get(`${APIURL}api/company/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
      const res = await axios[id ? "put" : "post"](`${APIURL}api/company/${id ? `${id}/` : ""}`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Item ${id ? "Updated" : "Created"}!`)
        navigate('/admin/company/list')
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
          <i className="fa fa-building"></i>&nbsp;Company {id ? `Update #${id}` : "Add"}
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
            <label className="form-label">Name</label>
            <input name="name" required={true} defaultValue={item.name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Contact Person</label>
            <input name="contact_person" required={true} defaultValue={item.contact_person || ""} type="text" className="form-control" />
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
            <label className="form-label">Registration Number</label>
            <input name="registration_number" required={true} defaultValue={item.registration_number || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date of Reg</label>
            <input name="date_of_registration" required={true} defaultValue={item.date_of_registration || ""} type="date" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Departments</label>
            <select name="departments" required={true} defaultValue={item.departments || []} type="text" className="form-select" multiple={true}>
              {
                (options?.departments?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Address</label>
            <textarea name="address" required={true} defaultValue={item.address || ""} type="text" className="form-control"></textarea>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/company/list">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}

export const CompanyDetails = ({user}) => {
  const [item, setItem] = useState({})
  const { id }= useParams()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/company/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-building"></i>&nbsp;Company #{id}
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
            <p className="form-label">Contact Person</p>
            <p>{item.contact_person}</p>
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
            <p className="form-label">Registration Number</p>
            <p>{item.registration_number}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Date of Reg</p>
            <p>{item.date_of_registration}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Departments</p>
            <p>{item.department_names}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Number of Employees</p>
            <p>{item.number_of_employees}</p>
          </div>
          <div className="col-12 mb-3">
            <p className="form-label">Address</p>
            <p>{item.address}</p>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/company/list">Back</Link>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}
