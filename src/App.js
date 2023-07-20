import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect, useState } from 'react';
import { AuthContext } from "./contexts/auth";
import WebsiteLayout from "./pages/website/WebsiteLayout";
import Home from "./pages/website/Home";
import NotFound from "./pages/website/NotFound";
import Login from './pages/website/Login';
import Dashboard from './pages/admin/Dashboard';
import { Settings } from './pages/admin/Settings';
import AdminLayout from './pages/admin/AdminLayout';
import Logout from "./pages/website/Logout";
import { Users, UsersAdd } from "./pages/admin/models/users";
import { CompanyAddUpdate, CompanyDetails, CompanyList } from "./pages/admin/models/company";
import { DepartmentAddUpdate, DepartmentDetails, DepartmentList } from "./pages/admin/models/department";
import { EmployeeAddUpdate, EmployeeDetails, EmployeeList } from "./pages/admin/models/employee";
import { EmploymentAddUpdate, EmploymentDetails, EmploymentList } from "./pages/admin/models/employment";
import { Upload } from "./pages/admin/Upload";

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
                <Route path="/admin/" element={<Dashboard />} />

                <Route path="/admin/upload/" element={<Upload user={user} />} />
                <Route path="/admin/settings/" element={<Settings user={user} />} />

                <Route path="/admin/users/" element={<Users />} />
                <Route path="/admin/users/add/" element={<UsersAdd />} />

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
