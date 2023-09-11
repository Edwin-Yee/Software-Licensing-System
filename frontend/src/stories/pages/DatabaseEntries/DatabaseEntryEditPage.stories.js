import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import DatabaseEntryEditPage from "main/pages/DatabaseEntries/DatabaseEntryEditPage";
import { databaseEntryFixtures } from 'fixtures/databaseEntriesFixtures';

export default {
    title: 'pages/DatabaseEntries/DatabaseEntryEditPage',
    component: DatabaseEntryEditPage
};

const Template = () => <DatabaseEntryEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/database_entries', (_req, res, ctx) => {
            return res(ctx.json(databaseEntryFixtures.threeDatabaseEntries[0]));
        }),
        rest.put('/api/database_entries', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



