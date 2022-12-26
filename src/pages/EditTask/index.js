import { useState, useEffect } from 'react';
import { auth } from '../../config/firebaseConfig';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

import { TaskStatus } from '../configTasks/TaskStatus';
import { TaskPriority } from '../configTasks/TaskPriority';
import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import { toast } from 'react-toastify';

export default function EditTask() {
  const [status, setStatus] = useState('');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (auth.currentUser) {
      if (title === '') {
        const taskRef = doc(db, 'tasks', id);
        getDoc(taskRef).then((doc) => {
          if (!doc.exists) {
            console.log('Não existe');
            navigate('/list');
          } else {
            doc = doc.data();
            setTitle(doc.title);
            setStatus(doc.status);
            setPriority(doc.priority);
            setNotes(doc.notes);
          }
        });
      }
    }
  }, [title, id, setTitle, setStatus, setPriority, setNotes]);

  const handleEditTask = async (e) => {
    if (auth.currentUser) {
      e.preventDefault();

      if (!title) {
        toast.error('Preencha o título da task');
        return;
      }

      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        title: title,
        status: status,
        priority: priority,
        notes: notes,
      });

      toast.success('Task editada com sucesso');
      navigate('/list');
    } else {
      toast.error('Você precisa estar logado');
    }
  };

  return (
    <Container>
      <Card
        bg={'Light'}
        key={'Light'}
        style={{ width: '30rem' }}
        className="mb-4 mx-auto mt-5"
      >
        <Form onSubmit={handleEditTask}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className="h3">Título</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Título"
              defaultValue={title}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="box-text">
            <Form.Label className="h4">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
              defaultValue={notes}
              placeholder="A task não possui descrição"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>
              {TaskStatus.map((taskStatus, index) => {
                return (
                  <div className="form-check-inline align-center" key={index}>
                    <input
                      className="form-check-input align-center"
                      type="radio"
                      name="radioStatus"
                      id="radioStatus"
                      value={TaskStatus[index]}
                      onClick={() => setStatus(taskStatus)}
                      checked={status === TaskStatus[index]}
                    />
                    <label
                      className="form-check-label-one  inline-block"
                      htmlFor="flexRadioDefault-one"
                      name="label-option-one"
                    >
                      {TaskStatus[index]}
                    </label>
                  </div>
                );
              })}
            </Form.Label>
            <Form.Label>
              {TaskPriority.map((item, index) => {
                return (
                  <div className="form-check-inline align-center" key={index}>
                    <input
                      className="form-check-input align-center"
                      type="radio"
                      name="radioPriority"
                      id="radioPriority"
                      value={TaskPriority[index]}
                      onClick={() => setPriority(item)}
                      checked={priority === TaskPriority[index]}
                    />
                    <label
                      className="form-check-label  inline-block"
                      htmlFor="flexRadioDefault1"
                      name="label-option"
                    >
                      {TaskPriority[index]}
                    </label>
                  </div>
                );
              })}
            </Form.Label>
          </Form.Group>
          <Button type="submit" className="mb-2 mx-auto">
            Editar
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
