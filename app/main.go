package main

import (
	"bufio"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"syscall"
	"time"
)

type ramStruct struct {
	TotalRam      uint64
	RamEnUso      uint64
	RamLibre      uint64
	PorcentajeUso uint64
}

type responseKill struct {
	Pid int
}

func ramAdmin(w http.ResponseWriter, _ *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202001954")

	salida, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("------------------------------")
	fmt.Println("Running command: ", cmd.String())
	fmt.Println(string(salida))
	fmt.Println("------------------------------")

	ramAtributos := strings.Split(string(salida), ",")
	ramStr := ramStruct{}
	for _, atributos := range ramAtributos {
		atri := strings.Split(string(atributos), ":")

		if atri[0] == "TotRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.TotalRam = u64
		} else if atri[0] == "UseRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.RamEnUso = u64
		} else if atri[0] == "FreRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.RamLibre = u64
		} else if atri[0] == "PorRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				log.Fatalln(err)
			}
			ramStr.PorcentajeUso = u64
		}

	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	jsonResp, err := json.Marshal(ramStr)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func cpuAdmin(w http.ResponseWriter, _ *http.Request) {
	cmd := exec.Command("sh", "-c", "cat /proc/cpu_202001954")

	salida, err := cmd.CombinedOutput()

	if err != nil {
		log.Fatalln(err)
	}

	var a []interface{}
	err = json.Unmarshal(salida, &a)

	if err != nil {
		log.Fatalln(err)
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	jsonResp, err := json.Marshal(a)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func cpuUso(w http.ResponseWriter, _ *http.Request) {
	var prevIdleTime, prevTotalTime uint64
	var cpuUsage float64
	for i := 0; i < 2; i++ {
		file, err := os.Open("/proc/stat")
		if err != nil {
			log.Fatal(err)
		}
		scanner := bufio.NewScanner(file)
		scanner.Scan()
		firstLine := scanner.Text()[5:] // get rid of cpu plus 2 spaces
		file.Close()
		if err := scanner.Err(); err != nil {
			log.Fatal(err)
		}
		split := strings.Fields(firstLine)
		idleTime, _ := strconv.ParseUint(split[3], 10, 64)
		totalTime := uint64(0)
		for _, s := range split {
			u, _ := strconv.ParseUint(s, 10, 64)
			totalTime += u
		}
		if i > 0 {
			deltaIdleTime := idleTime - prevIdleTime
			deltaTotalTime := totalTime - prevTotalTime
			cpuUsage = (1.0 - float64(deltaIdleTime)/float64(deltaTotalTime)) * 100.0
		}
		prevIdleTime = idleTime
		prevTotalTime = totalTime
		time.Sleep(time.Second)
	}

	data := make(map[string]any)
	data["cpu"] = cpuUsage
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	jsonResp, err := json.Marshal(data)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

func kill(w http.ResponseWriter, r *http.Request) {

	b, err := io.ReadAll(r.Body)
	if err != nil {
		panic(err)
	}
	var data = []byte(b)
	var kil responseKill
	err = json.Unmarshal(data, &kil)

	pid := kil.Pid

	proceso, err := os.FindProcess(pid)
	if err != nil {
		fmt.Printf("Error al obtener el proceso: %v\n", err)
		return
	}

	if err := proceso.Signal(syscall.SIGKILL); err != nil {
		fmt.Printf("Error al enviar la señal SIGKILL: %v\n", err)
		return
	}

	fmt.Printf("Proceso con PID %d terminado correctamente.\n", pid)

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	dat := make(map[string]any)
	dat["code"] = 200
	jsonResp, err := json.Marshal(dat)
	if err != nil {
		log.Fatalf("Error happened in JSON marshal. Err: %s", err)
	}
	w.Write(jsonResp)
	return
}

type CpuStruct struct {
	PorcentajeUso uint64 `json:"porcentajeUso"`
}

var db *sql.DB

// inicializar la base de datos
func initDB() {
	var err error
	db, err = sql.Open("mysql", "root:1234@tcp(127.0.0.1:3306)/monitor")
	if err != nil {
		log.Fatalf("Error al abrir la base de datos: %v", err)
	}

	if err = db.Ping(); err != nil {
		log.Fatalf("Error al conectar con la base de datos: %v", err)
	}
}

// / Obtener solamente RAM
func getRAMUsage() (ramStruct, error) {
	cmd := exec.Command("sh", "-c", "cat /proc/ram_202001954")

	salida, err := cmd.CombinedOutput()
	if err != nil {
		return ramStruct{}, fmt.Errorf("error al ejecutar el comando: %w", err)
	}

	fmt.Println("------------------------------")
	fmt.Println("Running command: ", cmd.String())
	fmt.Println(string(salida))
	fmt.Println("------------------------------")

	ramAtributos := strings.Split(string(salida), ",")
	ramStr := ramStruct{}
	for _, atributos := range ramAtributos {
		atri := strings.Split(string(atributos), ":")

		if atri[0] == "TotRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				return ramStruct{}, fmt.Errorf("error al parsear TotRam: %w", err)
			}
			ramStr.TotalRam = u64
		} else if atri[0] == "UseRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				return ramStruct{}, fmt.Errorf("error al parsear UseRam: %w", err)
			}
			ramStr.RamEnUso = u64
		} else if atri[0] == "FreRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				return ramStruct{}, fmt.Errorf("error al parsear FreRam: %w", err)
			}
			ramStr.RamLibre = u64
		} else if atri[0] == "PorRam" {
			u64, err := strconv.ParseUint(atri[1], 10, 64)
			if err != nil {
				return ramStruct{}, fmt.Errorf("error al parsear PorRam: %w", err)
			}
			ramStr.PorcentajeUso = u64
		}
	}

	return ramStr, nil
}

