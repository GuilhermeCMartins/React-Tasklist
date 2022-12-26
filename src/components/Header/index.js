import { auth, db, logout } from '../../config/firebaseConfig';
import { query, collection, getDocs, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useEffect, useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { toast } from 'react-toastify';

import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import { Nav } from 'react-bootstrap';

function Header() {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, 'users'), where('uid', '==', user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setName(data.name);
    } catch (err) {
      console.error(err);
      alert('An error occured while fetching user data');
    }
  };

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate('/');
    fetchUserName();
  }, [user, loading]);

  const handleLogout = () => {
    logout();

    navigate('/');
    toast.success('Voce saiu com sucesso');
  };

  return (
    <Navbar bg="dark" variant="dark" className="rounded">
      <Container>
        <Navbar.Brand>
          <Nav.Link
            to="/"
            as={NavLink}
            className="text-decoration-none font-weight-bold text-white bg-dark "
          >
            Home
          </Nav.Link>

        </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text class="d-flex justify-content-center text-white align-items-center">
            {user ? (
              <>
                Bem vindo(a): {name}
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    id="dropdown-basic"
                    className="ms-4 btn btn-light"
                  >
                    Menu
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    {' '}
                    <Dropdown.Item>
                      <Nav.Link to="/dashboard" as={NavLink}>
                        Dashboard
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Nav.Link to="/create" as={NavLink}>
                        Criar Task
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item>
                      <Nav.Link to="/list" as={NavLink}>
                        Ver tasks
                      </Nav.Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </>
            ) : (
              <Nav.Link to="/register" as={NavLink}>
                Register
              </Nav.Link>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
