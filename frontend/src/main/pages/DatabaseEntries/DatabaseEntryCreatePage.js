import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import DatabaseEntryForm from "main/components/DatabaseEntries/DatabaseEntryForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DatabaseCreatePage({storybook=false}) {

  const objectToAxiosParams = (database_entry) => ({
    url: "/api/database_entries/post",
    method: "POST",
    params: {
      name: database_entry.name,
      email: database_entry.email, 
      department: database_entry.department, 
      licenseAllocated: database_entry.licenseAllocated,
      licensePurchaseDate: database_entry.licensePurchaseDate,
      licenseExpirationDate: database_entry.licenseExpirationDate
    }
  });

  const onSuccess = (database_entry) => {
    toast(`New Database Entry Created - id: ${database_entry.id} name: ${database_entry.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/database_entries/all"] // mutation makes this key stale so that pages relying on it reload
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
        <h1>Create New Database Entry</h1>
        <DatabaseEntryForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
