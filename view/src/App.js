import React from "react";
import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Router from './Router';
import AuthContext from './contexts/AuthContext'
import UserIDContext from "./contexts/UserIDContext";

function App() {
  // eslint-disable-next-line no-unused-vars
  
  return (
    <AuthContext.Provider value={{token: localStorage.getItem("userToken")}}>
      <UserIDContext.Provider value={{userId: 0}}>
        <Router/>
        <ToastContainer
          position='bottom-right'
          autoClose={2000}
          hideProgressBar={false}
          closeOnClick
          theme='dark'
          pauseOnHover={false}
        />
       </UserIDContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;
