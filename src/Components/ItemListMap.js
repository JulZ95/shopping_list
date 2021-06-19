import "./ItemListMap.css";
import React from "react";
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
                                    <FontAwesomeIcon className="checkCircle_ItemListMap" icon={faCheckCircle}/>
                                </button>
                                <span className="completedItem">{item.itemName}</span>
                            </div>
                        ) : (
                            <div>
                                <button className="itemCompletedButton listItemButton">
                                    <FontAwesomeIcon className="checkCircle_ItemListMap" icon={faCircle}/>
                                </button>
                                <span>{item.itemName}</span>
                            </div>
                        )}
                    </div>
                    <div className="listItemQuantity">{item.quantity} {item.itemMeasurement}</div>
                </div>
            ))}
        </div>
    )
}

export default ItemListMap;