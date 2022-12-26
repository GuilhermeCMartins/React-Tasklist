import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { db, auth } from '../../config/firebaseConfig';
import {
  where,
  query,
  collection,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { NavLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'react-toastify';
import { TaskStatus } from '../configTasks/TaskStatus';

import { ButtonStyled } from '../ListTasks/styled';
import { Card } from 'react-bootstrap';
import { Container, Button } from 'react-bootstrap';
import Col from 'react-bootstrap/Col';
import { Nav } from 'react-bootstrap';

export default function Home() {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);
  const [status] = useState(TaskStatus[1]);

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'tasks'), where('user', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        let tasks = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks(tasks);
        filterByPriority(tasks);
      });
    }
  }, [auth, user]);

  const filterByPriority = (tasks) => {
    setTasks(
      tasks.filter((task) => {
        return task.priority === 'ALTA' && task.status === 'EM ANDAMENTO';
      }),
    );
  };

  const whenPosted = (data) => {
    const dt = new Date(data.seconds * 1000);
    const dateFormated = formatDistance(dt, new Date(), {
      addSuffix: true,
      locale: ptBR,
    });
    return dateFormated;
  };

  const colorHeaderText = (prior) => {
    if (prior === 'BAIXA') return { color: '#434242' };
    if (prior === 'MEDIA') return { color: '#C58940' };
    if (prior === 'ALTA') return { color: '#DC0000' };
  };

  const headerTextPriority = (prior) => {
    if (prior === 'BAIXA') return 'Baixa prioridade';
    if (prior === 'MEDIA') return 'Importante ';
    if (prior === 'ALTA') return 'Urgente';
  };

  const colorSelect = (props) => {
    if (props === 'EM ANDAMENTO') return 'blue';
    if (props === 'COMPLETO') return 'green';
    if (props === 'CANCELADO') return 'red';
  };

  const handleCompleted = async (id, index) => {
    if (auth.currentUser) {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        status: status,
      });

      const updateTask = tasks.map((item, i) => {
        if (index === i) {
          return { ...item, status: status };
        } else {
          return item;
        }
      });

      setTasks(updateTask);

      filterByPriority(updateTask);

      toast.success('Task completada');
      return;
    } else {
      toast.error('Você precisa estar logado');
    }
  };

  const renderCompleteButton = (string, id, index) => {
    if (string === 'COMPLETO') {
      return null;
    } else if (string === 'EM ANDAMENTO') {
      return (
        <Button className="m-2 " onClick={() => handleCompleted(id, index)}>
          Complete
        </Button>
      );
    } else {
      return null;
    }
  };

  const renderTasks = () => {
    return (
      <Container>
        {tasks.map((task, index) => {
          return (
            <Col key={index} xs={10}>
              <Card className="text-center h-100 ">
                <Card.Header style={colorHeaderText(task.priority)}>
                  {headerTextPriority(task.priority)}
                  <ButtonStyled inputColor={() => colorSelect(task.status)} />
                </Card.Header>
                <Card.Body>
                  <Card.Title>{task.title}</Card.Title>
                  <Card.Text>{task.notes}</Card.Text>

                  <Container fluid>
                    <Button variant="secondary">
                      {' '}
                      <Nav.Link
                        to={`/edit/${task.id}`}
                        as={NavLink}
                        className="text-decoration-none"
                      >
                        Edit
                      </Nav.Link>
                    </Button>
                    {renderCompleteButton(task.status, task.id, index)}
                  </Container>
                </Card.Body>
                <Card.Footer className="text-muted">
                  {whenPosted(task.createdAt)}
                </Card.Footer>
              </Card>
            </Col>
          );
        })}
      </Container>
    );
  };

  return <div>{auth.currentUser ? renderTasks() : null}</div>;
}
