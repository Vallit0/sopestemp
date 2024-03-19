import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Form, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { basePythonUrl } from "../logic/constants";
import { NavBar } from "../components/NavBar";
import { AlertSquare } from "../components/AlertSquare";

export function EditProfilePage() {
  const [username, setUsername] = useState(() => localStorage.getItem("user"));
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [lastOperationStatus, setlastOperationStatus] = useState("null");
  const [variantStatus, setVariantStatus] = useState("success");
  const [profilePicture, setProfilePicture] = useState(
    "path_to_default_profile_image.jpg"
  ); // Replace with actual default image path
  const [newProfilePic, setNewProfilePic] = useState(null);
  const currentuser = localStorage.getItem("user");

  const handleUsernameChange = (e) => setUsername(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setProfilePicture(fileUrl);
    setNewProfilePic(file);
  };
  const [currentUser, setCurrentUser] = useState(() =>
    localStorage.getItem("user")
  );

  const [userData, setUserData] = useState(() => {
    return {
      username: localStorage.getItem("user"),
      fullName: "Nombre Completo",
    };
  });

  useEffect(() => {
    const fetchFullName = async () => {
      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: userData.username }),
      };
      try {
        const response = await fetch(
          `${basePythonUrl}/get/name`,
          requestOptions
        );
        if (response.ok) {
          const data = await response.json();
          setUserData((prevData) => ({
            ...prevData,
            fullName: data.name,
          }));

          setFullName(data.name);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error fetching full name:", error);
      }
    };

    if (currentUser && userData.username) {
      fetchFullName();
    }
  }, [currentUser, userData.username]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmPassword("");

    const formData = new FormData();
    formData.append("username", currentuser);
    formData.append("newusername", username);
    formData.append("fullname", fullName);
    formData.append("password", confirmPassword);
    formData.append("file", newProfilePic);
    try {
      fetch(`${basePythonUrl}/user/profile`, {
        method: "PUT",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          const variant = data.type === "ok" ? "success" : "danger";
          setlastOperationStatus(data.message);
          setVariantStatus(variant);
          if (data.newusername) {
            localStorage.setItem("user", data.newusername);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    console.log("Edit canceled, returning to profile page");
    window.location.href = "/init";
  };

  return (
    <>
      <NavBar currentUser={userData.username} />
      <Container>
        <Card>
          <Card.Body>
            <Card.Title>Editar Perfil</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={4} className="text-center">
                  <img
                    src={profilePicture}
                    alt="Profile"
                    className="img-thumbnail"
                  />
                  <Form.Group controlId="formFile" className="mb-3">
                    <Form.Label>Nueva Foto</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleProfilePictureChange}
                      accept="image/*"
                    />
                  </Form.Group>
                </Col>
                <Col sm={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={fullName}
                      onChange={(e) =>
                        setFullName(e.target.value)
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                    />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Editar
                  </Button>
                  <Button variant="secondary" onClick={handleCancel}>
                    Regresar
                  </Button>
                </Col>
              </Row>
              <AlertSquare
                message={lastOperationStatus}
                variant={variantStatus}
              />
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </>
  );
}
