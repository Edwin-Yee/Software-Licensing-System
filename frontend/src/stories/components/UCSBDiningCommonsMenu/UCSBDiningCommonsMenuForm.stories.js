import React from 'react';
import UCSBDiningCommonsMenuForm from "main/components/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuForm"
import { ucsbDiningCommonsMenuFixtures } from 'fixtures/ucsbDiningCommonsMenuFixtures';

export default {
    title: 'components/UCSBDiningCommonsMenu/UCSBDiningCommonsMenuForm',
    component: UCSBDiningCommonsMenuForm
};

const Template = (args) => {
    return (
        <UCSBDiningCommonsMenuForm {...args} />
    )
};

export const Create = Template.bind({});

Create.args = {
    buttonLabel: "Create",
    submitAction: (data) => {
         console.log("Submit was clicked with data: ", data); 
         window.alert("Submit was clicked with data: " + JSON.stringify(data));
    }
};

export const Update = Template.bind({});

Update.args = {
    initialContents: ucsbDiningCommonsMenuFixtures.oneMenuItem[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};