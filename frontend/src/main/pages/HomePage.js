import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import Main from "main/components/Main";
import Basket from "main/components/Basket";
import data from 'data';
import { useState } from "react";
import adobe_acrobat from "../../images/adobe_acrobat.png";
import adobe_creative_cloud from "../../images/adobe_creative_cloud.png";
import { BrowserRouter as Router } from "react-router-dom";
import { Link } from "react-router-dom";
import { GiShoppingCart } from "react-icons/gi"
import "../components/style/main.css"
import SearchBar from "main/components/SearchBar";

export default function HomePage() {

  const { products } = data; 
  
  const [cartItems, setCartItems] = useState([]);
  // const onAdd = (product) => {
  //   const exist = cartItems.find(x => x.i)
  // }
  const [change, setChange] = useState(true)

  return (
    <BasicLayout>
      {/* <div className="pt-2"> */}
        <div className="App">
          <div className='header'>
            <h1>Software Products</h1>
            
            <div className="search">
              <SearchBar data = {products} ></SearchBar>
              {/* <SearchBar placeholder="Enter Software Name..." data = {products}></SearchBar> */}
            </div>
            
            <div className="products">
              {products.map((product) => (
                <div 
                  className = "product"
                  key={product.id}>
                  <img 
                    className="product-image"
                      src={
                        product.image
                      } 
                      alt={
                        product.image
                      }
                  />
                  <h4 className="product-name">
                    {product.name}
                  </h4>
                  <p>
                    {
                      product.description
                    }
                  </p>
                  <span className="product-price">
                    ${product.price}
                  </span>

                  <div className="buttons">
                    <button className="btn">
                      <li><Link to = {product.link}> See Details / Purchase</Link></li>
                    </button>


                  </div>
                </div>
              ))}
            </div>


            {/* <button class="btn" onclick="one()">1</button
            
            
            >
            <button class="btn active" onclick="two()">2</button>
            <button class="btn" onclick="four()">4</button> */}
          </div>

{/*     
          <div className="row">
            <div className = "column">
              <Main products = {products}></Main> 
            </div> 
          </div> */}
        </div>
          {/* <h1>Hello, world!</h1>
          <p>
            This is a webapp containing a bunch of different Spring Boot/React examples.
          </p> */}
      {/* </div> */}
    </BasicLayout>
  )
}