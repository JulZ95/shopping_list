import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckSquare, faSquare} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./SubscribeList.css";

const SubscribeList = (props) => {
    const subscribeList = (subscribedUserID, listName) => {
        const newUserIDs = [...props.userIDs];
        const activeUserIDIndex = newUserIDs.findIndex(element => element.userID === props.activeUser);
        if (newUserIDs[activeUserIDIndex].subscribedLists.findIndex(element => element.subscribedUser === subscribedUserID) !== -1) {
            const subscribedUserIDListIndex = newUserIDs[activeUserIDIndex].subscribedLists.findIndex(element => element.subscribedUser === subscribedUserID)
            // console.log(subscribedUserIDListIndex);
            newUserIDs[activeUserIDIndex].subscribedLists[subscribedUserIDListIndex].subscribedUserLists.push({subscribedListName: listName});
        } else {
            newUserIDs[activeUserIDIndex].subscribedLists.push({
                subscribedUser: subscribedUserID,
                subscribedUserLists: [{
                    subscribedListName: listName
                }]
            })
        }
        props.setUserIDs(newUserIDs);
    }

    const unSubscribeList = (subscribedUserID, listName) => {
        const newUserIDs = [...props.userIDs];
        const activeUserIDIndex = props.activeUser - 1;
        const subscribedUserIndex = newUserIDs[activeUserIDIndex].subscribedLists.findIndex(element => element.subscribedUser === subscribedUserID);
        newUserIDs[activeUserIDIndex].subscribedLists[subscribedUserIndex].subscribedUserLists.splice(
            newUserIDs[activeUserIDIndex].subscribedLists[subscribedUserIndex].subscribedUserLists.findIndex(element => element.subscribedListName === listName), 1
        );
        props.setUserIDs(newUserIDs);
    }

    const isSubscribed = (checkedUserID, listName) => {
        const subscribedListArray = props.userIDs[props.activeUser - 1].subscribedLists;
        const indexOfSubscribedUser = subscribedListArray.findIndex(element => element.subscribedUser === checkedUserID);
        if (indexOfSubscribedUser !== -1) {
            const subscribedUserListArray = subscribedListArray[indexOfSubscribedUser].subscribedUserLists;
            return subscribedUserListArray.findIndex(element => element.subscribedListName === listName) !== -1
        } else {
            return false;
        }
    }

    return (
        <div className="mainContainer_SubscribeList">
            <label className="subscribeListTitle_SubscribeList">{props.element.userName}</label>
            <div className="divider_SubscribeList"/>
            {(JSON.parse(localStorage.getItem(props.element.userID)))[0].lists.map((nestedElement, nestedIndex) => (
                <div className="subscribeListItems_SubscribeList" key={nestedIndex}>
                    <label className="subscribeListItemsLabel_SubscribeList">{nestedElement.listName} </label>
                    {isSubscribed(props.element.userID, nestedElement.listName) ? (
                        <FontAwesomeIcon className="checkListSub_SubscribeList" style={{cursor: "pointer"}}
                                         onClick={() => unSubscribeList(props.element.userID, nestedElement.listName)}
                                         icon={faCheckSquare}/>
                    ) : (
                        <FontAwesomeIcon className="checkListSub_SubscribeList" style={{cursor: "pointer"}}
                                         onClick={() => subscribeList(props.element.userID, nestedElement.listName)}
                                         icon={faSquare}/>
                    )}
                </div>
            ))}
        </div>
    )
}

export default SubscribeList;