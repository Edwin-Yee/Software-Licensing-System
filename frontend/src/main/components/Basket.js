import React from 'react';

export default function Basket(props){
    const {cartItems} = props;

    return(
        <aside className="block col-1">
            <h2>Cart Items</h2>
            {/* <div>{cartItems.length === 0 && <div>Cart Is Empty</div>}</div> */}
        </aside>
    );
}