import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Card,
  Dropdown,
  DropdownButton,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { basePythonUrl } from "../logic/constants";
import { NavBar } from "../components/NavBar";
import {AlertSquare} from '../components/AlertSquare';

export function UploadPhotoPage() {
  const [photoName, setPhotoName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(
    "path_to_default_image_placeholder.jpg"
  );
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(albums[0]);
  const username = localStorage.getItem("user");
  const [lastOperationStatus, setlastOperationStatus] = useState("null");
  const [variantStatus, setVariantStatus] = useState("success");

  const handlePhotoNameChange = (e) => setPhotoName(e.target.value);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Leer el archivo seleccionado y actualizar la URL de la vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAlbumSelection = (album) => {
    setSelectedAlbum(album);
  };

  const handleUpload = () => {
    const formData = new FormData();
    formData.append("username", username);
    formData.append("album", selectedAlbum);
    formData.append("name", photoName);
    formData.append("file", selectedFile);
    console.log(
      "Username: ",
      username,
      "Album: ",
      selectedAlbum,
      "Name: ",
      photoName,
      "File: ",
      selectedFile
    );

    try {
      fetch(`${basePythonUrl}/photos`, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          
          const variant = data.type === "ok" ? "success" : "danger";

          setlastOperationStatus(data.message);
          setVariantStatus(variant);

        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createNewAlbum = () => {
    const newAlbumName = prompt("Enter the name of the new album:");
    if (newAlbumName) {
      setAlbums([...albums, newAlbumName]);
      setSelectedAlbum(newAlbumName);
    }
  };

  // Mostrar Dropdown de albums

  useEffect(() => {
    if (username) {
      fetch(`${basePythonUrl}/get/albums-names`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username }),
      })
        .then((response) => response.json())
        .then((data) => {
          setAlbums(data.map((album) => album.album_name));
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [username]);

  return (
    <>
      <NavBar currentUser={username} />
      <Container>
        <Card>
          <Card.Body>
            <Card.Title>Subir Foto (Animales)</Card.Title>
            <Form>
              <Row>
                <Col sm={4} className="text-center">
                  <img
                    src={imagePreviewUrl}
                    alt="Upload Preview"
                    className="img-thumbnail"
                  />
                </Col>
                <Col sm={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre Foto</Form.Label>
                    <Form.Control
                      type="text"
                      value={photoName}
                      onChange={handlePhotoNameChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Album</Form.Label>
                    <DropdownButton
                      title={selectedAlbum}
                      onSelect={handleAlbumSelection}
                    >
                      {albums.map((album, index) => (
                        <Dropdown.Item key={index} eventKey={album}>
                          {album}
                        </Dropdown.Item>
                      ))}
                    </DropdownButton>
                    <Button variant="link" onClick={createNewAlbum}>
                      Crear Nuevo Album
                    </Button>
                  </Form.Group>
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
                  </Form.Group>
                  <Button variant="primary" onClick={handleUpload}>
                    Cargar Foto
                  </Button>
                  <AlertSquare
                    message={lastOperationStatus}
                    variant={variantStatus} />
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
