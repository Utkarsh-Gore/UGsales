import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App.jsx";
import Mobile from "./component/Mobile.jsx";
import Tv from "./component/Tv.jsx";
import Cloth from "./component/Cloth.jsx";
import Beauty from "./component/Beauty.jsx";
import Sport from "./component/Sport.jsx";
import Elec from "./component/Elec.jsx";
import All from "./component/All.jsx";
import ProtectedRoute from "./component/ProtectedRoute.jsx";
import UserContext from "./context/UserContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import Login from "./page/Login.jsx";
import Signup from "./page/Signup.jsx";
import Feature from "./component/Feature.jsx";
import Aboutus from "./component/Aboutus.jsx";
import Support from "./component/Support.jsx";
import Wishlist from "./page/Wishlist.jsx";
import Detail from "./page/Detail.jsx";
import Cart from "./page/Cart.jsx";
import Checkout from "./page/Checkout.jsx";
import OrderSuccess from "./page/OrderSuccess.jsx";
import Orders from "./page/Orders.jsx";
import Profile from "./page/Profile.jsx";
import AdminLayout from "./admin/AdminLayout.jsx";
import AdminDashboard from "./admin/AdminDashboard.jsx";
import AdminProducts from "./admin/AdminProducts.jsx";
import AdminOrders from "./admin/AdminOrders.jsx";
import AdminUsers from "./admin/AdminUsers.jsx";
import Payment from "./component/Payment.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },

      // Protected routes
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "/mobile",
            element: <Mobile />,
          },
          {
            path: "/tv",
            element: <Tv />,
          },
          {
            path: "/feature",
            element: <Feature />,
          },
          {
            path: "/aboutus",
            element: <Aboutus />,
          },
          {
            path: "/wishlist",
            element: <Wishlist />,
          },
          {
            path: "/detail/:id",
            element: <Detail />,
          },
          {
            path: "/cloth",
            element: <Cloth />,
          },
          {
            path: "/support",
            element: <Support />,
          },
          {
            path: "/beauty",
            element: <Beauty />,
          },
          {
            path: "/sport",
            element: <Sport />,
          },
          {
            path: "/electronics",
            element: <Elec />,
          },
          {
            path: "/all",
            element: <All />,
          },
          {
            path: "/cart",
            element: <Cart />,
          },
          {
            path: "/checkout",
            element: <Checkout />,
          },
          {
            path: "/order-success",
            element: <OrderSuccess />,
          },
          {
            path: "/orders",
            element: <Orders />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
           {
            path: "/payment",
            element: <Payment />,
          },
          // Admin Panel
          {
            path: "/admin",
            element: <AdminLayout />,
            children: [
              {
                index: true,
                element: <AdminDashboard />,
              },
              {
                path: "products",
                element: <AdminProducts />,
              },
              {
                path: "orders",
                element: <AdminOrders />,
              },
              {
                path: "users",
                element: <AdminUsers />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserContext>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </UserContext>
  </StrictMode>
);
