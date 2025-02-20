import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Popup from "./popup/Popup.jsx";
import { ToExcel, FromExcel } from "./generator/Excel.jsx";
import {ToPdf} from "./generator/Pdf.jsx";
import {DaysOfWeek, Months} from "./generator/Events.jsx";

const Calendar = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [events, setEvents] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedFormat, setSelectedFormat] = useState("pdf");
    const [file, setFile] = useState(null);
    const [override, setOverride] = useState(false);

    const firstDay = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const prevMonthDays = new Date(year, month - 1, 0).getDate();

    const emptySlots = firstDay === 0 ? 6 : firstDay - 1;
    const prevMonthDates = Array.from({ length: emptySlots }, (_, i) => prevMonthDays - emptySlots + i + 1);
    const currentMonthDates = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const totalSlots = prevMonthDates.length + currentMonthDates.length;
    const nextMonthDates = Array.from({ length: 42 - totalSlots }, (_, i) => i + 1);

    const calendarDays = prevMonthDates.concat(currentMonthDates, nextMonthDates);

    useEffect(() => {
        const storedEvents = JSON.parse(localStorage.getItem("events"));
        if (storedEvents) {
            setEvents(storedEvents);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(events).length > 0) {
            localStorage.setItem("events", JSON.stringify(events));
        }
    }, [events]);

    const previousMonth = () => {
        setMonth((prev) => (prev === 1 ? 12 : prev - 1));
        setYear((prev) => (month === 1 ? prev - 1 : prev));
    };

    const nextMonth = () => {
        setMonth((prev) => (prev === 12 ? 1 : prev + 1));
        setYear((prev) => (month === 12 ? prev + 1 : prev));
    };

    const dayClick = (day, monthClicked, yearClicked) => {
        setSelectedDay(day);
        setSelectedMonth(monthClicked);
        setSelectedYear(yearClicked);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
    };

    const updateEvents = (updatedEvents) => {
        const eventKey = `${selectedDay}-${selectedMonth}-${selectedYear}`;
        setEvents((prev) => ({ ...prev, [eventKey]: updatedEvents }));
    };

    const exportData = () => {
        if (selectedFormat.match("excel")) {
            ToExcel(events);
        } else {
            ToPdf(events);
        }
    };

    const importData = async () => {
        if (override) {
            setEvents({});
            localStorage.removeItem("events");
        }

        if (!file) {
            return;
        }

        const data = await FromExcel(file);

        if (data && typeof data === "object") {
            setEvents(prevEvents => {
                const updatedEvents = { ...prevEvents, ...data };
                localStorage.setItem("events", JSON.stringify(updatedEvents));
                return updatedEvents;
            });
            setFile(null);
        }
    };

    const fileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const clearData = () => {
        setEvents({});
        localStorage.removeItem("events");
    }

    return (
        <Container fluid className={"create"}>
            <Row>
                <Col xs={12} md={4} lg={3} className={"mt-5 mb-4 mb-md-0 order-md-first"}>
                    <aside className={"aside mt-5"}>
                        <div className={"form-group border rounded p-3"}>
                            <p className={"text-center"}>Data</p>
                            <p className={"h5"}>Clear</p>
                            <Button
                                variant={"light"}
                                className={"btn btn-light w-100 mt-2"}
                                disabled={Object.keys(events).length === 0}
                                onClick={clearData}>
                                Clear data
                            </Button>
                        </div>
                        <div className={"form-group border rounded mt-3 p-3"}>
                            <p className={"text-center"}>Upload file</p>
                            <p className={"h5"}>Excel</p>
                            <div className={"d-flex justify-content-between align-items-center mt-2 mb-2 me-1"}>
                                <label className={"form-check-label"} htmlFor={"flexCheckDefault"}>
                                    Override events
                                </label>
                                <input
                                    id={"flexCheckDefault"}
                                    type={"checkbox"}
                                    className={"form-check-input ms-2"}
                                    checked={override}
                                    onChange={() => setOverride(previous => !previous)}
                                />
                            </div>
                            <label
                                htmlFor={"excel-upload"}
                                className={"btn btn-light w-100 text-center"}>
                                {file === null ? "Choose" : "File" + ": " + file.name}
                            </label>
                            <input
                                id={"excel-upload"}
                                type={"file"}
                                className={"form-control-file input w-100"}
                                accept={".xlsx, .xls"}
                                onChange={fileChange}
                                key={file === null ? "file-input-empty" : "file-input-with-file"}
                            />
                            <Button
                                variant={"light"}
                                className={"btn btn-light w-100 mt-2"}
                                disabled={!file}
                                onClick={importData}>
                                Upload
                            </Button>
                        </div>
                        <div className={"form-group border rounded mt-3 p-3"}>
                            <p className={"text-center"}>Download</p>
                            <p className={"h5"}>Format</p>
                            <select
                                className={"select form-select w-100"}
                                aria-label={"Type"}
                                value={selectedFormat}
                                onChange={(event) => setSelectedFormat(event.target.value)}>
                                <option value={"pdf"}>Pdf</option>
                                <option value={"excel"}>Excel</option>
                            </select>
                            <Button
                                variant={"light"}
                                className={"btn btn-light w-100 mt-2"}
                                disabled={Object.keys(events).length === 0}
                                onClick={exportData}>Generate</Button>
                        </div>
                    </aside>
                </Col>
                <Col xs={12} md={8} lg={9}>
                    <Container className={"main p-4"}>
                        <div className={"d-flex justify-content-between align-items-center mb-4"}>
                            <Button variant={"light"} onClick={previousMonth}>&lt; Previous</Button>
                            <h2 className={"text-xl font-bold"}>{Months.first().name[month - 1]} {year}</h2>
                            <Button variant={"light"} onClick={nextMonth}>Next &gt;</Button>
                        </div>
                        <Row className={"text-center font-bold"}>
                            {DaysOfWeek.map((day) => (
                                <Col key={day} className={"p-2 bg-gray-200 rounded-md"}>
                                    {day}
                                </Col>
                            ))}
                        </Row>
                        {[...Array(Math.ceil(calendarDays.length / 7))].map((_, rowIndex) => (
                            <Row key={rowIndex} className={"mb-2"}>
                                {[...Array(7)].map((_, colIndex) => {
                                    const index = rowIndex * 7 + colIndex;
                                    const isPrevMonth = index < emptySlots;
                                    const isNextMonth = index >= emptySlots + daysInMonth;
                                    const day = calendarDays[index];

                                    const monthClicked = isPrevMonth
                                        ? month === 1 ? 12 : month - 1
                                        : isNextMonth
                                            ? month === 12 ? 1 : month + 1
                                            : month;

                                    const yearClicked = isPrevMonth
                                        ? month === 1 ? year - 1 : year
                                        : isNextMonth
                                            ? month === 12 ? year + 1 : year
                                            : year;

                                    const noteKey = `${day}-${monthClicked}-${yearClicked}`;

                                    return (
                                        <Col
                                            key={colIndex}
                                            className={`d-flex flex-column h-20 rounded-md border flex-grow-1 text-center box ${isPrevMonth || isNextMonth ? 'bg-gray-300 text-muted' : 'bg-blue-100 cursor-pointer'}`}
                                            onClick={() => !isPrevMonth && !isNextMonth && dayClick(day, monthClicked, yearClicked)}
                                        >
                                            <span>{day}</span>
                                            <hr />
                                            {events[noteKey] && events[noteKey].length > 0 ? (
                                                <span className={"text-sm mt-1"}>Events: {events[noteKey].length}</span>
                                            ) : null}
                                        </Col>
                                    );
                                })}
                            </Row>
                        ))}
                        {showPopup && (
                            <Popup
                                day={selectedDay}
                                month={selectedMonth}
                                year={selectedYear}
                                events={events[`${selectedDay}-${selectedMonth}-${selectedYear}`] || []}
                                onClose={closePopup}
                                onUpdateEvents={updateEvents}
                            />
                        )}
                    </Container>
                </Col>
            </Row>
        </Container>
    );
};

export default Calendar;