import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function ProtectedRoutes() {
    const { isAuthenticated, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}>
                <div className="spinner-large"></div>
            </div>
        );
    }

    // Redirect unauthenticated users to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // Render child routes
    return <Outlet />;
}

export default ProtectedRoutes;

