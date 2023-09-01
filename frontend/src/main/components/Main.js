import React from 'react';
import Product from './Product';

export default function Main(props){
    const {products} = props; 

    return(
        <main className="block col-3">
            <h2>Products</h2>
            <div className="row">
                {products.map((product) => (
                    <Product key={product.id} product={product}></Product>
                ))}
            </div>
        </main>
    )
}