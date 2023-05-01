import React, { useState } from "react";
import { Form, Button, Col, Row } from "react-bootstrap";
import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [userType, setUserType] = useState("doctor"); // add userType state variable

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  console.log(isLoggedIn);
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://127.0.0.1:8000/auth/user/login/", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.status === 200) {
          // Handle Successful login
          console.log("Successful login");
          return response.json();
        } else if (response.status === 401) {
          // Handle Unauthorized
          // setIsLoggedIn(true);
          setAlertMessage("Invalid email or password");
          setShowAlert(true);
        } else {
          console.log("An error occurred, status code:- ", response.status);
        }
      })
      .then((data) => {
        if (data && data.token) {
          // Store token in local storage
          // localStorage.setItem('token', JSON.stringify({ access_token: 'your_token_here' }));
          localStorage.setItem("isLoggedIn", JSON.stringify(true));
          localStorage.setItem("token", JSON.stringify(data.token));
          localStorage.setItem("type", userType);
          setIsLoggedIn(false);
          navigate("/");
          window.location.reload();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    setIsLoggedIn(false);
    navigate("/login");
  };

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
  
     // set the userType to the selected value
  };

  return (
    <div style={{ padding: "30px" }}>
      <center>
        <h1 style={{ color: "#009A75" }}>Authentication</h1>
      </center>
      <Row>
        <Col md={{ span: 4, offset: 4 }}>
          {isLoggedIn ? (
            <div style={{ textAlign: "center" }}>
              <h3>You are logged in!</h3>
              <Button
                style={{ background: "#009A75" }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                />
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword
                    (e.target.value)}
                    placeholder="Password"
                    />
                    </Form.Group>
                    <Form.Group controlId="formBasicUserType">
                    <Form.Label>User Type</Form.Label>
                    <Form.Control as="select" onChange={handleUserTypeChange}>
                    <option value="doctor">Doctor</option>
                    <option value="patient">Patient</option>
                 
                    </Form.Control>
                    </Form.Group>
                    <center>
              <Button style={{ background: "#009A75",margin:"20px" }} type="submit">
                Login
              </Button>
            </center>
                    <p
            style={{
              textAlign: "center",
              paddingTop: "10px",
            }}
          >
            <Link
              to="/Register"
              style={{
                color: "black",
                textDecoration: "none",
                textAlign: "center",
              }}
            >
             Don't have an account?{" "}
              <span style={{ color: "#009A75" }}>Signup</span>
            </Link>
          </p>
                    {showAlert && (
                    <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    {alertMessage}
                    </Alert>
                    )}
                    </Form>
                    )}
                    </Col>
                    </Row>
                    </div>
                    );
                    }