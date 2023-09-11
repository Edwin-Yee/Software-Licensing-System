// import Navbar from 'react-bootstrap/Navbar';
// import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
// import InputGroup from 'react-bootstrap/InputGroup';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// // import { Link } from "react-router-dom";

// // import Nav from 'react-bootstrap'
// // import { hasRole } from "main/utils/currentUser";
// import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost"
// // import { Container } from 'react-bootstrap';

// function AppNavbar(currentUrl = window.location.href) {
//   return (
//           <>
//             {
//                 (currentUrl.startsWith("http://localhost:3000") ||
//                     currentUrl.startsWith("http://127.0.0.1:3000")) && (
//                     <AppNavbarLocalhost url={currentUrl} />
//                 )
//             }
          

//     <Navbar expand="xl" variant="dark" bg="primary" sticky="top" data-testid="AppNavbar" className="bg-body-tertiary justify-content-between">
// {/*       
//         <Navbar.Brand as={Link} to="/">
//             UCSB Software Licensing Page
//         </Navbar.Brand> */}

//         <Form inline>
//         <InputGroup>
//           <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
//           <Form.Control
//             placeholder="Username"
//             aria-label="Username"
//             aria-describedby="basic-addon1"
//           />
//         </InputGroup>
//       </Form>
//       <Form inline>
//         <Row>
//           <Col xs="auto">
//             <Form.Control
//               type="text"
//               placeholder="Search"
//               className=" mr-sm-2"
//             />
//           </Col>
//           <Col xs="auto">
//             <Button type="submit">Submit</Button>
//           </Col>
//         </Row>
//       </Form>
//       {/* <Nav className="ml-auto">
//           {
//             currentUser && currentUser.loggedIn ? (
//               <>
//                 <Navbar.Text className="me-3" as={Link} to="/profile">Welcome, {currentUser.root.user.email}</Navbar.Text>
//                 <Button onClick={doLogout}>Log Out</Button>
//               </>
//             ) : (
//               <Button href="/oauth2/authorization/google">Log In</Button>
//             )
//           }
//       </Nav> */}
      
//     </Navbar>
//     </>
//   );
// }

// export default AppNavbar;




import { Button, Container, Nav, Navbar, NavDropdown, NavItem } from "react-bootstrap";
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";
import AppNavbarLocalhost from "main/components/Nav/AppNavbarLocalhost"
import { GiShoppingCart } from "react-icons/gi";
import data from "../../../data.js"
import navbar from "../style/navbar.css"

export default function AppNavbar({ currentUser, systemInfo, doLogout, currentUrl = window.location.href }) {
  const { products } = data; 

  return (
        <>
            {
                (currentUrl.startsWith("http://localhost:3000") ||
                    currentUrl.startsWith("http://127.0.0.1:3000")) && (
                    <AppNavbarLocalhost url={currentUrl} />
                )
            }
            <Navbar expand="xl" variant="dark" bg="primary" sticky="top" data-testid="AppNavbar">
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        UCSB Software Licensing Page
                    </Navbar.Brand>

                    <>
                        {/* be sure that each NavDropdown has a unique id and data-testid  */}
                    </>
          <Navbar.Collapse className="justify-content-between">
            <Nav className="mr-auto">
              {
                hasRole(currentUser, "ROLE_ADMIN") && (
                  <NavDropdown title="Admin" id="appnavbar-admin-dropdown" data-testid="appnavbar-admin-dropdown" >
                    <NavDropdown.Item href="/admin/users">Users</NavDropdown.Item>
                  </NavDropdown>
                )
              }
            </Nav>
            {
              currentUser && currentUser.loggedIn && (
                <>

  
                  {/*<Nav.Link as={Link} to="/ucsbdates">UCSB Dates</Nav.Link>
                  <Nav.Link as={Link} to="/placeholder">Placeholder</Nav.Link> */}
                  <Navbar.Toggle />
                    <Nav className="me-auto">
                        {/* {
                            systemInfo?.springH2ConsoleEnabled && (
                                <>
                                    <Nav.Link href="/h2-console">H2Console</Nav.Link>
                                </>
                            )
                        } */}
                      <nav className = "nav-link">
                        <Nav.Link as={Link} to="/database_entries">Database</Nav.Link>

                        {
                            systemInfo?.showSwaggerUILink && (
                                <>
                                    <Nav.Link href="/swagger-ui/index.html">Swagger</Nav.Link>
                                </>
                            )
                        }
                      </nav>
                    </Nav>

        
                    {/* 
                    <NavItem>
                      <Form className="d-flex">
                        <Form.Control
                          type="search"
                          placeholder="Search: "
                          className="my_search_class"
                          aria-label="Search"
                        />
                        <Button variant="success">Search</Button>
                      </Form>
                    </NavItem> */}

                    <NavItem>
                      <button className="btn shopping-cart-btn">
                          <GiShoppingCart size={26}></GiShoppingCart>
                        </button>
                    </NavItem>
                    
                </>
              )
            }
            <Nav className="ml-auto">
              {
                currentUser && currentUser.loggedIn ? (
                  <>
                    <Navbar.Text className="me-3" as={Link} to="/profile">{currentUser.root.user.email}</Navbar.Text>
                    <Button onClick={doLogout}>Log Out</Button>
                  </>
                ) : (
                  <Button href="/oauth2/authorization/google">Log In</Button>
                )
              }
            </Nav>
          </Navbar.Collapse>
        </Container >
      </Navbar >
    </>
  );
}