import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../../config/firebaseConfig';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { NavLink } from 'react-router-dom';

import { Nav } from 'react-bootstrap';
import './Dashboard.css';

function Dashboard() {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'tasks'), where('user', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        let tasks = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks(tasks);
      });
    }
  }, [auth, user]);

  const coutingAllTasks = () => {
    let count = 0;
    tasks.map((task) => {
      if (task.status) {
        count = count + 1;
      }
    });
    return count;
  };

  const countingTasksStatus = (status) => {
    let count = 0;
    tasks.map((task) => {
      if (task.status === status) {
        count = count + 1;
      }
    });
    return count;
  };

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <div>Você possui {coutingAllTasks()} tasks:</div>
        <div>{countingTasksStatus('COMPLETO')} são tasks completas.</div>
        <div>E {countingTasksStatus('EM ANDAMENTO')} task em andamento.</div>
        <Nav.Link
          to="/list"
          as={NavLink}
          className="text-decoration-none font-weight-bold text-white bg-dark rounded "
        >
          Ver tasks
        </Nav.Link>
      </div>
    </div>
  );
}
export default Dashboard;
