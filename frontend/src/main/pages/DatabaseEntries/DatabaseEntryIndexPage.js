import React from 'react'
import { useBackend } from 'main/utils/useBackend';

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DatabaseEntryTable from 'main/components/DatabaseEntries/DatabaseEntryTable';
import { useCurrentUser , hasRole} from 'main/utils/currentUser'
import { Button } from 'react-bootstrap';

export default function DatabaseEntryIndexPage() {

    const currentUser = useCurrentUser();

    const { data: database_entries, error: _error, status: _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            ["/api/database_entries/all"],
            { method: "GET", url: "/api/database_entries/all" },
            // Stryker disable next-line all : don't test default value of empty list
            []
        );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/database_entries/create"
                    style={{ float: "right" }}
                >
                    Create Database Entry
                </Button>
            )
        } 
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Database Entries</h1>
                <DatabaseEntryTable database_entries={database_entries} currentUser={currentUser} />
            </div>
        </BasicLayout>
    );
}