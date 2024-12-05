import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {

    const user = useSelector((state) => state.user);
    const isAuthenticated = !!user.accessToken;
    const isAdmin = user.role === "Admin";

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/sign-in" replace />;
    }
    return children;
};

export default PrivateRoute;
