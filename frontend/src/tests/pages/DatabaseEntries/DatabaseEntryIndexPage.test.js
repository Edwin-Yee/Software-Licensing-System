import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import DatabaseEntryIndexPage from "main/pages/DatabaseEntries/DatabaseEntryIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { databaseEntriesFixtures } from "fixtures/databaseEntriesFixtures";

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

describe("DatabaseEntryIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "DatabaseEntryTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };


    const queryClient = new QueryClient();

    test("Renders with Create Button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/database_entries/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <DatabaseEntryIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Database Entry/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create Database Entry/);
        expect(button).toHaveAttribute("href", "/database_entries/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    // test("renders three database entries correctly for regular user", async () => {
    //     setupUserOnly();
    //     axiosMock.onGet("/api/database_entries/all").reply(200, databaseEntriesFixtures.threeDatabaseEntries);

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <DatabaseEntryIndexPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2"); });
    //     expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    //     expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("4");

    //     const createDatabaseEntryButton = screen.queryByText("Create Database Entry");
    //     expect(createDatabaseEntryButton).not.toBeInTheDocument();
   
    //     const name = screen.getByText("Sea Anemone");
    //     expect(name).toBeInTheDocument();

    //     const email = screen.getByText("sea_anemone@ucsb.edu");
    //     expect(email).toBeInTheDocument();

    //     const department = screen.getByText("art");
    //     expect(department).toBeInTheDocument();

    //     const licenseAllocated = screen.getByText("Adobe Creative Cloud");
    //     expect(licenseAllocated).toBeInTheDocument();

    //     const licensePurchaseDate = screen.getByText("2023-09-22T15:31:00");
    //     expect(licensePurchaseDate).toBeInTheDocument();

    //     const licenseExpirationDate = screen.getByText("2024-09-23T15:31:00");
    //     expect(licenseExpirationDate).toBeInTheDocument();

    //     // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
    //     expect(screen.queryByTestId("DatabaseEntryTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
    //     expect(screen.queryByTestId("DatabaseEntryTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    // });

    // test("renders empty table when backend unavailable, user only", async () => {
    //     setupUserOnly();

    //     axiosMock.onGet("/api/database_entries/all").timeout();

    //     const restoreConsole = mockConsole();

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <DatabaseEntryIndexPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
    //     const errorMessage = console.error.mock.calls[0][0];
    //     expect(errorMessage).toMatch("Error communicating with backend via GET on /api/database_entries/all");
    //     restoreConsole();

    // });

    // test("what happens when you click delete, admin", async () => {
 
    //     setupAdminUser();

    //     axiosMock.onGet("/api/database_entries/all").reply(200, databaseEntriesFixtures.threeDatabaseEntries);
    //     axiosMock.onDelete("/api/database_entries").reply(200, "Database Entry with id 1 was deleted");

    //     render(
    //         <QueryClientProvider client={queryClient}>
    //             <MemoryRouter>
    //                 <DatabaseEntryIndexPage />
    //             </MemoryRouter>
    //         </QueryClientProvider>
    //     );

    //     await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

    //     expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");


    //     const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    //     expect(deleteButton).toBeInTheDocument();

    //     fireEvent.click(deleteButton);

    //     await waitFor(() => { expect(mockToast).toBeCalledWith("Database Entry with id 1 was deleted") });

    //     await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
    //     expect(axiosMock.history.delete[0].url).toBe("/api/database_entries");
    //     expect(axiosMock.history.delete[0].url).toBe("/api/database_entries");
    //     expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    // });

});


