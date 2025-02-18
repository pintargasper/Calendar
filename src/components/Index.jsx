const Index = () => {
    return (
        <div className={"wrapper"}>
            <div className={"content"}>
                <div className={"container mt-2"}>
                    <div className={"row align-items-center"}>
                        <div className={"col-md-4 text-center"}>
                            <img
                                src={"/files/img/logo192.webp"}
                                srcSet={"/files/img/logo192.webp 480w, /files/img/logo512.webp 1080w"}
                                sizes={"50vw"}
                                alt={"logo"}
                                width={"192"}
                                height={"192"}
                                className={"img-fluid img-profile rounded-circle"}
                            />
                        </div>
                        <div className={"about col-md-8"}>
                            <h1 className={"display-5"}>Calendar</h1>
                            <p className={"lead"}>The calendar allows for easy entry of important life events,
                                such as birthdays, anniversaries, weddings, and other key moments.
                                One of its greatest advantages is the ability to convert entries into
                                a pdf format, making printing and wall display simple. Additionally,
                                it enables data storage in an excel file, making it easier to generate
                                the calendar for future use.</p>
                            <p className={"text-muted"}>Latest version: 1.0.0</p>
                        </div>
                    </div>
                </div>

                <div className={"container bg-light mt-3"}>
                    <div className={"row mt-2"}>
                        <p className={"fw-bold h5 to-center w-100 text-center"}>
                            Supported languages
                        </p>
                        <div className={"d-flex justify-content-center align-items-center"}>
                            <ul>
                                <li>Slovenian</li>
                                <li>English</li>
                            </ul>
                        </div>
                    </div>

                    <div className={"row mt-2"}>
                        <p className={"fw-bold h5 to-center w-100 text-center"}>
                            Supported formats
                        </p>
                        <div className={"col-md-12"}>
                            <div className={"d-flex flex-column justify-content-center align-items-center"}>
                                <ul>
                                    <li>
                                        Excel
                                    </li>
                                    <li>
                                        Pdf
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;