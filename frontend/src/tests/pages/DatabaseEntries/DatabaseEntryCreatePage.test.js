import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DatabaseEntriesCreatePage from "main/pages/DatabaseEntries/DatabaseEntryCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("DatabaseEntriesCreatePage tests", () => {
    const axiosMock = new AxiosMockAdapter(axios);
    const queryClient = new QueryClient();

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DatabaseEntriesCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    // test("on submit, makes request to backend, and redirects to /database_entries", async () => {

    //     const queryClient = new QueryClient();
    //     const database_entry = {
    //         id: 3,
    //         name: "Starfish",
    //         email: "starfish@ucsb.edu",
    //         department: "Math",
    //         licenseAllocated: "Adobe Photoshop",
    //         licensePurchaseDate: "2023-09-21T15:31",
    //         licenseExpirationDate: "2023-09-22T15:31",
    //     };

    //     axiosMock.onPost("/api/database_entries/post").reply(202, database_entry);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <DatabaseEntriesCreatePage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     )

    //     await waitFor(() => {
    //         expect(screen.getByLabelText("Name")).toBeInTheDocument();
    //     });

    //     const nameInput = screen.getByLabelText("Name");
    //     expect(nameInput).toBeInTheDocument();

    //     const emailInput = screen.getByLabelText("Email");
    //     expect(emailInput).toBeInTheDocument();

    //     const departmentInput = screen.getByLabelText("Department");
    //     expect(departmentInput).toBeInTheDocument();

    //     const licenseAllocatedInput = screen.getByLabelText("License Allocated");
    //     expect(licenseAllocatedInput).toBeInTheDocument();

    //     const licensePurchaseDateInput = screen.getByLabelText("License Purchase Date");
    //     expect(licensePurchaseDateInput).toBeInTheDocument();

    //     const licenseExpirationDateInput = screen.getByLabelText("License Expiration Date");
    //     expect(licenseExpirationDateInput).toBeInTheDocument();

    //     const createButton = screen.getByText("Create");
    //     expect(createButton).toBeInTheDocument();

    //     fireEvent.change(nameInput, { target: { value: 'Starfish' } })
    //     fireEvent.change(emailInput, { target: { value: 'new_starfish_account@ucsb.edu' } })
    //     fireEvent.change(departmentInput, { target: { value: 'Biology' } })
    //     fireEvent.change(licenseAllocatedInput, { target: { value: 'Adobe Illustrator' } })
    //     fireEvent.change(licensePurchaseDateInput, { target: { value: '2024-09-22T15:31' } })
    //     fireEvent.change(licenseExpirationDateInput, { target: { value: '2024-09-23T15:32' } })
    //     fireEvent.click(createButton);

    //     await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    //     expect(axiosMock.history.post[0].params).toEqual({
    //         name: "Starfish",
    //         email: "new_starfish_account@ucsb.edu",
    //         department: "Biology",
    //         licenseAllocated: "Adobe Illustrator",
    //         licensePurchaseDate: "2024-09-22T15:31",
    //         licenseExpirationDate: "2024-09-23T15:32",
    //     });

    //     // assert - check that the toast was called with the expected message
    //     expect(mockToast).toBeCalledWith("New Database Entry Created - id: 3 name: Starfish");
    //     expect(mockNavigate).toBeCalledWith({ "to": "/database_entries" });

    // });
});


