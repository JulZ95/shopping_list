import "./ItemListMap.css";
import React, {useState, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faCircle} from "@fortawesome/free-solid-svg-icons";

const ItemListMap = (props) => {
    return (
        <div className="listItems">
            {props.items.map((item, index) => (
                <div className="listItemContainer_ItemListMap" key={index}>
                    <div className="itemContainer" onClick={() => props.toggleComplete(index)}>
                        {item.isSelected ? (
                            <div>
                                <button className="itemCompletedButton listItemButton">
                                    <FontAwesomeIcon icon={faCheckCircle}/>
                                </button>
                                <span className="completedItem">{item.itemName}</span>
                            </div>
                        ) : (
                            <div>
                                <button className="itemCompletedButton listItemButton">
                                    <FontAwesomeIcon icon={faCircle}/>
                                </button>
                                <span>{item.itemName}</span>
                            </div>
                        )}
                    </div>

                    {/*<button className="listItemIncreaseQuantityButton listItemButton"*/}
                    {/*        aria-label="" aria-controls="" aria-haspopup="false"*/}
                    {/*        onClick={() => handleIncreaseQuantity(index)}>*/}
                    {/*    <FontAwesomeIcon icon={faChevronUp}/>*/}
                    {/*</button>*/}

                    <div className="listItemQuantity">{item.quantity} {item.itemMeasurement}</div>

                    {/*<button className="listItemDecreaseQuantityButton listItemButton"*/}
                    {/*        aria-label="" aria-controls="" aria-haspopup="false"*/}
                    {/*        onClick={() => handleDecreaseQuantity(index)}>*/}
                    {/*    <FontAwesomeIcon icon={faChevronDown}/>*/}
                    {/*</button>*/}

                    {/*<button className="listItemDeleteItemButton listItemButton"*/}
                    {/*        aria-label="" aria-controls="" aria-haspopup="false"*/}
                    {/*        onClick={() => handleDeleteItem(index)}>*/}
                    {/*    <FontAwesomeIcon icon={faTrash}/>*/}
                    {/*</button>*/}
                    {/*<div className="divider3"/>*/}
                </div>
            ))}
        </div>
    )
}

export default ItemListMap;