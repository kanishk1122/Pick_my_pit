import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {UserProvide} from './utils/Usercontext.jsx'
import App from './App.jsx'
import './index.css'
import 'animate.css';
import Swal from 'sweetalert2'
import { SwalProvider } from './utils/Customswal.jsx'
import './swal.css'




createRoot(document.getElementById('root')).render(
  <SwalProvider>
  <UserProvide>
  <StrictMode>
    <App />
  </StrictMode>
    </UserProvide>
  </SwalProvider>
)
