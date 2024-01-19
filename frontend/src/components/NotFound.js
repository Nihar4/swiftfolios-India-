import React from 'react';
import { useLocation } from 'react-router-dom';

const NotFound = () => {
    const { state } = useLocation();

    return (
        <div>
            <h1>404 - Not Found</h1>
            {state && state.errorMessage && (
                <p>Error Message: {state.errorMessage}</p>
            )}
        </div>
    );
};

export default NotFound;
