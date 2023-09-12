import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import DatabaseEntryForm from 'main/components/DatabaseEntries/DatabaseEntryForm';
import { Navigate } from 'react-router-dom'
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DatabaseEntryEditPage({storybook=false}) {
    let { id } = useParams();

    const { data: database_entry, _error, _status } =
        useBackend(
            // Stryker disable next-line all : don't test internal caching of React Query
            [`/api/database_entries?id=${id}`],
            {  // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
                method: "GET",
                url: `/api/database_entries`,
                params: {
                    id
                }
            }
        );

    const objectToAxiosPutParams = (database_entry) => ({
        url: "/api/database_entries",
        method: "PUT",
        params: {
            id: database_entry.id,
        },
        data: {
            name: database_entry.name,
            email: database_entry.email, 
            department: database_entry.department,
            licenseAllocated: database_entry.licenseAllocated,
            licensePurchaseDate: database_entry.licensePurchaseDate,
            licenseExpirationDate: database_entry.licenseExpirationDate,
        }
    });

    const onSuccess = (database_entry) => {
        toast(`Database Entry Updated - id: ${database_entry.id} name: ${database_entry.name}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/database_entries?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/database_entries" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Database Entry</h1>
                {
                    database_entry && <DatabaseEntryForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={database_entry} />
                }
            </div>
        </BasicLayout>
    )

}