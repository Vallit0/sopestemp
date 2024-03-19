package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func getCpuUso() {
	resp, err := http.Get("http://localhost:8000/cpuUso")
	if err != nil {
		fmt.Printf("Error haciendo el request a /cpuUso: %s\n", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("Error leyendo respuesta de /cpuUso: %s\n", err)
		return
	}

	fmt.Println("Respuesta del servidor /cpuUso:", string(body))
}

func main() {
	getCpuUso()
}
