import React, { useState } from 'react'
import './style/SearchBar3.css'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import {FaSearch} from "react-icons/fa"

function SearchBar({ placeholder, data }) {
    if (placeholder == null) {
        placeholder = "Type to search..."
    }

    const [filteredData, setFilteredData] = useState([]);
    const [wordEntered, setWordEntered] = useState("");

    const handleFilter = (event) => {
        const searchWord = event.target.value
        setWordEntered(searchWord);
        const newFilter = data.filter((value) => {
            return value.name.toLowerCase().includes(searchWord.toLowerCase());
        });

        if (searchWord === "") {
            setFilteredData([])
        }else{
            setFilteredData(newFilter); 
        }
    };

    const clearInput = () => {
        setFilteredData([]);
        setWordEntered("");

    }
    return(
        <div className = "search">
            <div className = "input-wrapper">
                <FaSearch id = "search-icon"></FaSearch>
                <div className = "input">
                    <input type="text" placeholder={placeholder} value = {wordEntered} onChange={handleFilter}></input>
                </div>
            </div>

            <div className = "searchResult">
                {filteredData.length !== 0 && (
                    <div className="dataResult">
                        {filteredData.slice(0, 15).map((value, key) => {
                            return (
                                <a className="dataItem" href={value.link}>
                                    <p>{value.name}</p>
                                </a>
                            );
                        })}    
                    </div>
                )}


                {/* <div className="search">
                    <div className="searchInputs">
                        <input type="text" placeholder={placeholder} value = {wordEntered} onChange={handleFilter}></input>
                        <div className="searchIcon">
                            {wordEntered.length === 0 ? (<SearchIcon/>)
                            : (<CloseIcon id="clearBtn" onClick={clearInput}/>)}
                        </div>
                    </div>
                    {filteredData.length !== 0 && (
                        <div className="dataResult">
                            {filteredData.slice(0, 15).map((value, key) => {
                                return (
                                    <a className="dataItem" href={value.link}>
                                        <p>{value.name}</p>
                                    </a>
                                );
                            })}    
                        </div>
                    )}
        
                </div> */}
            </div>
        </div>


    );
}

export default SearchBar;