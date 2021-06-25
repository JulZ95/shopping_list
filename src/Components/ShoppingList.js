import "./ShoppingList.css";
import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrash} from "@fortawesome/free-solid-svg-icons";
import ItemListMap from "./ItemListMap";

const ShoppingList = (props) => {
    const [finishedItemCount, setFinishedItemCount] = useState(0);

    //UseEffect for every Rerender
    useEffect(() => {
        calcFinishedItems();
    });

    const calcFinishedItems = () => {
        let itemsFinished = 0;
        if(props.items !== null) {
            for (let i = 0; i < props.items.length; i++) {
                if (props.items[i].isSelected) {
                    itemsFinished++;
                }
            }
            setFinishedItemCount(itemsFinished);
        }
    }

    return (
        <div>
            {props.items !== null ? (
                <div className="listContainer_ShoppingList">
                    <span className="listHeaderTitle_ShoppingList">{props.listName}</span>
                    <button className="button_ShoppingList editListButton_ShoppingList" disabled={props.subscribedList}
                            style={props.subscribedList ? {pointerEvents: "none", color: "gray"} : {}} onClick={() => {
                                props.handleOpenListCreator(props.listName);
                            }}>
                        <FontAwesomeIcon icon={faPen}/>
                    </button>

                    <button className="button_ShoppingList deleteListButton_ShoppingList" disabled={props.subscribedList}
                            style={props.subscribedList ? {pointerEvents: "none", color: "gray"} : {}} onClick={() => {
                        props.deleteFunction(props.listIndex, props.listName);
                    }}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>

                    <div className="divider1_ShoppingList"/>

                    <ItemListMap toggleComplete={props.toggleComplete} items={props.items}
                                 listIndex={props.listIndex} subscribedUserID={props.subscribedUserID}
                                 toggleSubbedListItem={props.toggleSubbedListItem}/>

                    <div className="divider2_ShoppingList"/>

                    <label className="listTotalQuantity_ShoppingList">
                        Fortschritt: {finishedItemCount} / {props.items.length}
                    </label>
                    {props.items.length > 0 ? (
                        <div className="progressBar_ShoppingList">
                            <progress value={(100 / props.items.length) * finishedItemCount}
                                      max="100"/>
                        </div>
                    ) : (
                        <div className="progressBar_ShoppingList"/>
                    )}
                    <span>{props.subscribedUserID !== null ? "ID: " + props.subscribedUserID : ""}</span>
                </div>
            ) : (
                <span/>
            )}
        </div>
    )
}

export default ShoppingList;