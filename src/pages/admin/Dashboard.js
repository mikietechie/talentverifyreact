import axios from "axios"
import { useCallback, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { APIURL } from "../../contants"

export const Dashboard = ({user}) => {
  const [counts, setCounts] = useState({})

  const loadData = useCallback(async () => {
    try {
      const res = await axios.get(`${APIURL}api/admin/`, {headers: {Authorization: `Bearer ${user.tokens.access}`}})
      setCounts(res.data.counts)
    } catch (error) {
      alert("Failed to data!")
    }
  }, [user])

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div id="dashboard-page">
      <div className="col-12 mb-3">
        <h4 className="text-start mb-3">
          <i className="fa fa-dashboard"></i>&nbsp;Dashboard
        </h4>
      </div>
      <div className="col-12 mb-3">
        <div className="row">
          <Link to="/admin/user/list/" className="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
            <div className="card py-3">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="fa fa-users"></i>&nbsp;{counts?.user}</h5>
                <p className="card-text">
                  Users
                </p>
              </div>
            </div>
          </Link>
          <Link to="/admin/company/list/" className="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
            <div className="card py-3">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="fa fa-building"></i>&nbsp;{counts?.company}</h5>
                <p className="card-text">
                  Company
                </p>
              </div>
            </div>
          </Link>
          <Link to="/admin/department/list/" className="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
            <div className="card py-3">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="fa fa-building-user"></i>&nbsp;{counts?.department}</h5>
                <p className="card-text">
                  Departments
                </p>
              </div>
            </div>
          </Link>
          <Link to="/admin/employee/list/" className="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
            <div className="card py-3">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="fa fa-user-group"></i>&nbsp;{counts?.employee}</h5>
                <p className="card-text">
                  Employees
                </p>
              </div>
            </div>
          </Link>
          <Link to="/admin/employment/list/" className="col-lg-2 col-md-3 col-sm-6 col-12 mb-3">
            <div className="card py-3">
              <div className="card-body">
                <h5 className="card-title mb-3"><i className="fa fa-file-signature"></i>&nbsp;{counts?.employment}</h5>
                <p className="card-text">
                  Contracts
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

