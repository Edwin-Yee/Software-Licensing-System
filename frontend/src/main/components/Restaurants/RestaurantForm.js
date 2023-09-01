import { Button, Form } from 'react-bootstrap';
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom';

function RestaurantForm({ initialContents, submitAction, buttonLabel = "Create" }) {

    
    // Stryker disable all
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm(
        { defaultValues: initialContents || {}, }
    );
    // Stryker restore all
   
    const navigate = useNavigate();

    // Stryker disable next-line Regex
    const isodate_regex = /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d)|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d)/i;

    // Stryker disable next-line all
    const yyyyq_regex = /((19)|(20))\d{2}[1-4]/i; // Accepts from 1900-2099 followed by 1-4.  Close enough.


    const testIdPrefix = "RestaurantForm";

    return (
        <Form onSubmit={handleSubmit(submitAction)}>

            {initialContents && (
                <Form.Group className="mb-3" >
                    <Form.Label htmlFor="id">Id</Form.Label>
                    <Form.Control
                        data-testid={testIdPrefix + "-id"}
                        id="id"
                        type="text"
                        {...register("id")}
                        value={initialContents.id}
                        disabled
                    />
                </Form.Group>
            )}

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="name">Name</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-name"}
                    id="name"
                    type="text"
                    isInvalid={Boolean(errors.name)}
                    {...register("name", {
                        required: "Name is required.",
                        maxLength : {
                            value: 30,
                            message: "Max length 30 characters"
                        }
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.name?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="email">Email</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-email"}
                    id="email"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("email", {
                        required: "Email is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.email?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="department">Department</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-department"}
                    id="department"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("department", {
                        required: "Department is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.department?.message}
                </Form.Control.Feedback>
            </Form.Group>
                    
            <Form.Group className="mb-3" >
                <Form.Label htmlFor="licenseAllocated">License Allocated</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-licenseAllocated"}
                    id="licenseAllocated"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("licenseAllocated", {
                        required: "License Allocated is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.licenseAllocated?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="licensePurchaseDate">License Purchase Date</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-licensePurchaseDate"}
                    id="licensePurchaseDate"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("licensePurchaseDate", {
                        required: "License Purchase Date is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.licensePurchaseDate?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" >
                <Form.Label htmlFor="licenseExpirationDate">License Expiration Date</Form.Label>
                <Form.Control
                    data-testid={testIdPrefix + "-licenseExpirationDate"}
                    id="licenseExpirationDate"
                    type="text"
                    isInvalid={Boolean(errors.email)}
                    {...register("licenseExpirationDate", {
                        required: "License Expiration Date is required."
                    })}
                />
                <Form.Control.Feedback type="invalid">
                    {errors.licenseExpirationDate?.message}
                </Form.Control.Feedback>
            </Form.Group>

            <Button
                type="submit"
                data-testid={testIdPrefix + "-submit"}
            >
                {buttonLabel}
            </Button>
            <Button
                variant="Secondary"
                onClick={() => navigate(-1)}
                data-testid={testIdPrefix + "-cancel"}
            >
                Cancel
            </Button>

        </Form>

    )
}

export default RestaurantForm;