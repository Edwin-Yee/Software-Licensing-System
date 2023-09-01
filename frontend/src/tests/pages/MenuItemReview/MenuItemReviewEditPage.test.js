import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import MenuItemReviewEditPage from "main/pages/MenuItemReview/MenuItemReviewEditPage";

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
            id: 1
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("MenuItemReviewEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/menuitemreview", {params: {id: 1}}).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {
            const restoreConsole = mockConsole();
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit MenuItemReview");
            expect(screen.queryByTestId("MenuItemReview-name")).not.toBeInTheDocument();
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
            axiosMock.onGet("/api/menuitemreview", {params: {id: 1}}).reply(200, {
                "id": 1,
                "itemId": 1,
                "reviewerEmail": "a@ucsb.edu",
                "stars": 1,
                "dateReviewed": "2023-08-11T12:00",
                "comments": "First"
            });
            axiosMock.onPut("/api/menuitemreview").reply(200, {
                "id": 1,
                "itemId": 2,
                "reviewerEmail": "b@ucsb.edu",
                "stars": 2,
                "dateReviewed": "2023-08-12T12:00",
                "comments": "Second"
            });
        });

        const queryClient = new QueryClient();

        test("Is populated with the data provided", async () => {
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <MenuItemReviewEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("MenuItemReviewForm-id");

            const idField = screen.getByTestId("MenuItemReviewForm-id");
            const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
            const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
            const starsField = screen.getByTestId("MenuItemReviewForm-stars");
            const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
            const commentsField = screen.getByTestId("MenuItemReviewForm-comments");

            expect(idField).toBeInTheDocument();
            expect(itemIdField).toBeInTheDocument();
            expect(reviewerEmailField).toBeInTheDocument();
            expect(starsField).toBeInTheDocument();
            expect(dateReviewedField).toBeInTheDocument();
            expect(commentsField).toBeInTheDocument();

            expect(idField).toHaveValue("1");
            expect(itemIdField).toHaveValue("1");
            expect(reviewerEmailField).toHaveValue("a@ucsb.edu");
            expect(starsField).toHaveValue("1");
            expect(dateReviewedField).toHaveValue("2023-08-11T12:00");
            expect(commentsField).toHaveValue("First");

            const newItemId = "2";
            const newReviewerEmail = "b@ucsb.edu";
            const newStars = "2";
            const newDateReviewed = "2023-08-12T12:00";
            const newComments = "Second";

            // change all the fields
            fireEvent.change(itemIdField, { target: { value: newItemId } });
            fireEvent.change(reviewerEmailField, { target: { value: newReviewerEmail } });
            fireEvent.change(starsField, { target: { value: newStars } });
            fireEvent.change(dateReviewedField, { target: { value: newDateReviewed } });
            fireEvent.change(commentsField, { target: { value: newComments } });

            const submitButton = screen.getByTestId("MenuItemReviewForm-submit");
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith(`MenuItemReview Updated - id: 1 itemId: ${newItemId} reviewerEmail: ${newReviewerEmail} stars: ${newStars} dateReviewed: ${newDateReviewed} comments: ${newComments}`);
            expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview"});

            expect(axiosMock.history.put.length).toBe(1); // one call
            expect(axiosMock.history.put[0].params).toEqual({ id: 1 });
            expect(JSON.parse(axiosMock.history.put[0].data)).toEqual({
                "itemId": newItemId,
                "reviewerEmail": newReviewerEmail,
                "stars": newStars,
                "dateReviewed": newDateReviewed,
                "comments": newComments
            });
        });
    });
});