import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons";
import React from "react";
import "./homeUsers.css";

const HomeUsers = (props) => {
    return (
        <div className="mainContainer_homeUsers">
            {props.userIDs.map((userIDElement, keyIndex) => (
                <div className="userField_homeUsers" key={keyIndex}>
                    {props.activeUser === userIDElement.userID ? (
                        <div className="userInfo_homeUsers" style={{
                            border: "solid 2px green",
                        }}>
                            <span>{userIDElement.userName} ID:{userIDElement.userID}</span>
                        </div>
                    ) : (
                        <div onClick={() => props.selectActiveUser(userIDElement.userID)}
                             className="userInfo_homeUsers"
                             style={{
                                 border: "solid 2px transparent",
                             }}>
                            <span>{userIDElement.userName} ID:{userIDElement.userID}</span>
                        </div>
                    )}
                    <button className="deleteUser_homeUsers" onClick={() => props.deleteUser(userIDElement.userID)}>
                        <FontAwesomeIcon icon={faTrash}/>
                    </button>
                </div>
            ))}
        </div>
    )
}

export default HomeUsers;