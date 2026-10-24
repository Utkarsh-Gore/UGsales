
import { Outlet, useLocation } from "react-router-dom";
import Nav from "./component/Nav";
import Nav2 from "./component/Nav2";
import Footer from "./component/Footer";
import { useAuth } from "./context/AuthContext";

function App() {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  // Hide Nav2 on these paths
  const hideNav2Paths = [
    "/login",
    "/signup",
    "/feature",
    "/aboutus",
    "/support",
    "/cart",
    "/payment",
    "/checkout",
    "/orders",
    "/order-success",
    "/profile",
  ];

  const hideNav2 =
    !isLoggedIn ||
    hideNav2Paths.includes(location.pathname) ||
    location.pathname.startsWith("/admin");

  // Hide Nav and Footer for admin pages
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <div>
      {!isAdminPage && (
        <>
          <Nav />
          <hr />
          {!hideNav2 && <Nav2 />}
          {!hideNav2 && <hr />}
        </>
      )}
      <Outlet />
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
