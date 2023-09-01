import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
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

describe("MenuItemReviewCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();
    test("renders without crashing", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    }
    );

    test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
        const queryClient = new QueryClient();
        const expectedMenuItemReview = {
            "id": "1337",
            "itemId": "1337",
            "reviewerEmail": "testtest@ucsb.edu",
            "stars": "2",
            "dateReviewed": "2023-08-11T12:00",
            "comments": "This is 1337"
        };

        axiosMock.onPost("/api/menuitemreview/post").reply(202, expectedMenuItemReview);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByLabelText("Item ID")).toBeInTheDocument();
        });

        const itemIdInput = screen.getByLabelText("Item ID");
        const reviewerEmailInput = screen.getByLabelText("Reviewer Email");
        const starsInput = screen.getByLabelText("Stars");
        const dateReviewedInput = screen.getByLabelText("Date Reviewed");
        const commentsInput = screen.getByLabelText("Comments");

        // expect all of above to be in the document
        expect(itemIdInput).toBeInTheDocument();
        expect(reviewerEmailInput).toBeInTheDocument();
        expect(starsInput).toBeInTheDocument();
        expect(dateReviewedInput).toBeInTheDocument();
        expect(commentsInput).toBeInTheDocument();

        fireEvent.change(itemIdInput, { target: { value: expectedMenuItemReview.itemId } });
        fireEvent.change(reviewerEmailInput, { target: { value: expectedMenuItemReview.reviewerEmail } });
        fireEvent.change(starsInput, { target: { value: expectedMenuItemReview.stars } });
        fireEvent.change(dateReviewedInput, { target: { value: expectedMenuItemReview.dateReviewed } });
        fireEvent.change(commentsInput, { target: { value: expectedMenuItemReview.comments } });

        const createButton = screen.getByText("Create");
        expect(createButton).toBeInTheDocument();
        fireEvent.click(createButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        // check params
        expect(axiosMock.history.post[0].params).toEqual(
            {
                "itemId": expectedMenuItemReview.itemId,
                "reviewerEmail": expectedMenuItemReview.reviewerEmail,
                "stars": expectedMenuItemReview.stars,
                "dateReviewed": expectedMenuItemReview.dateReviewed,
                "comments": expectedMenuItemReview.comments
            }
        );

        // check toast
        expect(mockToast).toHaveBeenCalledWith(`New MenuItemReview Created - id: ${expectedMenuItemReview.id} itemId: ${expectedMenuItemReview.itemId} reviewerEmail: ${expectedMenuItemReview.reviewerEmail} stars: ${expectedMenuItemReview.stars} dateReviewed: ${expectedMenuItemReview.dateReviewed} comments: ${expectedMenuItemReview.comments}`);

        // check navigation
        expect(mockNavigate).toBeCalledTimes(1);
        expect(mockNavigate).toBeCalledWith({ "to": "/menuitemreview" });
    });
});