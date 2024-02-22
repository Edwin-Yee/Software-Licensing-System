import { render, screen } from "@testing-library/react";
import Footer from "main/components/Nav/Footer";

describe("Footer tests", () => {
    test("Check that the Footer text renders correctly", async () => {
        render(
            <Footer />
        );
        await screen.findByText(/This is a work in progress React web application for a UCSB Software Licensing Page./);
    });
});


