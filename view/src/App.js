import React, { useState } from "react";
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Router from './Router';
import AuthContext from './contexts/AuthContext'

function App() {
  // eslint-disable-next-line no-unused-vars
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("userToken")));

  return (
    <AuthContext.Provider value={{token: localStorage.getItem("userToken")}}>
      <Router/>
      <ToastContainer
        position='bottom-right'
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        theme='dark'
        pauseOnHover={false}
       />
    </AuthContext.Provider>
  );
}

export default App;
