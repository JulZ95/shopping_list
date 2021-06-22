import "./ItemListMap.css";
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faCircle} from "@fortawesome/free-solid-svg-icons";

const ItemListMap = (props) => {
    // useEffect(() => {
    //     console.log("Should Rerender: ItemListMap");
    // }, [props.toggleComplete])

    return (
        <div className="listItems">
            {props.items.map((item, itemIndex) => (
                <div className="listItemContainer_ItemListMap" key={itemIndex}>
                    <div className="itemContainer" onClick={() => props.toggleComplete(props.listIndex, itemIndex)}>
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