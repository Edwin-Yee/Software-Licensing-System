import { render, waitFor, fireEvent, screen } from "@testing-library/react";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import { BrowserRouter as Router } from "react-router-dom";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewForm tests", () => {

    const expectedHeaders = ["Item ID", "Reviewer Email", "Stars", "Date Reviewed", "Comments", "Create"]
    const testIdPrefix = "MenuItemReviewForm";

    test("renders correctly", async () => {
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );

        expectedHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    test("renders correctly when passing in a MenuItemReview", async () => {
        render(
            <Router  >
                <MenuItemReviewForm initialContents={menuItemReviewFixtures.oneMenuItemReview} />
            </Router>
        );
        await screen.findByTestId(`${testIdPrefix}-id`);
        expect(screen.getByText((`Id`))).toBeInTheDocument();
    });

    test("Correct Error messsages on missing input", async () => {
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-submit");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.click(submitButton);

        await screen.findByText(/Item ID is required./);
        expect(screen.getByText(/Reviewer Email is required./)).toBeInTheDocument();
        expect(screen.getByText(/Stars is required./)).toBeInTheDocument();
        expect(screen.getByText(/Comments is required./)).toBeInTheDocument();
        expect(screen.getByText(/Date Reviewed is required./)).toBeInTheDocument();
    });

    test("No Error messsages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <Router  >
                <MenuItemReviewForm submitAction={mockSubmitAction} />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-itemId");

        const itemIdField = screen.getByTestId("MenuItemReviewForm-itemId");
        const reviewerEmailField = screen.getByTestId("MenuItemReviewForm-reviewerEmail");
        const starsField = screen.getByTestId("MenuItemReviewForm-stars");
        const dateReviewedField = screen.getByTestId("MenuItemReviewForm-dateReviewed");
        const commentsField = screen.getByTestId("MenuItemReviewForm-comments");
        const submitButton = screen.getByTestId("MenuItemReviewForm-submit");

        fireEvent.change(itemIdField, { target: { value: '1' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test@ucsb.edu' } });
        fireEvent.change(starsField, { target: { value: '5' } });
        fireEvent.change(dateReviewedField, { target: { value: '2021-08-06T21:31' } });
        fireEvent.change(commentsField, { target: { value: 'test comment' } });
        fireEvent.click(submitButton);

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Item ID must be an integer/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Reviewer Email must be a valid email address/)).not.toBeInTheDocument();
        // expect(screen.queryByText(/Date Reviewed must be a valid date/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Stars must be an integer between 1 and 5/)).not.toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );
        await screen.findByTestId("MenuItemReviewForm-cancel");
        const cancelButton = screen.getByTestId("MenuItemReviewForm-cancel");

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("Collect Error messages on bad input", async () => {
        render(
            <Router  >
                <MenuItemReviewForm />
            </Router>
        );

        const itemIdField = screen.getByTestId(testIdPrefix + "-itemId");
        const reviewerEmailField = screen.getByTestId(testIdPrefix + "-reviewerEmail");
        const starsField = screen.getByTestId(testIdPrefix + "-stars");
        const dateReviewedField = screen.getByTestId(testIdPrefix + "-dateReviewed");
        const commentsField = screen.getByTestId(testIdPrefix + "-comments");
        const submitButton = screen.getByTestId(testIdPrefix + "-submit");

        fireEvent.change(itemIdField, { target: { value: 'a' } });
        fireEvent.change(reviewerEmailField, { target: { value: 'test' } });
        fireEvent.change(starsField, { target: { value: '6' } });
        fireEvent.change(dateReviewedField, { target: { value: 'bad-input' } });
        fireEvent.change(commentsField, { target: { value: 'good-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Item ID must be an integer/);
        expect(screen.getByText(/Reviewer Email must be a valid email address/)).toBeInTheDocument();
        expect(screen.getByText(/Stars must be an integer between 1 and 5/)).toBeInTheDocument();
        // expect(screen.queryByText(/Date Reviewed must be a valid date/)).not.toBeInTheDocument();

    });
});