import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function PublicRoute({ children }) {
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

    // Redirect authenticated users away from public routes (like /login)
    if (isAuthenticated) {
        return <Navigate to="/home" replace />;
    }

    return children;
}

export default PublicRoute;