// // Obtener solamente CPU
func getCpuUsage() (float64, error) {
	var prevIdleTime, prevTotalTime uint64
	var cpuUsage float64
	for i := 0; i < 2; i++ {
		file, err := os.Open("/proc/stat")
		if err != nil {
			return 0, fmt.Errorf("error al abrir /proc/stat: %w", err)
		}
		scanner := bufio.NewScanner(file)
		scanner.Scan()
		firstLine := scanner.Text()[5:] // eliminar 'cpu' y dos espacios
		file.Close()
		if err := scanner.Err(); err != nil {
			return 0, fmt.Errorf("error al leer /proc/stat: %w", err)
		}
		split := strings.Fields(firstLine)
		idleTime, err := strconv.ParseUint(split[3], 10, 64)
		if err != nil {
			return 0, fmt.Errorf("error al parsear idleTime: %w", err)
		}
		totalTime := uint64(0)
		for _, s := range split {
			u, err := strconv.ParseUint(s, 10, 64)
			if err != nil {
				return 0, fmt.Errorf("error al parsear totalTime: %w", err)
			}
			totalTime += u
		}
		if i > 0 {
			deltaIdleTime := idleTime - prevIdleTime
			deltaTotalTime := totalTime - prevTotalTime
			cpuUsage = (1.0 - float64(deltaIdleTime)/float64(deltaTotalTime)) * 100.0
		}
		prevIdleTime = idleTime
		prevTotalTime = totalTime
		time.Sleep(time.Second)
	}

	return cpuUsage, nil
}

// / insercio de datos
func insertResourceUsage(usoCPU float64, usoRAM float64) error {
	// La consulta SQL para insertar los datos en la base de datos.
	query := "INSERT INTO registro_uso_recursos (uso_cpu, uso_ram) VALUES (?, ?)"

	// Preparar la consulta SQL para ejecución
	stmt, err := db.Prepare(query)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Ejecutar la consulta con los valores proporcionados
	_, err = stmt.Exec(usoCPU, usoRAM)
	if err != nil {
		return err
	}

	return nil
}

func main() {
	initDB()
	defer db.Close()

	http.HandleFunc("/ram", ramAdmin)  // Manejador para uso de RAM
	http.HandleFunc("/cpu", cpuAdmin)  // Manejador para uso de CPU
	http.HandleFunc("/cpuUso", cpuUso) // Manejador para obtener el porcentaje de uso de CPU
	http.HandleFunc("/kill", kill)     // Manejador para terminar un proceso

	log.Println("Servidor iniciado en http://localhost:8000")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatalf("Error al iniciar el servidor: %v", err)
	}
}

// te amo karlita onichan uwu
