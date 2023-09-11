import React from 'react';
import DatabaseEntryForm from "main/components/DatabaseEntries/DatabaseEntryForm"
import { databaseEntryFixtures } from 'fixtures/databaseEntriesFixtures';

export default {
    title: 'components/DatabaseEntries/DatabaseEntryForm',
    component: DatabaseEntryForm
};

const Template = (args) => {
    return (
        <DatabaseEntryForm {...args} />
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
    initialContents: databaseEntryFixtures.oneDatabaseEntry[0],
    buttonLabel: "Update",
    submitAction: (data) => {
        console.log("Submit was clicked with data: ", data); 
        window.alert("Submit was clicked with data: " + JSON.stringify(data));
   }
};