import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { ucsbDiningCommonsMenuFixtures } from "fixtures/ucsbDiningCommonsMenuFixtures";
import { rest } from "msw";

import UCSBDiningCommonsMenuIndexPage from "main/pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuIndexPage";

export default {
    title: 'pages/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuIndexPage',
    component: UCSBDiningCommonsMenuIndexPage
};

const Template = () => <UCSBDiningCommonsMenuIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdiningcommonsmenu/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdiningcommonsmenu/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbDiningCommonsMenuFixtures.threeMenuItems));
        }),
    ],
}

export const ThreeItemsAdminUser = Template.bind({});

ThreeItemsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res( ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/ucsbdiningcommonsmenu/all', (_req, res, ctx) => {
            return res(ctx.json(ucsbDiningCommonsMenuFixtures.threeMenuItems));
        }),
        rest.delete('/api/ucsbdiningcommonsmenu', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}
