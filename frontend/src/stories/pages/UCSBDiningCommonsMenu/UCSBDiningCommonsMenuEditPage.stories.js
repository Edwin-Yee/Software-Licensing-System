import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBDiningCommonsMenuEditPage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuEditPage";
import { ucsbDiningCommonsMenuFixtures } from 'fixtures/ucsbDiningCommonsMenuFixtures';

export default {
    title: 'pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuEditPage',
    component: UCSBDiningCommonsMenuEditPage
};

const Template = () => <UCSBDiningCommonsMenuEditPage storybook={true}/>;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdiningcommonsmenu', (_req, res, ctx) => {
            return res(ctx.json(ucsbDiningCommonsMenuFixtures.threeMenuItems[0]));
        }),
        rest.put('/api/ucsbdiningcommonsmenu', async (req, res, ctx) => {
            var reqBody = await req.text();
            window.alert("PUT: " + req.url + " and body: " + reqBody);
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}



