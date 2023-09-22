// import { useState } from "react"
// import { Route, useLocation, Link } from "react-router-dom";
import { useParams } from 'react-router-dom';
// import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import data from "data";
import './style/software_licensing_page.css';
import { hasRole, useCurrentUser } from "main/utils/currentUser";
import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';

export const SoftwareLicensesPage = () => {
    const { data: currentUser } = useCurrentUser();

    const params = useParams();
    const { products } = data; 
    const current_product = products[params.licenseID-1]

    const bodyElement = document.querySelector('body');

    bodyElement.style.backgroundColor = 'lightblue';

    return(
        <BasicLayout>
            <div className = "product-page">
                <div className = "product-container">
                    <img
                        className = "product-image"
                        src = { current_product.image }
                        alt = { current_product.name }
                    />
                </div>
                
                <div className = "product-header">
                    <h2>{current_product.name}</h2>
                    <p>${current_product.price}</p>
                </div>

                <div className = "columns">
                    <div className = "left-column">
                        <p> {current_product.detailed_description} </p>
                    </div>

                    <div className = "right-column">
                        <div className = "approvalForm">
                            <form id="approvalForm">
                                <label for="fullName">Full Name:</label>
                                <input type="text" 
                                    className="gray-background"
                                    id ="fullName" 
                                    name="fullName" 
                                    value={currentUser.root.user.fullName} 
                                    readOnly={true} 
                                    required> 
                                </input>

                                <label for="email">UCSB Email:</label>
                                <input type="text" 
                                    className="gray-background"
                                    id="email" 
                                    name="email" 
                                    value={currentUser.root.user.email}
                                    readOnly={true}
                                    required>
                                </input>

                                <label for="department">Associated Department:</label>
                                <input type="text" id="department" name="department" required></input>
                                
                                <label for="licenseRequested">License Requested:</label>
                                <input type="text" 
                                    className="gray-background"
                                    id="numLicensesRequested" 
                                    name="numLicensesRequested" 
                                    value={current_product.name}
                                    readOnly={true}
                                    required>
                                </input>

                                <label for="numLicensesRequested">Amount of Licenses Requested:</label>
                                <input type="text" id="numLicensesRequested" name="numLicensesRequested" required></input>


                                <label for="fileUpload">Upload Paid Invoice [Optional] (PDF):</label>
                                <input type="file" id="fileUpload" name="fileUpload" accept=".pdf"></input>

                                <button type="submit">Submit for Approval</button>
                            </form>
                        </div>

                        {/* <script>
                            const form = document.getElementById("approvalForm");

                            form.addEventListener('submit', function(event) {
                                event.preventDefault();

                                const fullName = document.getElementById('fullName').value;
                                const email = document.getElementById('email').value;
                                const department = document.getElementById('department').value;

                                // You can process the form data here
                                console.log('Full Name:', fullName);
                                console.log('Email:', email);
                                console.log('Department:', department);

                                // Reset the form after submission (optional)
                                form.reset();
                            });
                        </script> */}
                    </div>
                </div>
                
            </div>
        </BasicLayout>
        
    );
}
