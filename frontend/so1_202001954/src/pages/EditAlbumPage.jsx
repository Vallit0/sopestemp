import { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Alert } from 'react-bootstrap';
import { UserProfileCard } from '../components/UserProfileCard';
import { NavBar } from '../components/NavBar';
import { AlbumDashboard } from '../components/AlbumDashboard';
import { basePythonUrl } from "../logic/constants";
import { AlertSquare } from '../components/AlertSquare';
import 'bootstrap/dist/css/bootstrap.min.css';

export function EditAlbumPage() {


  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('user'));
  if (!currentUser) {
    window.location.href = "/login"
  }
  const [profilePictureUrl, setProfilePictureUrl] = useState("https://practica1-g1-imagenes-b.s3.amazonaws.com/Fotos_perfil/default.png");
  const [userData, setUserData] = useState(() => {

    return {
      username: localStorage.getItem('user'),
      fullName: 'Nombre Completo'
    }
  });

  

  useEffect(() => {
    const fetchFullName = async () => {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userData.username }),
      };
      try {
        const response = await fetch(`${basePythonUrl}/get/name`, requestOptions);
        if (response.ok) {
          const data = await response.json();
          setUserData(prevData => ({
            ...prevData,
            fullName: data.name // Assuming the JSON object has a key "name"
          }));
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching full name:', error);
      }
    };

    if (currentUser && userData.username) { // Only fetch if username is available
      fetchFullName();
    }
  }, [currentUser, userData.username]); // Depend on username so it refetches if username changes


  useEffect(() => {
    if(currentUser){
      fetch(`${basePythonUrl}/get/albums`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: currentUser }),
      })
        .then(response => response.json())
        .then(data => {
          const currentPPURL = data.albums['profile_pictures'].filter((picture) => picture.is_current_profile_picture === 1);
          setProfilePictureUrl(currentPPURL[0].url);
          //setAlbums(data.albums);
        })
        .catch(error => console.error('Error:', error));
    }

    }

    , [currentUser]);


  // Ahora necesitamos hacer fetch hacia la DB utilizando el nombre de usuario 
  // seteamos los datos: usuario, nombre completo, 
  // Handlers for the various operations
  const viewPhotos = () => {
    // Logic to handle viewing photos
    window.location.href = "/viewphotos"
    console.log('Viewing photos');
  };

  const uploadPhoto = () => {
    // Logic to handle photo upload
    window.location.href = "/upload"
    console.log('Uploading photo');
  };

  const editAlbums = () => {
    // Logic to handle editing albums
    window.location.href = "/edit"
    console.log('Editing albums');
  };

  const editProfile = () => {
    // Logic to handle profile editing
    window.location.href = "/edit/profile"
    console.log('Editing profile');
  };



  return (

    <>
      <NavBar currentUser={userData.username} />
      <Container className="my-3">
        <Card>
          <Card.Header as="h5">Mi Perfil</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={4} className="text-center">
                <UserProfileCard
                  userProfilePicture={profilePictureUrl}
                  userFullName={currentUser}
                />
                <div className="mt-2">
                  <Button href="/viewphotos" variant="primary" size="sm" onClick={viewPhotos} className="me-2">Ver fotos</Button>
                  <Button href="/upload" variant="secondary" size="sm" onClick={uploadPhoto}>Subir Foto</Button>
                </div>
              </Col>
              <Col sm={8}>
                <AlbumDashboard currentUser={currentUser}/>
              </Col>
            </Row>
          </Card.Body>
        </Card>
  
      </Container>
    </>
  );
}
