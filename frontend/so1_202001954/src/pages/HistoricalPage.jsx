import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Container, Row, Col } from 'react-bootstrap';
import { NavBar } from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function HistoricalPage() {
    const ramMemoryRef = useRef(null);
    const cpuRef = useRef(null);
    const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));
    const [ramData, setRamData] = useState([]);
    const [cpuData, setCpuData] = useState([]);

    useEffect(() => {
        const obtenerDatosDesdeBackend = async () => {
            try {
                const response = await fetch('/api/historico');
                if (!response.ok) {
                    throw new Error('Error al obtener los datos desde el servidor');
                }
                return await response.json();
            } catch (error) {
                console.error(error);
                return null;
            }
        };

        const generarGraficos = async () => {
            const datos = await obtenerDatosDesdeBackend();
            if (datos) {
                setRamData(datos.map(entry => entry.memoriaRAM));
                setCpuData(datos.map(entry => entry.cpu));
            }
        };

        generarGraficos();
    }, []);

    useEffect(() => {
        if (ramData.length && cpuData.length) {
            const opcionesGenerales = {
                responsive:false,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        display: true,
                        title: { display: true, text: 'Tiempo' },
                    },
                    y: {
                        display: true,
                        title: { display: true, text: 'Rendimiento (%)' },
                        suggestedMin: 80,
                        suggestedMax: 100,
                    },
                },
            };

            const crearGrafico = (ref, label, data, borderColor) => {
                return new Chart(ref.current, {
                    type: 'line',
                    data: {
                        labels: generateLabels(data),
                        datasets: [{ label, data, borderColor, borderWidth: 1, fill: false }],
                    },
                    options: opcionesGenerales,
                });
            };

            const ramMemoryChart = crearGrafico(ramMemoryRef, 'RAM', ramData, '#FF6384');
            const cpuChart = crearGrafico(cpuRef, 'CPU', cpuData, '#36A2EB');

            return () => {
                ramMemoryChart.destroy();
                cpuChart.destroy();
            };
        }
    }, [ramData, cpuData]);

    const generateLabels = (data) => {
        return data.length ? Array.from({ length: data.length }, (_, i) => `Tiempo ${i + 1}`) : [];
    };

    return (
        <>
            <NavBar currentUser={currentUser} />
            <Container className="my-3">
                <Row>
                    <Col sm={6} className="text-center">
                        <div>Rendimiento de la RAM</div>
                        <canvas ref={ramMemoryRef} width={400} height={400} />
                    </Col>
                    <Col sm={6} className="text-center">
                        <div>Rendimiento de la CPU</div>
                        <canvas ref={cpuRef} width={400} height={400} />
                    </Col>
                </Row>
            </Container>
        </>
    );
}
