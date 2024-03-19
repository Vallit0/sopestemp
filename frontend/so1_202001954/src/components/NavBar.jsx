import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import PropTypes from 'prop-types';

export function NavBar({ currentUser }) {

    const handleLogout = () => {
        localStorage.removeItem('user');
        window.location.href = "/login"
    }

    NavBar.propTypes = {
        currentUser: PropTypes.string.isRequired,
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
            <Container fluid>
                <Navbar.Brand href="/init">SO1 - 2020001954</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">

                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link href="/init">Datos Historicos</Nav.Link>
                        <Nav.Link href="/tree">Arbol de Procesos</Nav.Link>
                        <Nav.Link href="/emulator">Emulator</Nav.Link>

                    </Nav>
                    <Form className="d-flex">
                        <Button variant="outline-danger" onClick={handleLogout} style={{ marginLeft: "10px" }}>Salir</Button>
                    </Form>
                </Navbar.Collapse>
                <Navbar.Brand href="/init">Modulos de Kernel</Navbar.Brand>

            </Container>
        </Navbar>
    );
}
