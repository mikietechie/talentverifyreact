import { Outlet } from "react-router-dom";
import Navigation from "./components/Navigation";

export default function AdminLayout() {
  

  return (
    <Navigation children={<Outlet />} />
  );
}
