import * as XLSX from "xlsx";

export const ToExcel = (events) => {
    const eventData = Object.keys(events).map(key => {
        const [day, month, year] = key.split('-');
        const eventColumns = {};
        events[key].forEach((event, index) => {
            eventColumns[`Event ${index + 1}`] = event;
        });
        return {
            Date: `${day}-${month}-${year}`,
            OriginalDate: `${day}.${month}.${year}`,
            ...eventColumns
        };
    });

    eventData.sort((first, second) => new Date(first.Date) - new Date(second.Date));

    const finalData = eventData.map(item => {
        const { OriginalDate, ...rest } = item;
        return {
            Date: OriginalDate,
            ...rest
        };
    });

    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Events");
    XLSX.writeFile(workbook, "Events.xlsx");
};

export const FromExcel = (file) => {
    return new Promise((resolve, reject) => {
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                const jsonData = XLSX.utils.sheet_to_json(worksheet);

                const result = jsonData.reduce((accumulator, row) => {
                    const dateKey = row.Date.split('.').reverse().join('-');
                    const eventData = Object.keys(row)
                        .filter(key => key !== 'Date')
                        .map(key => row[key]);

                    if (accumulator[dateKey]) {
                        accumulator[dateKey] = [...accumulator[dateKey], ...eventData];
                    } else {
                        accumulator[dateKey] = eventData;
                    }
                    return accumulator;
                }, {});
                resolve(result);
            };
            reader.onerror = () => {
                reject(null);
            };
            reader.readAsArrayBuffer(file);
        } else {
            reject(null);
        }
    });
};