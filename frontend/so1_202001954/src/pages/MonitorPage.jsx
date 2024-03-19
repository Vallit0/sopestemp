import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Container, Row, Col } from 'react-bootstrap';
import { NavBar } from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function MonitorPage() {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const [currentUser, setCurrentUser] = useState(()=>localStorage.getItem('user'));  // aca deberia de ir el usuario que se logueo en localstorage o haciendo otro fetch 

    useEffect(() => {
        const chart1 = new Chart(chartRef1.current, {
            type: 'pie',
            data: {
                labels: ['Red', 'Blue', 'Yellow'],
                datasets: [{
                    data: [10, 20, 30],
                    backgroundColor: ['red', 'blue', 'yellow'],
                }],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
            },
        });

        const chart2 = new Chart(chartRef2.current, {
            type: 'pie',
            data: {
                labels: ['Green', 'Purple', 'Orange'],
                datasets: [{
                    data: [15, 25, 35],
                    backgroundColor: ['green', 'purple', 'orange'],
                }],
            },
            options: {
                responsive: false,
                maintainAspectRatio: false,
            },
        });

        return () => {
            chart1.destroy();
            chart2.destroy();
        };
    }, []);

    return (
        <>
        <NavBar currentUser={currentUser} />
            <Container className="my-3">
                <Row>
                    <Col sm={6} className="text-center">
                        <div>Gráfico 1</div>
                        <canvas ref={chartRef1} width={400} height={400} />
                    </Col>
                    <Col sm={6} className="text-center">
                        <div>Gráfico 2</div>
                        <canvas ref={chartRef2} width={400} height={400} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
