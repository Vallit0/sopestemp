
import { useState, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { basePythonUrl } from "../logic/constants";
import { AlertSquare } from "./AlertSquare";

export function AlbumDashboard({currentUser}) {


    const [currentAlbumMenu, setCurrentAlbumMenu] = useState("create");
    const [newAlbumName, setNewAlbumName] = useState("");
    const [changeAlbumName, setchangeAlbumName] = useState("");
    const [userAlbums, setUserAlbums] = useState([]);
    const [deleteAlbumName, setDeleteAlbumName] = useState('');
    const [editAlbumName, setEditAlbumName] = useState('');
    const [lastOperationStatus, setlastOperationStatus] = useState("null");
    const [variantStatus, setVariantStatus] = useState("success");


    useEffect(() => {
        fetch(`${basePythonUrl}/get/albums-names`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser }),
          })
            .then(response => response.json())
            .then(data => {
                setUserAlbums(data.map(album => album.album_name));
            })
            .catch(error => console.error('Error:', error));
    }, [currentAlbumMenu, currentUser])


    const handleAlbumCreation = async (e) => {
        e.preventDefault();

        fetch(`${basePythonUrl}/create-album`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, albumName: newAlbumName}),
          })
            .then(response => response.json())
            .then(data => {

                const variant = data.type === "ok" ? "success" : "danger";

                setlastOperationStatus(data.message);
                setVariantStatus(variant);
                 // Fetch the updated list of albums
                 fetch(`${basePythonUrl}/get/albums-names`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: currentUser }),
                  })
                    .then(response => response.json())
                    .then(data => {
                        setUserAlbums(data.map(album => album.album_name));
                    })
                    .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error:', error));
    }


    const handleChangeAlbumName = async (e) => {
        e.preventDefault();
    
        fetch(`${basePythonUrl}/update-album`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, newAlbumName: changeAlbumName, oldAlbumName: editAlbumName}),
          })
            .then(response => response.json())
            .then(data => {
                const variant = data.type === "ok" ? "success" : "danger";

                setlastOperationStatus(data.message);
                setVariantStatus(variant);
                // Fetch the updated list of albums
                fetch(`${basePythonUrl}/get/albums-names`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: currentUser }),
                  })
                    .then(response => response.json())
                    .then(data => {
                        setUserAlbums(data.map(album => album.album_name));
                    })
                    .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error:', error));
    }

    const handleAlbumDeletion = async (e) => {
        e.preventDefault();

        fetch(`${basePythonUrl}/delete-album`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: currentUser, albumName: deleteAlbumName}),
          })
            .then(response => response.json())
            .then(data => {
                const variant = data.type === "ok" ? "success" : "danger";

                console.log(data.message);

                setlastOperationStatus(data.message);
                setVariantStatus(variant);
                 // Fetch the updated list of albums
                 fetch(`${basePythonUrl}/get/albums-names`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username: currentUser }),
                  })
                    .then(response => response.json())
                    .then(data => {
                        setUserAlbums(data.map(album => album.album_name));
                    })
                    .catch(error => console.error('Error:', error));
            })
            .catch(error => console.error('Error:', error));

    }

    return (
        <>
            <h1>Albumes</h1>
            <h6>Opciones:</h6>
            <Button style={{ marginRight: "10px" }} variant="success" onClick={() => setCurrentAlbumMenu('create')}>Crear</Button>
            <Button style={{ marginRight: "10px" }} variant="warning" onClick={() => setCurrentAlbumMenu('edit')}>Modificar</Button>
            <Button variant="danger" onClick={() => setCurrentAlbumMenu('delete')}>Eliminar</Button>

            {currentAlbumMenu === "create" && (
                <Form
                    style={{ marginTop: "30px", marginLeft: "50px", marginBottom: "5px", width: "80%", height: "95%" }}
                    onSubmit={handleAlbumCreation}
                >
                    <h4>Crear</h4>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="newAlbumName">Nombre del nuevo álbum</Form.Label>
                        <Form.Control
                            type="text"
                            id="newAlbumName"
                            value={newAlbumName}
                            onChange={(e) => setNewAlbumName(e.target.value)}
                            required
                        />
                        <div className="text-right" style={{ marginTop: "10px" }}>
                            <Button
                                type="submit"
                                variant="success"
                            >
                                Crear álbum
                            </Button>
                        </div>
                    </Form.Group>
                    <AlertSquare message={lastOperationStatus} variant={variantStatus} />
                </Form>
                
            )}

            {currentAlbumMenu === "edit" && (
                <Form
                    style={{ marginTop: "30px", marginLeft: "50px", marginBottom: "5px", width: "80%", height: "95%" }}
                    onSubmit={handleChangeAlbumName}
                >
                    <h4>Modificar</h4>
                    <Form.Label htmlFor="modifyAlbumList">Álbumes disponibles:</Form.Label>
                    <Form.Group className="mb-3"
                        id="modifyAlbumList">

                        <Form.Select onChange={(e) => {
                            setEditAlbumName(e.target.value);
                        }}>
                            <option value={""}>Seleccione un álbum</option>
                            {userAlbums.map((album, index) => {
                                return (
                                    <option key={index} value={album}>{album}</option>
                                )
                            })}
                        </Form.Select>
                        <Form.Label htmlFor="changeAlbumName">Nombre nuevo del álbum</Form.Label>
                        <Form.Control
                            type="text"
                            id="changeAlbumName"
                            value={changeAlbumName}
                            onChange={(e) => setchangeAlbumName(e.target.value)}
                            required
                        />

                        <div className="text-right" style={{ marginTop: "10px" }}>
                            <Button
                                type="submit"
                                variant="warning"
                            >
                                Modificar
                            </Button>
                        </div>
                    </Form.Group>
                    <AlertSquare message={lastOperationStatus} variant={variantStatus} />
                </Form>
            )}

            {currentAlbumMenu === "delete" && (
                <Form
                    style={{ marginTop: "30px", marginLeft: "50px", marginBottom: "5px", width: "80%", height: "95%" }}
                    onSubmit={handleAlbumDeletion}
                >
                    <h4>Modificar</h4>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="deleteAlbumName">Álbum a eliminar</Form.Label>
                        <Form.Select onChange={(e) => {
                            setDeleteAlbumName(e.target.value);
                        }}>
                            <option value={""}>Seleccione un álbum</option>
                            {userAlbums.map((album, index) => {
                                return (
                                    <option key={index} value={album}>{album}</option>
                                )
                            })}
                        </Form.Select>
                        <div className="text-right" style={{ marginTop: "10px" }}>
                            <Button
                                type="submit"
                                variant="danger"
                            >
                                Eliminar
                            </Button>
                        </div>
                    </Form.Group>
                    <AlertSquare message={lastOperationStatus} variant={variantStatus} />
                </Form>
            )}




        </>
    )

}