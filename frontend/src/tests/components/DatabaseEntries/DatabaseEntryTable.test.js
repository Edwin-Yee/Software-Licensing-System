import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { databaseEntriesFixtures } from "fixtures/databaseEntriesFixtures";
import DatabaseEntryTable from "main/components/DatabaseEntries/DatabaseEntryTable";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

// const databaseEntriesFixtures = {
//   oneDatabaseEntry:
//   [
//     {
//       "id": 1,
//       "name": "Starfish",
//       "email": "starfish@ucsb.edu",
//       "department": "engineering",
//       "licenseAllocated": "Adobe Creative Cloud",
//       "licensePurchaseDate": "2023-09-21T15:31:00",
//       "licenseExpirationDate": "2024-09-21T15:31:00",
//     }
//   ],

//   threeDatabaseEntries:
//   [
//       {
//           "id": 2,
//           "name": "Octopus",
//           "email": "octopus@ucsb.edu",
//           "department": "dance",
//           "licenseAllocated": "Adobe Acrobat",
//           "licensePurchaseDate": "2023-10-21T15:31:00",
//           "licenseExpirationDate": "2024-11-21T15:31:00",
//       },

//       {
//           "id": 3,
//           "name": "Sea Anemone",
//           "email": "sea_anemone@ucsb.edu",
//           "department": "art",
//           "licenseAllocated": "Adobe Creative Cloud",
//           "licensePurchaseDate": "2023-09-22T15:31:00",
//           "licenseExpirationDate": "2024-09-23T15:31:00",
//       },

//       {
//           "id": 4,
//           "name": "Lobster",
//           "email": "lobster@ucsb.edu",
//           "department": "engineering",
//           "licenseAllocated": "Adobe Acrobat",
//           "licensePurchaseDate": "2017-09-21T15:31:00",
//           "licenseExpirationDate": "2027-09-21T15:31:00",
//       },
//   ]
// };


const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate
}));

describe("DatabaseEntryTable tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = ["id", "Name", "Email", "Department", "License Allocated", "License Purchase Date", "License Expiration Date"];
  const expectedFields = ["id", "name", "email", 'department', "licenseAllocated", "licensePurchaseDate", "licenseExpirationDate"];
  const testId = "DatabaseEntryTable";

  test("renders empty table correctly", () => {
    
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DatabaseEntryTable database_entries={[]} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const fieldElement = screen.queryByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(fieldElement).not.toBeInTheDocument();
    });
  });

  test("Has the expected column headers, content and buttons for admin user", () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DatabaseEntryTable database_entries={databaseEntriesFixtures.threeDatabaseEntries} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Octopus");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Sea Anemone");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();
    expect(editButton).toHaveClass("btn-primary");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
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
          <DatabaseEntryTable database_entries={databaseEntriesFixtures.threeDatabaseEntries} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert
    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expectedFields.forEach((field) => {
      const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Octopus");

    expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("3");
    expect(screen.getByTestId(`${testId}-cell-row-1-col-name`)).toHaveTextContent("Sea Anemone");

    expect(screen.queryByText("Delete")).not.toBeInTheDocument();
    expect(screen.queryByText("Edit")).not.toBeInTheDocument();
  });


  test("Edit button navigates to the edit page", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DatabaseEntryTable database_entries={databaseEntriesFixtures.threeDatabaseEntries} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Octopus");

    const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
    expect(editButton).toBeInTheDocument();

    // act - click the edit button
    fireEvent.click(editButton);

    // assert - check that the navigate function was called with the expected path
    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/database_entries/edit/2'));

  });

  test("Delete button calls delete callback", async () => {
    // arrange
    const currentUser = currentUserFixtures.adminUser;

    // act - render the component
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <DatabaseEntryTable database_entries={databaseEntriesFixtures.threeDatabaseEntries} currentUser={currentUser} />
        </MemoryRouter>
      </QueryClientProvider>
    );

    // assert - check that the expected content is rendered
    expect(await screen.findByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("2");
    expect(screen.getByTestId(`${testId}-cell-row-0-col-name`)).toHaveTextContent("Octopus");

    const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
    expect(deleteButton).toBeInTheDocument();

    // act - click the delete button
    fireEvent.click(deleteButton);
  });
});
