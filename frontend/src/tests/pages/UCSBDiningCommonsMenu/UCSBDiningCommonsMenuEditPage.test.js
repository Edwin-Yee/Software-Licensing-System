import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBDiningCommonsMenuEditPage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBDiningCommonsMenuEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenu", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit UCSBDiningCommonsMenu");
            expect(screen.queryByTestId("UCSBDiningCommonsMenu-name")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsbdiningcommonsmenu", { params: { id: 17 } }).reply(200, {
                id: 17,
                diningCommonsCode: "Portola",
                name: "Burritos",
                station: "Entree"
            });
            axiosMock.onPut('/api/ucsbdiningcommonsmenu').reply(200, {
                id: "17",
                diningCommonsCode: "Ortega",
                name: "Huge Burritos",
                station: "Entree"
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toBeInTheDocument();
            expect(diningCommonsCodeField).toHaveValue("Portola")
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Burritos");
            expect(stationField).toBeInTheDocument();
            expect(stationField).toHaveValue("Entree");

            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(diningCommonsCodeField, { target: { value: 'Ortega' } });
            fireEvent.change(nameField, { target: { value: 'Huge Burritos' } });
            fireEvent.change(stationField, { target: { value: 'Entree' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenu Updated - id: 17 name: Huge Burritos");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenu" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                diningCommonsCode: "Ortega",
                name: "Huge Burritos",
                station: "Entree"
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBDiningCommonsMenuEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("UCSBDiningCommonsMenuForm-id");

            const idField = screen.getByTestId("UCSBDiningCommonsMenuForm-id");
            const diningCommonsCodeField = screen.getByTestId("UCSBDiningCommonsMenuForm-diningCommonsCode");
            const nameField = screen.getByTestId("UCSBDiningCommonsMenuForm-name");
            const stationField = screen.getByTestId("UCSBDiningCommonsMenuForm-station");
            const submitButton = screen.getByTestId("UCSBDiningCommonsMenuForm-submit");

            expect(idField).toHaveValue("17");
            expect(diningCommonsCodeField).toHaveValue("Portola");
            expect(nameField).toHaveValue("Burritos");
            expect(stationField).toHaveValue("Entree");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(diningCommonsCodeField, { target: { value: 'Ortega' } });
            fireEvent.change(nameField, { target: { value: 'Huge Burritos' } });
            fireEvent.change(stationField, { target: { value: 'Entree' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenu Updated - id: 17 name: Huge Burritos");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenu" });
        });

       
    });
});
