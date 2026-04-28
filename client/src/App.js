import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Mvt from "./pages/Mvt";
import Viewticket from "./pages/Viewticket";
import Ticketbook from "./pages/Ticketbook";
import Timings from "./pages/Timings";
import Payment from "./pages/Payment";
import Afterview from "./pages/Afterview";
import Afterpayment from "./pages/Afterpayment";
import Contact from "./pages/Contact";
import BookingHistory from "./pages/BookingHistory";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <div>Something went wrong</div>,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <Signup /> },
      { path: "contact", element: <Contact /> },
      { path: "timing", element: <Timings /> },
      {
        path: "mvt",
        element: (
          <ProtectedRoute>
            <Mvt />
          </ProtectedRoute>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <Ticketbook />
          </ProtectedRoute>
        ),
      },
      {
        path: "view",
        element: (
          <ProtectedRoute>
            <Viewticket />
          </ProtectedRoute>
        ),
      },
      {
        path: "afterview",
        element: (
          <ProtectedRoute>
            <Afterview />
          </ProtectedRoute>
        ),
      },
      {
        path: "payment",
        element: (
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        ),
      },
      {
        path: "afterpayment",
        element: (
          <ProtectedRoute>
            <Afterpayment />
          </ProtectedRoute>
        ),
      },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <BookingHistory />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        ),
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
