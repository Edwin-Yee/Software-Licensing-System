import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";
import MenuItemReviewTable from "main/components/MenuItemReview/MenuItemReviewTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockedNavigate
}));

describe("MenuItemReviewTable tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Item ID", "Reviewer Email", "Stars", "Date Reviewed", "Comments"];
    const expectedFields = ["itemId", "reviewerEmail", "stars", "dateReviewed", "comments"];
    const testIdPrefix = "MenuItemReviewTable-header";

    test("renders empty table correctly", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;

        // act
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <MenuItemReviewTable menuitemreviews={[]} currentUser={currentUser} />
            </MemoryRouter>
        </QueryClientProvider>
        );

            // assert
            expectedHeaders.forEach((header) => {
                expect(screen.getByText(header)).toBeInTheDocument();
            });
            expectedFields.forEach((field) => {
                expect(screen.getByTestId(`${testIdPrefix}-${field}`)).toBeInTheDocument();
            });

            expect(screen.getByText("Id")).toBeInTheDocument();
    });

    test("Has the expected column headers, content and buttons for admin user", () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
        // act
        render(
        <QueryClientProvider client={queryClient}>
            <MemoryRouter>
                <MenuItemReviewTable menuitemreviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
            </MemoryRouter>
        </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            expect(screen.getByTestId(`${testIdPrefix}-${field}`)).toBeInTheDocument();
        });

        for (let i = 0; i < 3; i++) {
            let fixture = menuItemReviewFixtures.threeMenuItemReviews[i];
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-itemId`)).toHaveTextContent(fixture.itemId);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-reviewerEmail`)).toHaveTextContent(fixture.reviewerEmail);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-stars`)).toHaveTextContent(fixture.stars);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-dateReviewed`)).toHaveTextContent(fixture.dateReviewed);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-comments`)).toHaveTextContent(fixture.comments);
        }

        const editButton = screen.getByTestId("MenuItemReviewTable-cell-row-0-col-Edit-button");
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.getByTestId("MenuItemReviewTable-cell-row-0-col-Delete-button");
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Has the expected column headers, content for ordinary user", () => {
        // arrange
        const currentUser = currentUserFixtures.userOnly;

        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuitemreviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        expectedHeaders.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            expect(screen.getByTestId(`${testIdPrefix}-${field}`)).toBeInTheDocument();
        });

        for (let i = 0; i < 3; i++) {
            let fixture = menuItemReviewFixtures.threeMenuItemReviews[i];
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-itemId`)).toHaveTextContent(fixture.itemId);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-reviewerEmail`)).toHaveTextContent(fixture.reviewerEmail);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-stars`)).toHaveTextContent(fixture.stars);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-dateReviewed`)).toHaveTextContent(fixture.dateReviewed);
            expect(screen.getByTestId(`MenuItemReviewTable-cell-row-${i}-col-comments`)).toHaveTextContent(fixture.comments);
        }

        expect(screen.queryByText("Delete")).not.toBeInTheDocument();
        expect(screen.queryByText("Edit")).not.toBeInTheDocument();
    });

    test("Edit button navigates to the edit page", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuitemreviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        // assert
        const editButton = screen.getByTestId(`MenuItemReviewTable-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(`/menuitemreview/edit/${menuItemReviewFixtures.threeMenuItemReviews[0].id}`));

    });

    test("Delete button calls delete callback", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminUser;
        // act
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <MenuItemReviewTable menuitemreviews={menuItemReviewFixtures.threeMenuItemReviews} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
        // assert
        const deleteButton = screen.getByTestId(`MenuItemReviewTable-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        fireEvent.click(deleteButton);
    });
});
