import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { APIURL } from "../../../contants"
import { FormErrors } from "../components/FormErrors"

export const EmploymentList = ({user}) => {
  const [items, setItems] = useState([])

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/employment/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setItems(res.data)
    } catch (error) {
      alert("Failed to load items!")
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  const deleteItem = async (id) => {
    const confirmed = window.confirm(`Are you sure you want to delete employment with id #${id}?`)
    if (confirmed) {
      try {
        await axios.delete(`${APIURL}api/employment/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-file-signature"></i>&nbsp;Employment Contract List
        </h4>
        <div className="text-end">
          <button onClick={loadData} className="btn btn-sm btn-secondary mx-1">
            <i className="fa fa-refresh"></i>&nbsp;Refresh
          </button>
          <Link to="/admin/employment/add" className="btn btn-sm btn-primary">
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
                <th>Department</th>
                <th>Employee</th>
                <th>Company</th>
                <th>Role</th>
                <th>Started</th>
                <th>Left</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
            {
              items.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.data?.department}</td>
                  <td>{item.data?.employee}</td>
                  <td>{item.data?.company}</td>
                  <td>{item.role}</td>
                  <td>{item.date_started}</td>
                  <td>{item.date_left}</td>
                  <td className="text-center">
                    <span className="btn-group">
                      <Link className="btn btn-sm btn-success" to={`/admin/employment/detail/${item.id}`}>
                        <i className="fa fa-eye"></i>
                      </Link>
                      <Link className="btn btn-sm btn-secondary" to={`/admin/employment/edit/${item.id}`}>
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

export const EmploymentAddUpdate = ({user}) => {
  const [options, setOptions] = useState({})
  const [item, setItem] = useState({})
  const [errors, setErrors] = useState({})
  const {id}= useParams()
  const formElement = useRef()
  const navigate = useNavigate()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/employment/form/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setOptions(res.data)
    } catch (error) {
      alert("Failed to load form options!")
    }
    if (id) {
      try {
        const res = await axios.get(`${APIURL}api/employment/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
      const res = await axios[id ? "put" : "post"](`${APIURL}api/employment/${id ? `${id}/` : ""}`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Item ${id ? "Updated" : "Created"}!`)
        navigate('/admin/employment/list')
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
          <i className="fa fa-file-signature"></i>&nbsp;Employment Contract {id ? `Update #${id}` : "Add"}
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
            <label className="form-label">Company</label>
            <select name="company" required={true} defaultValue={item.company || ""} type="text" className="form-select">
              <option value=""></option>
              {
                (options?.company?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Department</label>
            <select name="department" required={true} defaultValue={item.department || ""} type="text" className="form-select">
              <option value=""></option>
              {
                (options?.department?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Employee</label>
            <select name="employee" required={true} defaultValue={item.employee || ""} type="text" className="form-select">
              <option value=""></option>
              {
                (options?.employee?.choices || []).map((option, index) => (
                  <option key={index} value={option[0]} >{option[1]}</option>
                ))
              }
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Role</label>
            <input name="role" required={true} defaultValue={item.role || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date Started</label>
            <input name="date_started" required={true} defaultValue={item.date_started || ""} type="date" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Date Left</label>
            <input name="date_left" defaultValue={item.date_left || ""} type="date" className="form-control" />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Duties</label>
            <textarea name="duties" required={true} defaultValue={item.duties || ""} type="text" className="form-control"></textarea>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/employment/list">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}

export const EmploymentDetails = ({user}) => {
  const [item, setItem] = useState({})
  const { id }= useParams()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/employment/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
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
          <i className="fa fa-file-signature"></i>&nbsp;Employment Contract #{id}
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
            <p className="form-label">Company</p>
            <p>{item.data.company}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Department</p>
            <p>{item.data.department}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Employee</p>
            <p>{item.data.employee}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Role</p>
            <p>{item.role}</p>
          </div>
          <div className="col-12 mb-3">
            <p className="form-label">Duties</p>
            <p>{item.duties}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Registration Number</p>
            <p>{item.registration_number}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Date Started</p>
            <p>{item.date_started}</p>
          </div>
          <div className="col-md-6 mb-3">
            <p className="form-label">Date left</p>
            <p>{item.date_left}</p>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/employment/list">Back</Link>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}
