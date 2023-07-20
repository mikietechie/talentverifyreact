import axios, { toFormData } from "axios"
import { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { APIURL } from "../../contants"
import { FormErrors } from "./components/FormErrors"

export const Settings = ({user}) => {
  const [errors, setErrors] = useState({})
  const formElement = useRef()
  const navigate = useNavigate()

  const submitForm = async (e) => {
    e.preventDefault()
    const formData = new FormData(formElement.current)
    const data = Object.fromEntries(formData)
    if (data.new_password !== data.new_password_confirmation) {
      alert("Passwords confirmation failed!")
      return
    }
    try {
      setErrors({})
      const res = await axios.post(`${APIURL}api/auth/`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Settings Updated!`)
        navigate('/logout/')
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
          <i className="fa fa-user-cog"></i>&nbsp;Settings
        </h4>
      </div>
      <div className="col-12">
        <form className="row" ref={formElement} onSubmit={submitForm}>
          {
            Object.keys(errors).length ? (
              <div className="col-12 mb-3">
                <FormErrors errors={errors} />
              </div>
            ) : ""
          }
          <div className="col-md-6 mb-3">
            <label className="form-label">First Name</label>
            <input name="first_name" required={true} defaultValue={user.first_name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Last Name</label>
            <input name="last_name" required={true} defaultValue={user.last_name || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Username</label>
            <input name="username" required={true} defaultValue={user.username || ""} type="text" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Email</label>
            <input name="email" required={true} defaultValue={user.email || ""} type="email" className="form-control" />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Current Password</label>
            <input name="current_password" required={true} type="password" className="form-control" minLength={4} />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password</label>
            <input name="new_password" required={true} type="password" className="form-control" minLength={4}/>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">New Password Confirmation</label>
            <input name="new_password_confirmation" required={true} type="password" className="form-control" minLength={4}/>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin/company/list">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
    </>
  )
}
