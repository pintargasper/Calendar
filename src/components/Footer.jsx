const Footer = () => {
    return (
        <div>
            <br/>
            <div className={"footer container-fluid bg-light text-center py-4 align-items-center justify-content-center"}>
                <br/>
                <p className={"mb-0"}>2025 - Gašper Pintar</p>
                <a href={"/files/document/termsOfService.html"}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={"link m-1"}
                >
                    Terms of Service
                </a>
                <a href={"/files/document/privacyPolicy.html"}
                    target={"_blank"}
                    rel={"noreferrer"}
                    className={"link m-1"}
                >
                    Privacy Policy
                </a>
            </div>
        </div>
    );
}

export default Footer;