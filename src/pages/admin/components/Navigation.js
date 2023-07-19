import { React, useContext, useState } from 'react';
import useBreakpoint from '../../../hooks/user-breakpoint';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../contexts/auth';

export default function Navigation({ children }) {
    const { user } = useContext(AuthContext)
    const [sidenavOpen, setSidenavOpen] = useState(true)
    const size = useBreakpoint()
    const isMobile = (["xs", "sm", "md"]).includes(size)
    const mainClass = (sidenavOpen && !isMobile ? "col-lg-9 col-md-8 col-sm-12" : "col-12") + " py-3 main"
    const sidebarClass = " col-lg-3 col-md-4 col-10 sidebar py-3 " + (sidenavOpen ? "" : "d-none") + (isMobile ? " mobile-sidebar " : "")

    return (
        <div className="apc admin-container-holder container-fluid bg-f1f5f9">
            <div className="row">
                {
                    isMobile && sidenavOpen && <div className="overlay" onClick={() => setSidenavOpen(!sidenavOpen)}></div>
                }
                <aside className={sidebarClass}>
                    <div className="sidebar-inner bg-white box-bd p-1">
                        <hr />
                            <h1 className="text-center mb-3">TalentV</h1>
                        <hr />
                        {/* <p className="text-center text-secondary">Hi Mike {String(isMobile)}</p>
                        <hr /> */}
                        <ul className="list-group">
                            {
                                isMobile && sidenavOpen && (
                                <li className="list-group-item">
                                    <Link to="#" className="nav-link" onClick={() => setSidenavOpen(!sidenavOpen)}>
                                        <i className="fa fa-arrow-left"></i>&nbsp;Close Menu
                                    </Link>
                                </li>
                                )
                            }
                            <li className="list-group-item">
                                <Link to="/admin" className="nav-link"><i className="fa fa-dashboard"></i>&nbsp;Dashboard</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/admin/company/list" className="nav-link"><i className="fa fa-building"></i>&nbsp;Company</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/admin/upload" className="nav-link"><i className="fa fa-cloud-arrow-up"></i>&nbsp;Upload</Link>
                            </li>
                        </ul>
                        <hr />
                        <ul className='list-group'>
                            <li className="list-group-item">
                                <Link to="/admin/settings" className="nav-link"><i className="fa fa-gear"></i>&nbsp;Settings</Link>
                            </li>
                            <li className="list-group-item">
                                <Link to="/logout" className="nav-link"><i className="fa fa-sign-out"></i>&nbsp;Logout</Link>
                            </li>
                        </ul>
                    </div>
                </aside>
                <main className={mainClass}>
                    <div className="mx-1">
                        <div className="row bg-white mb-3 box-bd ">
                            <nav className="col-12 p-3">
                                <div className="row">
                                <div className="col-12">
                                    <div className="d-flex justify-content-between">
                                        <span>
                                            <button className="btn btn-primary px-3 menu-btn" onClick={() => setSidenavOpen(!sidenavOpen)}><i className="fa fa-bars"></i></button>
                                        </span>
                                        <span>
                                            <div className='btn-group'>
                                                <button className="btn rounded px-3"><i className="fa fa-bell"></i></button>
                                                <Link to="/logout" className="btn rounded px-3"><i className="fa fa-sign-out"></i></Link>
                                                <button className="btn rounded px-3"><i className="fa fa-user"></i>&nbsp;{user.username}</button>
                                            </div>
                                        </span>
                                    </div>
                                </div>
                                </div>
                            </nav>
                        </div>
                        {/* <hr /> */}
                        <div className="row card py-3">
                        {children}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}