import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { rest } from "msw";

import UCSBDiningCommonsMenuCreatePage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuCreatePage"

export default {
    title: 'pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuCreatePage',
    component: UCSBDiningCommonsMenuCreatePage
};

const Template = () => <UCSBDiningCommonsMenuCreatePage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.post('/api/ucsbdiningcommonsmenu/post', (req, res, ctx) => {
            window.alert("POST: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
}



