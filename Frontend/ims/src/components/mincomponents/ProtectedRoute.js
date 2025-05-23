// src/components/ProtectedRoute.jsx
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// const ProtectedRoute = ({ children }) => {
//   const { isAuthenticated } = useAuth();
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;

// src / components / ProtectedRoute.jsx;
import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  // const [showRedirect, setShowRedirect] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access this page");
      // const timer = setTimeout(() => {
      //   setShowRedirect(true);
      // }, 500); // 500ms gives toast time to show
      // return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
