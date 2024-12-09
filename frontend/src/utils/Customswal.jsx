// SwalContext.js
import React, { createContext, useContext } from 'react';
import Swal from 'sweetalert2';

const SwalContext = createContext();

export const SwalProvider = ({ children }) => {
    const swalInstance = Swal.mixin({
        customClass: {
            container: 'swal-container',
            popup: 'swal-popup',
            title: 'swal-title',
            content: 'swal-content',
            confirmButton: 'swal-button brand-button',
            cancelButton: 'swal-cancelbutton',
        },
        buttonsStyling: false,
       
    });

    return (
        <SwalContext.Provider value={swalInstance}>
            {children}
        </SwalContext.Provider>
    );
};

export const useSwal = () => {
    return useContext(SwalContext);
};
