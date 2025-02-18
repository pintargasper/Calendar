import { useState, useEffect } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import Popup from "./popup/Popup.jsx";

const Calendar = () => {
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);
    const [events, setEvents] = useState({});
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Januar", "Februar", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
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

    return (
        <Container className={"create p-4"}>
            <div className={"d-flex justify-content-between align-items-center mb-4"}>
                <Button variant={"light"} onClick={previousMonth}>&lt; Previous</Button>
                <h2 className={"text-xl font-bold"}>{months[month - 1]} {year}</h2>
                <Button variant={"light"} onClick={nextMonth}>Next &gt;</Button>
            </div>
            <Row className={"text-center font-bold"}>
                {daysOfWeek.map((day) => (
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
                        const dayOfMonth = day || "";

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
                                <span>{dayOfMonth}</span>
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
    );
};

export default Calendar;