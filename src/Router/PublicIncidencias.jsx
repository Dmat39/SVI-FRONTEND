import React from 'react'
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';


const PublicIncidencias = ({ element }) => {
    const location = useLocation();
    const { idIncidencias } = useSelector((state) => state.auth);

    return (
        !idIncidencias ? element : <Navigate to={"/incidencias/lista"} />
    );
}

export default PublicIncidencias