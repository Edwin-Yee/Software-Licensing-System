import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import DatabaseEntryEditPage from "main/pages/DatabaseEntries/DatabaseEntryEditPage";

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

describe("DatabaseEntryEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/database_entries", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DatabaseEntryEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit DatabaseEntry");
            expect(screen.queryByTestId("DatabaseEntry-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/database_entries", { params: { id: 17 } }).reply(200, {
                id: 17,
                name: "Seaweed",
                email: "seaweed@ucsb.edu",
                department: "Art",
                license_allocated: "Adobe Acrobat",
                license_purchase_date: "2024-09-21T15:32:00",
                license_expiration_date: "2024-09-21T15:33:00",
            });
            axiosMock.onPut('/api/database_entries').reply(200, {
                id: "17",
                name: "Seaweed2",
                email: "seaweed2@ucsb.edu",
                department: "Art2",
                license_allocated: "Adobe Acrobat2",
                license_purchase_date: "2024-09-21T15:32:01",
                license_expiration_date: "2024-09-21T15:33:02",
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DatabaseEntryEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("DatabaseEntryForm-id");

            const idField = screen.getByTestId("DatabaseEntryForm-id");
            const nameField = screen.getByTestId("DatabaseEntryForm-name");
            const emailField = screen.getByTestId("DatabaseEntryForm-email");
            const departmentField = screen.getByTestId("DatabaseEntryForm-department");
            const licenseAllocatedField = screen.getByTestId("DatabaseEntryForm-licenseAllocated");
            const licensePurchaseDateField = screen.getByTestId("DatabaseEntryForm-licensePurchaseDate");
            const licenseExpirationDateField = screen.getByTestId("DatabaseEntryForm-licenseExpirationDate");

            const submitButton = screen.getByTestId("DatabaseEntryForm-submit");
                
            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("17");
            expect(nameField).toBeInTheDocument();
            expect(nameField).toHaveValue("Seaweed");
            expect(emailField).toBeInTheDocument();
            expect(emailField).toHaveValue("seaweed@ucsb.edu");
            expect(departmentField).toBeInTheDocument();
            expect(departmentField).toHaveValue("Art");
            expect(licenseAllocatedField).toBeInTheDocument(); 
            expect(licenseAllocatedField).toHaveValue("Adobe Acrobat");
            expect(licensePurchaseDateField).toBeInTheDocument();
            expect(licensePurchaseDateField).toHaveValue("2024-09-21T15:32:00");
            expect(licenseExpirationDateField).toBeInTheDocument();
            expect(licenseExpirationDateField).toHaveValue("2024-09-21T15:33:00");

            expect(submitButton).toHaveTextContent("Update");
            
            fireEvent.change(nameField, { target: { value: 'Seaweed2' } });
            fireEvent.change(emailField, { target: { value: 'seaweed2@ucsb.edu' } });
            fireEvent.change(departmentField, { target: { value: 'Art2' } });
            fireEvent.change(licenseAllocatedField, { target: { value: 'Adobe Acrobat2' } });
            fireEvent.change(licensePurchaseDateField, { target: { value: '2025-10-22T15:32:00' } });
            fireEvent.change(licenseExpirationDateField, { target: { value: '2026-10-22T15:32:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("DatabaseEntry Updated - id: 17 name: Seaweed2");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/database_entries" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                name: 'Seaweed2',
                email: 'seaweed2ucsb.edu',
                department: 'Art2',
                licenseAllocated: 'Adobe Acrobat2',
                licensePurchaseDate: '2025-10-22T15:32:00',
                licenseExpirationDate: '2026-10-22T15:32:00'
            })); // posted object


        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <DatabaseEntryEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("DatabaseEntryForm-id");

            const idField = screen.getByTestId("DatabaseEntryForm-id");
            const nameField = screen.getByTestId("DatabaseEntryForm-name");
            const emailField = screen.getByTestId("DatabaseEntryForm-email");
            const departmentField = screen.getByTestId("DatabaseEntryForm-department");
            const licenseAllocatedField = screen.getByTestId("DatabaseEntryForm-licenseAllocatedField");
            const licensePurchaseDateField = screen.getByTestId("DatabaseEntryForm-licensePurchaseDateField");
            const licenseExpirationDateField = screen.getByTestId("DatabaseEntryForm-licenseExpirationDateField");

            const submitButton = screen.getByTestId("DatabaseEntryForm-submit");

            expect(idField).toHaveValue("17");

            expect(nameField).toHaveValue("Seaweed");
            expect(emailField).toHaveValue("seaweed@ucsb.edu");
            expect(departmentField).toHaveValue("Art");
            expect(licenseAllocatedField).toHaveValue("Adobe Acrobat");
            expect(licensePurchaseDateField).toHaveValue("2024-09-21T15:32:00");
            expect(licenseExpirationDateField).toHaveValue("2024-09-21T15:33:00");
           
            expect(submitButton).toBeInTheDocument();
            
            fireEvent.change(nameField, { target: { value: 'Seaweed2' } });
            fireEvent.change(emailField, { target: { value: 'seaweed2@ucsb.edu' } });
            fireEvent.change(departmentField, { target: { value: 'Art2' } });
            fireEvent.change(licenseAllocatedField, { target: { value: 'Adobe Acrobat2' } });
            fireEvent.change(licensePurchaseDateField, { target: { value: '2025-10-22T15:32:00' } });
            fireEvent.change(licenseExpirationDateField, { target: { value: '2026-10-22T15:32:00' } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("DatabaseEntry Updated - id: 17 name: Seaweed2");
            expect(mockNavigate).toBeCalledWith({ "to": "/database_entries" });
        });

       
    });
});
