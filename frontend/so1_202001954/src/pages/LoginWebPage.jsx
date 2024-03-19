import { useState } from 'react';
import { Button, Form, Alert, Container, Row, Col } from 'react-bootstrap';
import { basePythonUrl } from "../logic/constants";
//import { Redirect } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
//import { useHistory } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export function LoginWebPage() {
  
  // cuando se visita eliminamos el login 
  //localStorage.removeItem('token');
  //const history = useHistory();
  let navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');
  const [variantStatus, setVariantStatus] = useState('');

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };


  // Handle Submit del LOGIN (Verificar Login a DB)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setLoginStatus('Ingrese su username y su password');
      setVariantStatus('danger');
      return;
    }

    const isUserNameValid = /^[a-z0-9]+$/.test(username);
    if (!isUserNameValid) {
      setregisterStatus(
        "El nombre de usuario solamente puede contener minúsculas y números"
      );
      setVariantStatus("danger");
      return;
    }

    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);



    try {
      const response = await fetch(`${basePythonUrl}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log(data); 
      console.log(response)
      if (response.ok) {
        setLoginStatus('Login exitoso!');
        setVariantStatus('success');
        // Guardamos el token en localStorage para el usuario 
        //localStorage.setItem('token', data.token);
        localStorage.setItem('user', username);
        // localStorage.setItem('name', data.name)

        setIsLoggedIn(true);
        // viajamos a la pagina de inicio del usuario
        //history.push('/init')
        navigate('/init');
         

      } else {
        setLoginStatus(data.message || 'Login failed: Credenciales incorrectas');
        setVariantStatus('danger');
      }
    } catch (error) {
      setLoginStatus('Login failed: ' + error.message);
      setVariantStatus('danger');
    }
  };

  //if (isLoggedIn) {
  //  return <Redirect to="/init" />;
  //}
  return (
    <Container>
      <Row className="justify-content-md-left">
        <Col md={6} className="d-flex align-items-center">
          
          {loginStatus && <Alert variant={variantStatus}>{loginStatus}</Alert>}
          <Form onSubmit={handleSubmit}>
          <h1>Login</h1>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" value={username} onChange={handleUsernameChange} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" value={password} onChange={handlePasswordChange} />
            </Form.Group>
            <Button variant="primary" type="submit" style={{ marginBottom: "10px", display: "block" }}>Login</Button>
            <a href="/" style={{ marginRight: "10px", display: "inline-block" }}>
              Inicio
            </a>
            <a href="/register">
              ¿No tienes una cuenta?
            </a>
          </Form>
        </Col>
        <Col md={6}>
                    <img src="racoon.jpg" alt="raccoon picture" style={{ height: "100vh", width: "195%", float: "left" }} />
        </Col>


      </Row>
    </Container>
  );
}
