import React from 'react';
import './style/Products.css';

export default function Product(props) {
    const {product} = props;
    return (
        <div className="products">
            <div className="col">
                <div className="card">
                    <img className="medium" src={product.image} alt={product.name}></img>
                    <div>{product.name} (${product.price})</div>
                    {/* <div>
                        <button>Purchase Software</button>
                    </div> */}
                    
                </div>
            </div>
        </div>
    )
}
