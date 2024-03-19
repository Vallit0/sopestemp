import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { UserProfileCard } from '../components/UserProfileCard';
import { NavBar } from '../components/NavBar';
import { basePythonUrl } from '../logic/constants';
import { PicturesGridView } from '../components/PicturesGridView';
import 'bootstrap/dist/css/bootstrap.min.css';

export function ViewPhotosPage() {
  const [profilePictureUrl, setProfilePictureUrl] = useState("https://practica1-g1-imagenes-b.s3.amazonaws.com/Fotos_perfil/default.png");
  const [currentUser, setCurrentUser] = useState(()=>localStorage.getItem('user'));  // aca deberia de ir el usuario que se logueo en localstorage o haciendo otro fetch 
  const [albums, setAlbums] = useState({"albums": []});

  const [userData, setUserData] = useState(() => {

    return {
      username: localStorage.getItem('user'),
      fullName: 'Nombre Completo'
    }
  });
  useEffect(() => {
    fetch(`${basePythonUrl}/get/albums`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: currentUser }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('fetched data:', data)
        const currentPPURL = data.albums['profile_pictures'].filter((picture) => picture.is_current_profile_picture === 1);
        setProfilePictureUrl(currentPPURL[0].url);
        setAlbums(data.albums);
      })
      .catch(error => console.error('Error:', error));
  }, []);

  // Function to handle the upload button - to be implemented
  const handleUploadPhoto = () => {
    window.location.href = '/upload';
    console.log(albums);
  };

  // Function to handle the edit album button - to be implemented
  const handleEditAlbum = () => {
    window.location.href = '/editalbums';
  };

  return (
    <>
      <NavBar currentUser={currentUser} />
      <Container>
        <Row>
          <Col md={4}>
            <UserProfileCard
              userProfilePicture={profilePictureUrl}
              userFullName={currentUser}
            />
             <Button variant="primary" onClick={handleUploadPhoto} style={{ marginRight: "5px" }}>Subir Foto</Button>
             <Button variant="success" onClick={handleEditAlbum}>Editar Album</Button>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Body>
                <PicturesGridView data={albums} />
                <div className="d-grid gap-2 d-md-block">
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}