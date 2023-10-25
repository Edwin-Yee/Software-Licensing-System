import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "main/pages/HomePage";
import ProfilePage from "main/pages/ProfilePage";
import AdminUsersPage from "main/pages/AdminUsersPage";

import DatabaseEntryIndexPage from "main/pages/DatabaseEntries/DatabaseEntryIndexPage";
import DatabaseEntryCreatePage from "main/pages/DatabaseEntries/DatabaseEntryCreatePage";
import DatabaseEntryEditPage from "main/pages/DatabaseEntries/DatabaseEntryEditPage";

import { hasRole, useCurrentUser } from "main/utils/currentUser";

import "bootstrap/dist/css/bootstrap.css";

import { SoftwareLicensesPage } from "main/pages/SoftwareLicensesPage";
import { NotFoundPage } from "main/pages/NotFoundPage";
import { RequestingLoginPage } from "main/pages/RequestingLoginPage";
import { useState } from "react";
// import "./packages/react-router-dom/examples/Animation/styles.css";
// import { TransitionGroup, CSSTransition } from "react-transition-group";

import LoadingPage from "main/pages/LoadingPage"; // TO DO

function App() {
    const { data: currentUser } = useCurrentUser();
    
    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<HomePage />} />
                <Route exact path="/profile" element={<ProfilePage />} />

                {   
                    hasRole(currentUser, "ROLE_ADMIN") && <Route path="/software-licenses/:licenseID" element={<SoftwareLicensesPage /> } />
                }

                {
                    hasRole(currentUser, "ROLE_ADMIN") && <Route exact path="/admin/users" element={<AdminUsersPage />} />
                }
    
                {
                    hasRole(currentUser, "ROLE_USER") && <Route exact path="/database_entries" element={<DatabaseEntryIndexPage />} />
                }
                {
                    hasRole(currentUser, "ROLE_ADMIN") && (
                        <>
                            <Route exact path="/database_entries/edit/:id" element={<DatabaseEntryEditPage />} />
                            <Route exact path="/database_entries/create" element={<DatabaseEntryCreatePage />} />
                        </>
                    )
                }
              
                <Route path="/software-licenses/:licenseID" element={<RequestingLoginPage /> } />
                <Route path="/:error" element={<NotFoundPage /> } />

            </Routes>
        </Router>
    );
}

export default App;
