import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";

import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/databaseEntryUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";

export default function DatabaseEntryTable({
    database_entries,
    currentUser,
    testIdPrefix = "DatabaseEntryTable" }) {
    
    // Group entries by department, ChatGPT
    const groupedData = database_entries.reduce((result, entry) => {
        const department = entry.department;
        if (!result[department]) {
            result[department] = [];
        }

        if (entry.licensePurchaseDate.length > 10){
            // Remove the datetime from the table for licensePurchaseDate
            entry.licensePurchaseDate = (entry.licensePurchaseDate).slice(0,-9);
        }

        if (entry.licenseExpirationDate.length > 10){
            // Remove the datetime from the table for licenseExpirationDate
            entry.licenseExpirationDate = (entry.licenseExpirationDate).slice(0,-9);
        }

        result[department].push(entry);
        return result;
        }, {});
    
    // Sort and group names alphabetically within each department, ChatGPT
    Object.values(groupedData).forEach((entriesInDepartment) => {
        entriesInDepartment.sort((a, b) => a.name.localeCompare(b.name));
    });

    // Create an array of department headers and associated entries, ChatGPT
    const departmentHeaders = Object.entries(groupedData).map(([department, entriesInDepartment]) => ({
        department,
        entries: entriesInDepartment,
    }));
        
    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/database_entries/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/database_entries/all"]
    );
    // Stryker restore all 

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }

    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },

        {
            Header: 'Name',
            accessor: 'name',
        },
        {
            Header: 'Email',
            accessor: 'email',
        },
        {
            Header: 'Department',
            accessor: 'department',
        },
        {
            Header: 'License Allocated',
            accessor: 'licenseAllocated',
        },
        {
            Header: 'License Purchase Date',
            accessor: 'licensePurchaseDate',
        },
        {
            Header: 'License Expiration Date',
            accessor: 'licenseExpirationDate',
        },
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, testIdPrefix));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, testIdPrefix));
    } 

    // Return header and OurTable, ChatGPT
    return (
        <div>
            {departmentHeaders.map(({ department, entries }) => (
            <div key={department}>
                <h2>{department} Department</h2>
                
                <OurTable columns={columns} data={entries} testid={testIdPrefix} />
            </div>
            ))}
        </div>
    );
};

