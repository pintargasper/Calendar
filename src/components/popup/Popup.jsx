import { useState } from "react";
import { Button, Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPenToSquare, faTimes, faTrash } from "@fortawesome/free-solid-svg-icons";

const Popup = ({ day, month, year, events, onClose, onUpdateEvents }) => {
    const [newEvent, setNewEvent] = useState("");
    const [editIndex, setEditIndex] = useState(null);
    const [editText, setEditText] = useState("");
    const [deleteIndex, setDeleteIndex] = useState(null);

    const addEvent = () => {
        if (newEvent.trim()) {
            const updatedEvents = [newEvent, ...events];
            onUpdateEvents(updatedEvents);
            setNewEvent("");
        }
    };

    const editEvent = (event, index) => {
        setEditText(event);
        setEditIndex(index);
    };

    const saveEvent = () => {
        if (editText.trim()) {
            const updatedEvents = [...events];
            if (editIndex !== null && updatedEvents[editIndex]) {
                updatedEvents[editIndex] = editText;
                onUpdateEvents(updatedEvents);
                setEditText("");
                setEditIndex(null);
            }
        }
    };

    const cancelEditEvent = () => {
        setEditText("");
        setEditIndex(null);
    };

    const deleteEvent = (index) => {
        setDeleteIndex(index);
    };

    const confirmDeleteEvent = () => {
        const updatedEvents = events.filter((_, i) => i !== deleteIndex);
        onUpdateEvents(updatedEvents);
        setDeleteIndex(null);
    };

    const cancelDeleteEvent = () => {
        setDeleteIndex(null);
    };

    return (
        <Modal className={"modal"} show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Events for {day}.{month}.{year}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                Number of events: {events.length}
                <hr />
                <div className={"events"}>
                    {events.length === 0 ? (
                        <div>No events</div>
                    ) : (
                        events.map((event, index) => (
                            <Row key={index} className={"mb-2 align-items-center"}>
                                <Col className={"d-flex justify-content-between"}>
                                    {editIndex === index ? (
                                        <InputGroup>
                                            <Form.Control
                                                type={"text"}
                                                value={editText}
                                                onChange={(event) => setEditText(event.target.value)}
                                            />
                                            <Button variant={"light"} onClick={saveEvent}>
                                                <FontAwesomeIcon icon={faCheck} className={"event-icon"} />
                                            </Button>
                                            <Button variant={"light"} onClick={cancelEditEvent}>
                                                <FontAwesomeIcon icon={faTimes} className={"event-icon"} />
                                            </Button>
                                        </InputGroup>
                                    ) : deleteIndex === index ? (
                                        <InputGroup>
                                            <Form.Control
                                                type={"text"}
                                                value={event}
                                                disabled
                                            />
                                            <Button variant={"light"} onClick={confirmDeleteEvent}>
                                                <FontAwesomeIcon icon={faCheck} className={"event-icon"} />
                                            </Button>
                                            <Button variant={"light"} onClick={cancelDeleteEvent}>
                                                <FontAwesomeIcon icon={faTimes} className={"event-icon"} />
                                            </Button>
                                        </InputGroup>
                                    ) : (
                                        <>
                                            <span className={"event-text"}>{event}</span>
                                            <div>
                                                <Button variant={"light"} onClick={() => editEvent(event, index)}>
                                                    <FontAwesomeIcon icon={faPenToSquare} className={"event-icon"} />
                                                </Button>
                                                <Button variant={"light"} onClick={() => deleteEvent(index)}>
                                                    <FontAwesomeIcon icon={faTrash} className={"event-icon"} />
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        ))
                    )}
                </div>
                <InputGroup className={"mb-3 mt-3"}>
                    <Form.Control
                        type={"text"}
                        placeholder={"Add new event"}
                        value={newEvent}
                        onChange={(event) => setNewEvent(event.target.value)}
                    />
                    <Button variant={"light"} onClick={addEvent}>
                        Add event
                    </Button>
                </InputGroup>
            </Modal.Body>
        </Modal>
    );
};

export default Popup;