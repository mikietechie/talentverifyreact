import axios from "axios"
import { useRef, useState } from "react"
import { Link } from "react-router-dom"
import { APIURL } from "../../contants"
import { FormErrors } from "./components/FormErrors"


export const Upload = ({user}) => {
  const [errors, setErrors] = useState({})
  const formElement = useRef()

  const submitForm = async (e) => {
    e.preventDefault()
    const formData = new FormData(formElement.current)
    try {
      const res = await axios.post(`${APIURL}api/upload/`, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status <= 205) {
        alert(`Item Uploaded!\n\n${res.data.file}`)
      } else {
        alert("Failed to save!")
      }
    } catch (error) {
      setErrors(error?.response?.data || {})
      // console.log(error);
      alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
    }
    return false
  }


  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start">
          <i className="fa fa-cloud-bolt"></i>&nbsp;Upload
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
          <div className="col-12 mb-3">
            <label className="form-label">Select File</label>
            <input name="file" accept=".csv,.json,.xlsx" required={true} type="file" className="form-control" />
          </div>
          <div className="col-12 mb-3">
            <label className="form-label">Destination</label>
            <select name="utype" required={true} type="text" className="form-select">
              <option value="">Select</option>
              <option value="Type 1">Type 1</option>
              <option value="Type 2">Type 2</option>
              <option value="Type 3">Type 3</option>
              <option value="Type 4">Type 4</option>
            </select>
          </div>
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to="/admin">Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
      </div>
    </>
  )
}