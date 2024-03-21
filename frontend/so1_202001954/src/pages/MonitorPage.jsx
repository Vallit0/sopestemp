import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { Container, Row, Col } from 'react-bootstrap';
import { NavBar } from '../components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';

export function MonitorPage() {
  const ramMemoryRef = useRef(null);
  const cpuRef = useRef(null);
  const [data, setData] = useState(null);
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));

  // Función para actualizar los datos del gráfico
  const updateChartData = (chartRef, newData) => {
    const chart = chartRef.current.chartInstance;
    if (chart) {
      chart.data.datasets.forEach((dataset) => {
        dataset.data = newData;
      });
      chart.update();
    }
  };

  // Inicialización de los gráficos
  useEffect(() => {
    if (!ramMemoryRef.current.chartInstance) {
      const ramMemoryChart = new Chart(ramMemoryRef.current, {
        type: 'pie',
        data: {
          labels: ['Disponible', 'Utilizado'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });

      ramMemoryRef.current.chartInstance = ramMemoryChart;
    }

    if (!cpuRef.current.chartInstance) {
      const cpuChart = new Chart(cpuRef.current, {
        type: 'pie',
        data: {
          labels: ['Libre', 'Ocupado'],
          datasets: [{
            data: [0, 100],
            backgroundColor: ['#FFCE56', '#FF8042'],
            hoverBackgroundColor: ['#FFCE56', '#FF8042'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
        },
      });

      cpuRef.current.chartInstance = cpuChart;
    }
  }, []);

  // Actualización de los gráficos basada en nuevos datos
  useEffect(() => {
    if (data) {

      const ramData = [data.ram, 100 - data.ram];
      const cpuData = [data.cpu, 100 - data.cpu];
      console.log("RAM: ", ramData);
      console.log("CPU: ", cpuData);
      updateChartData(ramMemoryRef, ramData);
      updateChartData(cpuRef, cpuData);
    }
  }, [data]);

  // Fetch de datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/data");
        if (!response.ok) {
          throw new Error("No se pudo obtener la respuesta de la API");
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 500);
    return () => clearInterval(intervalId);
  }, []);

  // Limpieza de las instancias de los gráficos al desmontar
  useEffect(() => {
    return () => {
      if (ramMemoryRef.current?.chartInstance) {
        ramMemoryRef.current.chartInstance.destroy();
      }
      if (cpuRef.current?.chartInstance) {
        cpuRef.current.chartInstance.destroy();
      }
    };
  }, []);

  return (
    <>
      <NavBar currentUser={currentUser} />
      <Container className="my-3">
        <Row>
          <Col sm={6} className="text-center">
            <div>Consumo de RAM</div>
            <canvas ref={ramMemoryRef} width="400" height="400"></canvas>
          </Col>
          <Col sm={6} className="text-center">
            <div>Consumo de CPU</div>
            <canvas ref={cpuRef} width="400" height="400"></canvas>
      </Col>
    </Row>
  </Container>
</>
);
}