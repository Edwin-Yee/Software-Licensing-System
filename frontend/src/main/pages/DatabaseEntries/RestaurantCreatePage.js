import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import RestaurantForm from "main/components/Restaurants/RestaurantForm";
import { Navigate } from 'react-router-dom'
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function DatabaseCreatePage({storybook=false}) {

  const objectToAxiosParams = (restaurant) => ({
    url: "/api/restaurants/post",
    method: "POST",
    params: {
      name: restaurant.name,
      email: restaurant.email, 
      department: restaurant.department, 
      licenseAllocated: restaurant.licenseAllocated,
      licensePurchaseDate: restaurant.licensePurchaseDate,
      licenseExpirationDate: restaurant.licenseExpirationDate
    }
  });

  const onSuccess = (database_entry) => {
    toast(`New Database Entry Created - id: ${database_entry.id} name: ${database_entry.name}`);
  }

  const mutation = useBackendMutation(
    objectToAxiosParams,
     { onSuccess }, 
     // Stryker disable next-line all : hard to set up test for caching
     ["/api/restaurants/all"] // mutation makes this key stale so that pages relying on it reload
     );

  const { isSuccess } = mutation

  const onSubmit = async (data) => {
    mutation.mutate(data);
  }

  if (isSuccess && !storybook) {
    return <Navigate to="/restaurants" />
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Create New Database Entry</h1>
        <RestaurantForm submitAction={onSubmit} />
      </div>
    </BasicLayout>
  )
}
