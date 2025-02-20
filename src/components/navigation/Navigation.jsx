import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

const Navigation = () => {
    return (
        <Navbar bg={"light"} variant={"light"} expand={"lg"} sticky={"top"} className={"navbar"}>
            <Navbar.Brand as={Link} to={"/"} className={"margin"}>Calendar</Navbar.Brand>
            <Navbar.Toggle aria-controls={"basic-navbar-nav"} />
            <Navbar.Collapse id={"basic-navbar-nav"}>
                <Nav className="mr-auto">
                    <Nav.Link as={Link} to={"/create"}>Create</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Navigation;