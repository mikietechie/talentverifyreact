import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { AuthContext } from "./contexts/auth";
import WebsiteLayout from "./pages/website/WebsiteLayout";
import Home from "./pages/website/Home";
import NotFound from "./pages/website/NotFound";
import Login from './pages/website/Login';
import { Dashboard } from './pages/admin/Dashboard';
import { Settings } from './pages/admin/Settings';
import AdminLayout from './pages/admin/AdminLayout';
import Logout from "./pages/website/Logout";
import { CompanyAddUpdate, CompanyDetails, CompanyList } from "./pages/admin/models/company";
import { DepartmentAddUpdate, DepartmentDetails, DepartmentList } from "./pages/admin/models/department";
import { EmployeeAddUpdate, EmployeeDetails, EmployeeList } from "./pages/admin/models/employee";
import { EmploymentAddUpdate, EmploymentDetails, EmploymentList } from "./pages/admin/models/employment";
import { UserAddUpdate, UserDetails, UserList } from "./pages/admin/models/user";
import { SappAddUpdate, SappDetails, SappList } from "./pages/admin/models/Sapp";
import { Upload } from "./pages/admin/Upload";
import { LOCAL } from "./contants";

export default function App() {
  const [user, setUser] = useState()

  useEffect(() => {
    const user = localStorage.getItem('user')
    if (user) {
      setUser(JSON.parse(user))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      <BrowserRouter>
        <Routes>
          {
            user && (
              <Route path="/admin/" element={<AdminLayout />}>
                <Route path="/admin/" element={<Dashboard user={user} />} />

                <Route path="/admin/upload/" element={<Upload user={user} />} />
                <Route path="/admin/settings/" element={<Settings user={user} />} />

                <Route path="/admin/user/list/" element={<UserList user={user} />} />
                <Route path="/admin/user/add/" element={<UserAddUpdate user={user} />} />
                <Route path="/admin/user/edit/:id/" element={<UserAddUpdate user={user} />} />
                <Route path="/admin/user/detail/:id/" element={<UserDetails user={user} />} />

                <Route path="/admin/company/list/" element={<CompanyList user={user} />} />
                <Route path="/admin/company/add/" element={<CompanyAddUpdate user={user} />} />
                <Route path="/admin/company/edit/:id/" element={<CompanyAddUpdate user={user} />} />
                <Route path="/admin/company/detail/:id/" element={<CompanyDetails user={user} />} />
                
                <Route path="/admin/department/list/" element={<DepartmentList user={user} />} />
                <Route path="/admin/department/add/" element={<DepartmentAddUpdate user={user} />} />
                <Route path="/admin/department/edit/:id/" element={<DepartmentAddUpdate user={user} />} />
                <Route path="/admin/department/detail/:id/" element={<DepartmentDetails user={user} />} />
                
                <Route path="/admin/employee/list/" element={<EmployeeList user={user} />} />
                <Route path="/admin/employee/add/" element={<EmployeeAddUpdate user={user} />} />
                <Route path="/admin/employee/edit/:id/" element={<EmployeeAddUpdate user={user} />} />
                <Route path="/admin/employee/detail/:id/" element={<EmployeeDetails user={user} />} />
                
                <Route path="/admin/employment/list/" element={<EmploymentList user={user} />} />
                <Route path="/admin/employment/add/" element={<EmploymentAddUpdate user={user} />} />
                <Route path="/admin/employment/edit/:id/" element={<EmploymentAddUpdate user={user} />} />
                <Route path="/admin/employment/detail/:id/" element={<EmploymentDetails user={user} />} />

                {
                  LOCAL ? (
                    <>
                    {
                      [
                        ["chat", "room"],
                        ["chat", "contact"],
                        ["core", "user"],
                        ["core", "demo"],
                      ].map(([app_label, model_name], index) => (
                        <>
                          <Route path={`/admin/sapp/${model_name}/list/`} element={<SappList user={user} app_label={app_label} model_name={model_name} />} />
                          <Route path={`/admin/sapp/${model_name}/add/`} element={<SappAddUpdate user={user} app_label={app_label} model_name={model_name} />} />
                          <Route path={`/admin/sapp/${model_name}/edit/:id/`} element={<SappAddUpdate user={user} app_label={app_label} model_name={model_name} />} />
                          <Route path={`/admin/sapp/${model_name}/detail/:id/`} element={<SappDetails user={user} app_label={app_label} model_name={model_name} />} />
                        </>
                      ))
                    }
                    </>
                  ) : ""
                }

                <Route path="*" element={<NotFound />} />
              </Route>
            )}
          <Route path="/" element={<WebsiteLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  )
}
