import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { TaskStatus } from '../configTasks/TaskStatus';
import { TaskPriority } from '../configTasks/TaskPriority';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { Button, Container } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import './Tasks.css';

export default function CreateTask() {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = false;

    if (!title) {
      toast.error('A task precisa de um título');
      errors = true;
    }
    if (!status) {
      toast.error('A task precisa de um status');
      errors = true;
    }
    if (!priority) {
      toast.error('A task precisa de uma prioridade');
      errors = true;
    }

    if (errors) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        title: title,
        status: status,
        priority: priority,
        notes: notes,
        user: user.uid,
        createdAt: new Date(),
      });
    } catch (error) {
      toast.error('Ocorreu um erro, task não criada');
    }
    toast.success('A sua task foi criada com sucesso.');
    navigate('/list');
  };

  return (
    <Container>
      <Card
        bg={'Light'}
        key={'Light'}
        style={{ width: '30rem' }}
        className="mb-4 mx-auto mt-5"
      >
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="title">
            <Form.Label className="h3">Título</Form.Label>
            <Form.Control
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="Título"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="box-text">
            <Form.Label className="h4">Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
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
                    />
                    <label
                      className="form-check-label-one  inline-block"
                      htmlFor="flexRadio"
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
                    />
                    <label className="form-check-label  inline-block">
                      {TaskPriority[index]}
                    </label>
                  </div>
                );
              })}
            </Form.Label>
          </Form.Group>
          <Button type="submit" className="mb-2 mx-auto">
            Enviar
          </Button>
        </Form>
      </Card>
    </Container>
  );
}
