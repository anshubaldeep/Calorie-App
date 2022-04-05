import logo from './logo.svg';
import './App.css';
import Form from './components/LoginForm';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from './containers/Home';
import Admin from './containers/Admin';
import { app } from './firebase-config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <div className="App">
      <>
          <Routes>
            <Route path='/login' element={<Form title="Login" />} />
            <Route path='/register' element={<Form title="Register" />} />
            <Route
              path='/home'
              element={
                <Home />}
            />
            <Route
              path='/admin'
              element={
                <Admin />}
            />
          </Routes>
          <ToastContainer />
        </>
      </div>
  );
}

export default App;
