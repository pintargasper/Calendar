import { jsPDF } from "jspdf";
import {Events, Months} from "./Events.jsx";

export const ToPdf = (events) => {
    const document = new jsPDF();
    const year = new Date().getFullYear();

    Months.first().name.forEach((monthName, monthIndex) => {
        if (monthIndex > 0) {
            document.addPage();
        }

        const oldMonthName = Months.first().old[monthIndex];

        document.setFontSize(20);
        document.setTextColor(0, 100, 0);
        document.text(`${monthName}`, 20, 15);

        document.setFontSize(16);
        document.setTextColor(0, 0, 0);
        document.text(`${year}`, 105, 15, { align: "center" });

        document.setFontSize(20);
        document.setTextColor(0, 100, 0);
        document.text(`${formatDayOfWeek(oldMonthName)}`, 190 - document.getTextWidth(oldMonthName), 15);

        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
        const midPoint = Math.min(Math.ceil(daysInMonth / 2), 15);

        const leftX = 20, rightX = 110;
        let leftY = 35, rightY = 35;
        const lineHeight = 17;

        for (let day = 1; day <= daysInMonth; day++) {
            let x = day <= midPoint ? leftX : rightX;
            let y = day <= midPoint ? leftY : rightY;

            const dayOfWeek = new Date(year, monthIndex, day).getDay();
            const isSunday = dayOfWeek === 0;

            document.setFontSize(22);
            document.setFont("helvetica", "bold");
            document.setTextColor(isSunday ? 255 : 0, isSunday ? 0 : 0, isSunday ? 0 : 0);
            document.text(`${day}`, x, y);

            document.setFontSize(12);
            document.setFont("helvetica", "normal");

            const dayName = new Date(year, monthIndex, day).toLocaleDateString("sl-SI", { weekday: "long" });
            document.setTextColor(isSunday ? 255 : 0, isSunday ? 0 : 0, isSunday ? 0 : 0);
            document.text(formatDayOfWeek(dayName), x + 10, y - 5);

            insertWeekOfYear(document, day, monthIndex, midPoint, year, x, y);
            insertNamesAndHolidays(document, day, monthIndex, midPoint, x, y);
            insertEvents(document, events, day, dayName, monthIndex, x, y);

            document.setDrawColor(0);
            document.line(x, y + 2, x + 80, y + 2);

            if (day <= midPoint) {
                leftY += lineHeight;
            } else {
                rightY += lineHeight;
            }
        }
    });
    document.save("calendar.pdf");
};

const insertNamesAndHolidays = (document, day, monthIndex, midPoint, x, y) => {
    const dateStr = `${day < 10 ? '0' + day : day}-${monthIndex + 1 < 10 ? '0' + (monthIndex + 1) : (monthIndex + 1)}`;
    const eventForDate = Events.find(event => event.date === dateStr);

    if (eventForDate) {
        eventForDate.names.forEach(nameObject => {
            if (nameObject.name === "" || nameObject.name === null) {

                eventForDate.holidays.forEach(holidayObject => {
                    document.setFontSize(9);
                    document.setTextColor(holidayObject.name.color);
                    document.text(holidayObject.name.text, x + 10, y);

                    document.setFontSize(8);
                    document.setTextColor(holidayObject.countries.color);
                    document.text(holidayObject.countries.text, (day <= midPoint ? 100 : 190) - document.getTextWidth(holidayObject.countries.text), y + 1);
                });
            } else {
                document.setFontSize(9);
                document.setTextColor(nameObject.color);
                document.text(nameObject.name, x + 10, y);
                const nameWidth = document.getTextWidth(nameObject.name);

                eventForDate.holidays.forEach(object => {
                    if (object.name.text !== "" || object.name.text !== null) {
                        document.setTextColor(object.name.color);
                        document.text(object.name.text, x + 10 + nameWidth + 2, y);

                        document.setFontSize(8);
                        document.setTextColor(object.countries.color);
                        document.text(object.countries.text, (day <= midPoint ? 100 : 190) - document.getTextWidth(object.countries.text), y + 1);
                    }
                });
            }
        });

        eventForDate.sunrise.forEach(object => {
            if (object.text !== "" || object.text !== null) {
                document.setFontSize(8);
                document.setTextColor(object.color);
                document.text(object.text, (day <= midPoint ? 100 : 190) - document.getTextWidth(object.text), y - 1.5);
            }
        });

        eventForDate.sunset.forEach(object => {
            if (object.text !== "" || object.text !== null) {
                document.setFontSize(8);
                document.setTextColor(object.color);
                document.text(object.text, (day <= midPoint ? 100 : 190) - document.getTextWidth(object.text), y + 1);
            }
        });
    }
}

const insertEvents = (document, events, day, dayName, monthIndex, x, y) => {
    const dateStr = `${day}-${monthIndex + 1}-${new Date().getFullYear()}`;
    const dayNameWidth = document.getTextWidth(dayName) + 2;

    if (events[dateStr]) {
        const eventCount = events[dateStr].length;
        const fontSize = Math.max(8, 13 - eventCount);
        const yOffset = Math.max(8, 20 - fontSize);

        events[dateStr].forEach((eventText) => {
            document.setFontSize(fontSize);
            document.setTextColor("black");
            document.text(`• ${eventText}`, (x + 10) + dayNameWidth * 2, y - yOffset);
            y += 3;
        });
    }
};

const insertWeekOfYear = (document, day, monthIndex, midPoint, year, x, y) => {
    const date = new Date(year, monthIndex, day);

    document.setFontSize(10);
    document.setTextColor("black");

    const getISOWeek = (date) => {
        const temporaryDate = new Date(date.getTime());
        temporaryDate.setHours(0, 0, 0, 0);
        temporaryDate.setDate(temporaryDate.getDate() + 3 - (temporaryDate.getDay() || 7));
        const firstThursday = new Date(temporaryDate.getFullYear(), 0, 4);
        return Math.round((temporaryDate - firstThursday) / (7 * 24 * 60 * 60 * 1000)) + 1;
    };

    const weekNumber = getISOWeek(date);

    if (day === 1 && monthIndex === 0) {
        document.text(
            `${weekNumber}. teden`,
            (day <= midPoint ? 100 : 190) - document.getTextWidth(`${weekNumber}. teden`),
            y - 10
        );
        return;
    }

    if (day === 1) {
        const previousDay = new Date(year, monthIndex, day - 1);
        const previousWeekNumber = getISOWeek(previousDay);

        if (previousWeekNumber === weekNumber) {
            return;
        }
    }

    if (day === 1 || date.getDay() === 1) {
        document.text(
            `${weekNumber}. teden`,
            (day <= midPoint ? 100 : 190) - document.getTextWidth(`${weekNumber}. teden`),
            y - 10
        );
    }
};

const formatDayOfWeek = (dayOfWeek) => {
    const replacedDay = dayOfWeek.replace(/[čžš]/g, match => {
        switch (match) {
            case 'č': return 'c';
            case 'ž': return 'z';
            case 'š': return 's';
            default: return match;
        }
    });
    return replacedDay.charAt(0).toUpperCase() + replacedDay.slice(1);
};