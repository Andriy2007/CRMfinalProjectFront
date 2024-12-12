import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

    return isAuthenticated ? <Navigate to="/orders" /> : <>{children}</>;
};

export {AuthRoute} ;