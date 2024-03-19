import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Container, Row, Col } from 'react-bootstrap';
import { NavBar } from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function HistoricalPage() {
    const chartRef1 = useRef(null);
    const chartRef2 = useRef(null);
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));

    useEffect(() => {
        // Initialize the first chart
        const chart1 = new Chart(chartRef1.current, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [{
                    label: 'Valor histórico 1',
                    data: [10, 20, 15, 25, 30, 25, 35, 40, 45, 40, 50, 55],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false,
                maintainAspectRatio: false,
            }
        });

        // Initialize the second chart
        const chart2 = new Chart(chartRef2.current, {
            type: 'line',
            data: {
                labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
                datasets: [{
                    label: 'Valor histórico 2',
                    data: [5, 15, 10, 20, 25, 20, 30, 35, 40, 35, 45, 50],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                responsive: false,
                maintainAspectRatio: false,
            }
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
                        <div>Gráfico Histórico 1</div>
                        <canvas ref={chartRef1} width={400} height={400} />
                    </Col>
                    <Col sm={6} className="text-center">
                        <div>Gráfico Histórico 2</div>
                        <canvas ref={chartRef2} width={400} height={400} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
