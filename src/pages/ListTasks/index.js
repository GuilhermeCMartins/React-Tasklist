import { useEffect, useState } from 'react';
import {
  where,
  query,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { NavLink } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

import { ButtonStyled } from './styled';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';
import { Container, Nav } from 'react-bootstrap';
import { TaskStatus } from '../configTasks/TaskStatus';
import { TaskPriority } from '../configTasks/TaskPriority';

export default function ListTasks() {
  const [user] = useAuthState(auth);
  const [tasks, setTasks] = useState([]);
  const [status] = useState(TaskStatus[1]);
  const [filteredTasks, setfilteredTasks] = useState([]);
  const history = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      const q = query(collection(db, 'tasks'), where('user', '==', user.uid));
      getDocs(q).then((querySnapshot) => {
        let tasks = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setTasks(tasks);
        setfilteredTasks(tasks);
      });
    }
  }, [auth, user]);

  const handleDelete = async (props) => {
    await deleteDoc(doc(db, 'tasks', props));
    setfilteredTasks((current) => current.filter((task) => task.id !== props));

    toast.success('Task deletada');
  };

  const colorSelect = (props) => {
    if (props === 'EM ANDAMENTO') return 'blue';
    if (props === 'COMPLETO') return 'green';
    if (props === 'CANCELADO') return 'red';
  };

  const whenPosted = (data) => {
    const dt = new Date(data.seconds * 1000);
    const dateFormated = formatDistance(dt, new Date(), {
      addSuffix: true,
      locale: ptBR,
    });
    return dateFormated;
  };

  const handleCompleted = async (id, index) => {
    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      status: status,
    });

    const updateTask = filteredTasks.map((item, i) => {
      if (index === i) {
        return { ...item, status: status };
      } else {
        return item;
      }
    });

    setfilteredTasks(updateTask);

    toast.success('Task completada');
    history('/list');
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

  const filterByPriority = (priority) => {
    if (!priority) return setfilteredTasks(tasks);
    setfilteredTasks(
      tasks.filter((task) => {
        return task.priority === priority;
      }),
    );
  };

  return (
    <div>
      <Container fluid="md">
        <Container fluid="md">
          <select
            className="form-select"
            onChange={(e) => filterByPriority(e.target.value)}
          >
            <option value="">TODAS</option>

            {TaskPriority.map((taskPriority, index) => {
              return <option key={index}>{taskPriority}</option>;
            })}
          </select>
        </Container>
        <Row className="justify-content-md-center" md={4}>
          {filteredTasks.map((task, index) => {
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
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(task.id)}
                        className="m-2"
                      >
                        Delete
                      </Button>
                      <Button variant="secondary">
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
        </Row>
      </Container>
    </div>
  );
}
