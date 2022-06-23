import { ToastContainer } from 'react-toastify';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Router from './Router';

function App() {
  return (
    <>
      <Router/>
      <ToastContainer
        position='top-right'
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        theme='dark'
        pauseOnHover={false}
       />
    </>
  );
}

export default App;
