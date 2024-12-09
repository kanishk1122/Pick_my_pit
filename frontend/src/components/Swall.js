import Swal from "sweetalert2";

export default Swal.mixin({
    customClass: {
      container: 'swal-container',
      popup: 'swal-popup', // Add a custom class for the popup
      title: 'swal-title',
      content: 'swal-content',
      confirmButton: 'swal-button brand-button',
    },
    buttonsStyling: false, // Disable default button styles
    showClass: {
      popup: `
        animate__animated
        animate__fadeInUp
        animate__faster
      `,
    },
    hideClass: {
      popup: `
        animate__animated
        animate__fadeOutDown
        animate__faster
      `,
    },
  });