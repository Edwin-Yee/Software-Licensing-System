import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import UCSBDatesIndexPage from "main/pages/UCSBDates/UCSBDatesIndexPage";
import UCSBDatesCreatePage from "main/pages/UCSBDates/UCSBDatesCreatePage";
import UCSBDatesEditPage from "main/pages/UCSBDates/UCSBDatesEditPage";

import DatabaseEntryIndexPage from "main/pages/DatabaseEntries/DatabaseEntryIndexPage";
import DatabaseEntryCreatePage from "main/pages/DatabaseEntries/DatabaseEntryCreatePage";
import DatabaseEntryEditPage from "main/pages/DatabaseEntries/DatabaseEntryEditPage";

import PlaceholderIndexPage from "main/pages/Placeholder/PlaceholderIndexPage";
import PlaceholderCreatePage from "main/pages/Placeholder/PlaceholderCreatePage";
import PlaceholderEditPage from "main/pages/Placeholder/PlaceholderEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

import { SoftwareLicensesPage } from "main/pages/SoftwareLicensesPage";
import { NotFoundPage } from "main/pages/NotFoundPage";

function App() {
    const { data: currentUser } = useCurrentUser();

    return (
        <Router>
            <Routes>
                {/* <Navigate exact from = "/" to="/UCSB-Software-Licenses" /> */}
                {/* <Route exact path="/">
                    <Navigate exact  to="/UCSB-Software-Licenses" replace={true} />
                </Route> */}

                <Route exact path="/" element={<HomePage />} />
                
                {hasRole(currentUser, "ROLE_ADMIN") && (
                        <>
                            <Route path="/software-licenses/:licenseID" element={<SoftwareLicensesPage /> } />
                        </>
                    )
                }

                <Route exact path="/profile" element={<ProfilePage />} />
                {
                    hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
                }
                {
                    hasRole(currentUser, "ROLE_USER") && (
                        <>
                            <Route exact path="/ucsbdates" element={<UCSBDatesIndexPage />} />
                        </>
                    )
                }
                {
                    hasRole(currentUser, "ROLE_ADMIN") && (
                        <>
                            <Route exact path="/ucsbdates/edit/:id" element={<UCSBDatesEditPage />} />
                            <Route exact path="/ucsbdates/create" element={<UCSBDatesCreatePage />} />
                        </>
                    )
                }
                {
                    hasRole(currentUser, "ROLE_USER") && (
                        <>
                            <Route exact path="/database_entries" element={<DatabaseEntryIndexPage />} />
                        </>
                    )
                }
                {
                    hasRole(currentUser, "ROLE_ADMIN") && (
                        <>
                            <Route exact path="/database_entries/edit/:id" element={<DatabaseEntryEditPage />} />
                            <Route exact path="/database_entries/create" element={<DatabaseEntryCreatePage />} />
                        </>
                    )
                }
                {
                    hasRole(currentUser, "ROLE_USER") && (
                        <>
                            <Route exact path="/placeholder" element={<PlaceholderIndexPage />} />
                        </>
                    )
                }
                {
                    hasRole(currentUser, "ROLE_ADMIN") && (
                        <>
                            <Route exact path="/placeholder/edit/:id" element={<PlaceholderEditPage />} />
                            <Route exact path="/placeholder/create" element={<PlaceholderCreatePage />} />
                        </>
                    )
                }

                <Route path="/:error" element={<NotFoundPage /> } />

            </Routes>
        </Router>
    );
}

export default App;
