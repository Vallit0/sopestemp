import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export function HomeWebPage() {
    // si se visita la homepage anterior quitar el login
    localStorage.removeItem('token');
    document.title = 'FaunaDex';

    const handleLoginClick = () => {
        location.href = '/monitor'
        console.log('Monitor button clicked');
        
    };

    const handleRegisterClick = () => {
        location.href = '/register'
    };

    return (
        <Row>
            <Col md={6} className="d-flex align-items-center">
                <Container className="mt-5">
                    <h1 style={{ "marginLeft": "10px" }}>Sistemas Operativos 1</h1>
                    <p style={{ "marginLeft": "10px" }}>202001954 - Proyecto 1 </p>
                    <Button variant={"primary"} className="ml-2" onClick={handleLoginClick} style={{ "marginRight": "10px", "marginLeft": "10px" }}>Monitoreo General</Button>
                    <Button variant={"success"} onClick={handleRegisterClick}>Emulador de Procesos</Button>
                </Container>
            </Col>

            <Col md={6} style={{ background: "#f5f5f5", textAlign: "center" }}>
                <img src="dog2.jpg" alt="Dog picture" style={{ "height": "100vh", "float": "right" }} />
            </Col>
        </Row>
    );
};
