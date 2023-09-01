import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import UCSBDiningCommonsMenuCreatePage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuCreatePage";
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

describe("UCSBDiningCommonsMenuCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend, and redirects to /ucsbdiningcommonsmenu", async () => {

        const queryClient = new QueryClient();
        const menu_item = {
            id: 3,
            diningCommonsCode: "Ortega",
            name: "Turkey Sandwich",
            station: "Entree"
        };

        axiosMock.onPost("/api/ucsbdiningcommonsmenu/post").reply(202, menu_item);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <UCSBDiningCommonsMenuCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        )

        await waitFor(() => {
            expect(screen.getByLabelText("Name")).toBeInTheDocument();
        });

        const diningCommonsCodeInput = screen.getByLabelText("diningCommonsCode");
        expect(diningCommonsCodeInput).toBeInTheDocument();

        const nameInput = screen.getByLabelText("Name");
        expect(nameInput).toBeInTheDocument();

        const stationInput = screen.getByLabelText("Station");
        expect(stationInput).toBeInTheDocument();

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();

        fireEvent.change(diningCommonsCodeInput, { target: { value: 'Ortega' } })
        fireEvent.change(nameInput, { target: { value: 'Turkey Sandwich' } })
        fireEvent.change(stationInput, { target: { value: 'Entree' } })
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual({
            diningCommonsCode: "Ortega",
            name: "Turkey Sandwich",
            station: "Entree"
        });

        // assert - check that the toast was called with the expected message;
        expect(mockToast).toBeCalledWith("New UCSBDiningCommonsMenu Created - id: 3 name: Turkey Sandwich");
        expect(mockNavigate).toBeCalledWith({ "to": "/ucsbdiningcommonsmenu" });

    });
});


