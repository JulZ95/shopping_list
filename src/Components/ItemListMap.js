import "./ItemListMap.css";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faCircle} from "@fortawesome/free-solid-svg-icons";

const ItemListMap = (props) => {
    return (
        <div className="listItems_ItemListMap">
            {props.items.map((item, itemIndex) => (
                <div className="listItemContainer_ItemListMap" key={itemIndex}>
                    <div className="itemContainer_ItemListMap" onClick={() => {
                        if(props.subscribedUserID === null) {
                            props.toggleComplete(props.listIndex, itemIndex)
                        } else {
                            props.toggleSubbedListItem(props.listIndex, itemIndex, props.subscribedUserID);
                        }
                    }}>
                        {item.isSelected ? (
                            <div>
                                <button className="itemCompletedButton listItemButton_ItemListMap">
                                    <FontAwesomeIcon className="checkCircle_ItemListMap" icon={faCheckCircle}/>
                                </button>
                                <span className="completedItem_ItemListMap">{item.itemName}</span>
                            </div>
                        ) : (
                            <div>
                                <button className="itemCompletedButton listItemButton_ItemListMap">
                                    <FontAwesomeIcon className="checkCircle_ItemListMap" icon={faCircle}/>
                                </button>
                                <span>{item.itemName}</span>
                            </div>
                        )}
                    </div>
                    <div className="listItemQuantity_ItemListMap">{item.quantity} {item.itemMeasurement}</div>
                </div>
            ))}
        </div>
    )
}

export default ItemListMap;