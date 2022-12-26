import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Login from './pages/Login/';
import Register from './pages/Register/';
import Reset from './pages/Reset/';
import Dashboard from './pages/Dashboard/';
import Header from './components/Header';
import ListTasks from './pages/ListTasks';
import CreateTask from './pages/CreateTask';
import Home from './pages/Home';
import EditTask from './pages/EditTask';

import GlobalStyles from './styles/GlobalStyles';

function App() {
  return (
    <div className="app">
      <Router>
        <Header />
        <ToastContainer autoClose={3000} />
        <GlobalStyles />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/list" element={<ListTasks />} />
          <Route exact path="/create" element={<CreateTask />} />
          <Route exact path="/edit/:id" element={<EditTask />} />
        </Routes>
      </Router>
    </div>
  );
}
export default App;
