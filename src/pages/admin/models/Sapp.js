import axios from "axios"
import { useCallback, useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { APIURL } from "../../../contants"


export const SappList = ({user, app_label, model_name}) => {
  const [data, setData] = useState({})

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}admin/api/list/${app_label}/${model_name}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setData(res.data)
    } catch (error) {
      alert("Failed to load items!")
    }
  }, [user, app_label, model_name])

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
      data?.model ? (
      <>
        <div className="col-12 mb-3">
          <h4 className="text-start mb-3">
            <i className="fa fa-users"></i>&nbsp;{data.model.name} List
          </h4>
          <div className="text-end">
            <button onClick={loadData} className="btn btn-sm btn-secondary mx-1">
              <i className="fa fa-refresh"></i>&nbsp;Refresh
            </button>
            <Link to={`/admin/sapp/${model_name}/add/`} className="btn btn-sm btn-primary">
              <i className="fa fa-plus"></i>&nbsp;Add
            </Link>
          </div>
        </div>
        <div className="col-12">
          <div className="table-responsive">
            <table className="table table-sm table-bordered table-striped table-hover w-100">
              <thead>
                <tr>
                {
                  data.list_fields.map((field) => (
                    <th key={field.fname}>{field.flabel}</th>
                  ))
                }
                <th></th>
                </tr>
              </thead>
              <tbody>
              {
                data.page.map((row, ri) => (
                  <tr key={ri}>
                  {
                    data.list_fields.map((field) => (
                      <td key={field.fname}>{row[field.fname]}</td>
                    ))
                  }
                    <td>
                      <span className="btn-group">
                        <Link className="btn btn-sm btn-success" to={`/admin/sapp/${model_name}/detail/${row.id}`}>
                          <i className="fa fa-eye"></i>
                        </Link>
                        <Link className="btn btn-sm btn-secondary" to={`/admin/sapp/${model_name}/edit/${row.id}`}>
                          <i className="fa fa-edit"></i>
                        </Link>
                        <button className="btn btn-sm btn-danger" onClick={() => deleteItem(row.id)}>
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
      ) : (
      <>
        <div className="col-12 mb-3">
          <h4 className="text-start mb-3">
            <i className="fa fa-users"></i>&nbsp;Loading
          </h4>
        </div>
      </>
      )
  )
}

const FieldInput = ({field}) => {
  return (
    <div className={`mb-3 col-12 ${field.css_class}`}>
      <label className="form-label">{field.label}</label>
      <>
        {
          (
            [
              "TextInput",
              "DateInput",
              "DateTimeInput",
              "NumberInput",
              // "ClearableFileInput",
              "URLInput",
              "EmailInput",
            ].includes(field.widget) && (
              <input
                name={field.field_meta.fname}
                // required={field.required}
                defaultValue={field.value || ""}
                // maxLength={field.widget_atts.maxlength}
                type={field.type}
                className="form-control"
              />
            )
          ) || 
          (
            field.widget === "CheckboxInput" && (
              <input
                name={field.field_meta.fname}
                required={field.required}
                defaultValue={field.value || false}
                type={field.type}
                className="form-check"
              />
            )
          ) || 
          (
            [
              "Select",
              "SelectMultiple",
            ].includes(field.widget) && (
              <select
                name={field.field_meta.fname}
                required={field.required}
                defaultValue={field.value || (field.widget === "Select" ? "" : [])}
                multiple={field.widget === "SelectMultiple"}
                className="form-select"
              >
              {
                field.choices.map(([id, str], index) => (
                  <option key={index} value={id}>{str}</option>
                ))
              }
              </select>
            )
          ) || 
          (
            field.widget === "Textarea" && (
              <textarea
                name={field.field_meta.fname}
                cols="30"
                rows="10"
                defaultValue={field.value || ""}
                required={field.required}
                className="form-control"
              ></textarea>
            )
          )
        }
      </>
    </div>
  )
}

const FormError = ({errors}) => {
  return (
    <div className="alert alert-danger">
      <ul>
        {
          Object.keys(errors).map((fname, index) => (
            <li key={index}>
              {fname}
              <ol>
                {
                  errors[fname].map(({message}, mindex) => (
                    <li key={mindex}>{message}</li>
                  ))
                }
              </ol>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export const SappAddUpdate = ({user, app_label, model_name}) => {
  const [data, setData] = useState({})
  const { id } = useParams()
  const formElement = useRef()
  const navigate = useNavigate()
  const URL = `${APIURL}admin/api/${id ? "edit" : "add"}/${app_label}/${model_name}/${id ? `${id}/` : ""}`

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(URL, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setData(res.data)
    } catch (error) {
      alert("Failed to load form!")
    }
  }, [user, URL])

  useEffect(() => {
    loadData()
  }, [loadData])

  const submitForm = async (e) => {
    e.preventDefault()
    const formData = new FormData(formElement.current)
    try {
      const res = await axios.post(URL, formData, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      if (res.status === 202) {
        alert(`Item ${id ? "Updated" : "Created"}!`)
        navigate(`/admin/sapp/${model_name}/list/`)
      } else {
        setData(res.data)
        alert("Failed to save!")
      }
    } catch (error) {
      alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
    }
    return false
  }

  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start">
          <i className="fa fa-list"></i>&nbsp;{ app_label.toUpperCase() } { model_name.toUpperCase() } { id ? `Update #${id}` : "Add" }
        </h4>
      </div>
      <div className="col-12">
       {
        !data.model ? (
          <div className="alert w-75 mx-auto py-5">
            <p className="display-3">Loading</p>
          </div>
        ) : (
        <form className="row" ref={formElement} onSubmit={submitForm}>
          {
            Object.keys(data.form.errors).length ? (
              <div className="col-12 mb-3">
                <FormError errors={data.form.errors} />
              </div>
            ) : ""
          }
          {
            data.form.fields.filter((f) => f.widget !== "ClearableFileInput").map((field, index) => (
              <FieldInput key={index} field={field} />
            ))
          }
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to={`/admin/sapp/${model_name}/list/`}>Cancel</Link>
            <button className="btn btn-primary" type="submit">Save</button>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}

export const SappDetails = ({user, app_label, model_name}) => {
  const [data, setData] = useState({})
  const { id }= useParams()

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}admin/api/detail/${app_label}/${model_name}/${id}/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setData(res.data)
    } catch (error) {
      alert(error?.response?.data?.detail || error?.response?.statusText || error?.message || "Error")
    }
  }, [user, id, app_label, model_name])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <>
      <div className="col-12 mb-3">
        <h4 className="text-start">
          <i className="fa fa-users"></i>&nbsp;{data?.model?.name || "Model"} #{id}
        </h4>
      </div>
      <div className="col-12">
       {
        !data.instance ? (
          <div className="alert w-75 mx-auto py-5">
            <p className="display-3">Loading</p>
          </div>
        ) : (
        <form className="row">
          {
            data.fields.map((field) => (
              <div className="col-12 mb-3" key={field.fname}>
                <p className="form-label">{field.flabel}</p>
                <p>{data.instance[field.fname]}</p>
              </div>
            ))
          }
          <div className="col-12 text-end">
            <Link  className="btn btn-sm btn-secondary mx-1" to={`/admin/sapp/${model_name}/list/`}>Back</Link>
          </div>
        </form>
        )
       }
      </div>
    </>
  )
}
