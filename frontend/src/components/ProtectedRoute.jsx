// Import navigation tools
import { Navigate, useLocation } from "react-router-dom";

// Import the token check
import { isAdminTokenValid } from "../adminApi";


// Wrap any admin page with this component.
// If the admin is not logged in, they are sent to the login page.
function ProtectedRoute({ children }) {

    const location = useLocation();

    if (!isAdminTokenValid()) {
        return (
            <Navigate
                to="/admin/login"
                replace
                state={{ from: location }}
            />
        );
    }

    return children;
}

export default ProtectedRoute;