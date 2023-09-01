import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import UCSBOrganizationEditPage from "main/pages/UCSBOrganization/UCSBOrganizationEditPage";

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
            orgCode: "KRC"
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("UCSBOrganizationEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode: "KRC" } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Organization");
            expect(screen.queryByTestId("Organization-orgCode")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/ucsborganization", { params: { orgCode: "KRC" } }).reply(200, {
                orgCode: "KRC",
                orgTranslationShort: "KOREAN RADIO CL",
                orgTranslation: "KOREAN RADIO CLUB",
                inactive: "false"
            });
            axiosMock.onPut('/api/ucsborganization').reply(200, {
                orgCode: "KRC",
                orgTranslationShort: "KOREAN RADIO",
                orgTranslation: "Korean Radio Club",
                inactive: "true"
                
            });
        });

        const queryClient = new QueryClient();
    
        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByLabelText("Organization Code");

            const orgCodeField = screen.getByLabelText("Organization Code");
            const otsField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const otField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toBeInTheDocument();
            expect(orgCodeField).toHaveValue("KRC");
            expect(otsField).toBeInTheDocument();
            expect(otsField).toHaveValue("KOREAN RADIO CL");
            expect(otField).toBeInTheDocument();
            expect(otField).toHaveValue("KOREAN RADIO CLUB");
            expect(inactiveField).toBeInTheDocument();
            expect(inactiveField).toHaveValue("false");

            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(otsField, { target: { value: 'KOREAN RADIO' } });
            fireEvent.change(otField, { target: { value: 'Korean Radio Club' } });
            fireEvent.change(inactiveField, { target: { value: 'true' } });
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Organization Updated - orgCode: KRC");
            
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ orgCode: "KRC" });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                orgCode: 'KRC',
                orgTranslationShort: 'KOREAN RADIO',
                orgTranslation: 'Korean Radio Club',
                inactive: "true"
            })); // posted object



        });

        test("Changes when you click Update", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <UCSBOrganizationEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByLabelText("Organization Code");

            const orgCodeField = screen.getByLabelText("Organization Code");
            const otsField = screen.getByTestId("UCSBOrganizationForm-orgTranslationShort");
            const otField = screen.getByTestId("UCSBOrganizationForm-orgTranslation");
            const inactiveField = screen.getByTestId("UCSBOrganizationForm-inactive");
            const submitButton = screen.getByTestId("UCSBOrganizationForm-submit");

            expect(orgCodeField).toHaveValue("KRC");
            expect(otsField).toHaveValue("KOREAN RADIO CL");
            expect(otField).toHaveValue("KOREAN RADIO CLUB");
            expect(inactiveField).toHaveValue("false");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(orgCodeField, { target: { value: 'Freebirds World Burrito' } })
            fireEvent.change(otsField, { target: { value: 'KOREAN RADIO' } })
            fireEvent.change(otField, { target: { value: 'Korean Radio Club' } })
            fireEvent.change(inactiveField, { target: { value: 'true' } })

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("UCSB Organization Updated - orgCode: KRC");
            expect(mockNavigate).toBeCalledWith({ "to": "/ucsborganization" });
        });

       
    });
});