import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UCSBDiningCommonsMenuIndexPage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuIndexPage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import mockConsole from "jest-mock-console";
import { ucsbDiningCommonsMenuFixtures } from "fixtures/ucsbDiningCommonsMenuFixtures";

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

describe("UCSBDiningCommonsMenuIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "UCSBDiningCommonsMenuTable";

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
        axiosMock.onGet("/api/ucsbdiningcommonsmenu/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create UCSBDiningCommonsMenu/)).toBeInTheDocument();
        });
        const button = screen.getByText(/Create UCSBDiningCommonsMenu/);
        expect(button).toHaveAttribute("href", "/ucsbdiningcommonsmenu/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three ucsbdiningcommonsmenu correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/ucsbdiningcommonsmenu/all").reply(200, ucsbDiningCommonsMenuFixtures.threeMenuItems);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        /*
        
         {
            "id": 2,
            "diningCommonsCode": "Portola",
            "name": "Steak",
            "station": "Entree"
        },

        {
            "id": 3,
            "diningCommonsCode": "DLG",
            "name": "Chicken Burrito",
            "station": "Entree"
        },

        {
            "id": 4,
            "diningCommonsCode": "Ortega",
            "name": "Spaghetti and Meatballs",
            "station": "Entree"
        },
        
        */
        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("Portola"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-diningCommonsCode`)).toHaveTextContent("DLG");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-diningCommonsCode`)).toHaveTextContent("Ortega");

        const createUCSBDiningCommonsMenuButton = screen.queryByText("Create UCSBDiningCommonsMenu");
        expect(createUCSBDiningCommonsMenuButton).not.toBeInTheDocument();
    
        // const diningCommonsCode = screen.getByText("DLG");
        // expect(diningCommonsCode).toBeInTheDocument();

        const name = screen.getByText("Chicken Burrito");
        expect(name).toBeInTheDocument();

        // const station = screen.getByText("Entree");
        // expect(station).toBeInTheDocument();

        // for non-admin users, details button is visible, but the edit and delete buttons should not be visible
        expect(screen.queryByTestId("UCSBDiningCommonsMenuTable-cell-row-0-col-Delete-button")).not.toBeInTheDocument();
        expect(screen.queryByTestId("UCSBDiningCommonsMenuTable-cell-row-0-col-Edit-button")).not.toBeInTheDocument();
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/ucsbdiningcommonsmenu/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });
        
        const errorMessage = console.error.mock.calls[0][0];
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/ucsbdiningcommonsmenu/all");
        restoreConsole();

    });

    test("what happens when you click delete, admin", async () => {
        setupAdminUser();

        axiosMock.onGet("/api/ucsbdiningcommonsmenu/all").reply(200, ucsbDiningCommonsMenuFixtures.threeMenuItems);
        axiosMock.onDelete("/api/ucsbdiningcommonsmenu").reply(200, "UCSBDiningCommonsMenu with id Portola was deleted");


        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-diningCommonsCode`)).toHaveTextContent("Portola");


        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("UCSBDiningCommonsMenu with id Portola was deleted") });

        await waitFor(() => { expect(axiosMock.history.delete.length).toBe(1); });
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbdiningcommonsmenu");
        expect(axiosMock.history.delete[0].url).toBe("/api/ucsbdiningcommonsmenu");
        expect(axiosMock.history.delete[0].params).toEqual({ id: 2 });
    });

});


