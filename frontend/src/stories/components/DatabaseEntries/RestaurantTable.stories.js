import React from 'react';
import DatabaseEntryTable from 'main/components/DatabaseEntries/DatabaseEntryTable';
import { databaseEntryFixtures } from 'fixtures/databaseEntriesFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/DatabaseEntries/DatabaseEntryTable',
    component: DatabaseEntryTable
};

const Template = (args) => {
    return (
        <DatabaseEntryTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    database_entries: []
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
    database_entries: databaseEntryFixtures.threeDatabaseEntries,
    currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
    database_entries: databaseEntryFixtures.threeDatabaseEntries,
    currentUser: currentUserFixtures.adminUser,
}

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.delete('/api/database_entries', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
