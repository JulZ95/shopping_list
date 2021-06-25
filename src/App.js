import './App.css';
import React, {useEffect, useState} from "react";
import {HashRouter, NavLink, Route, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppBar, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {
    faClipboardList,
    faDownload,
    faHammer,
    faHome,
    faList,
    faPlus,
    faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./Components/ShoppingList";
import ListCreator from "./Components/ListCreator";
import {saveAs} from "file-saver";
import HomeUsers from "./Components/homeUsers";
import SubscribeList from "./Components/SubscribeList";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        background: "#d3394c",
    },
    menuButton: {
        marginRight: theme.spacing(2),
        padding: 5,
        color: "white"
    },
    title: {
        flexGrow: 1,
    },
}));

const App = () => {
    const classes = useStyles();

    const [userIDs, setUserIDs] = useState(() => {
        const tmpUserIDs = JSON.parse(localStorage.getItem("userIDs"));
        if (tmpUserIDs === null) {
            return [
                {
                    userID: 1,
                    userName: "Julian",
                    subscribedLists: []
                }
            ]
        } else {
            return tmpUserIDs;
        }
    })

    useEffect(() => {
        localStorage.setItem("userIDs", JSON.stringify(userIDs));
    }, [userIDs]);

    const addNewUser = (userName) => {
        if (userName !== "") {
            let newID = 1;
            while (searchFreeID(newID)) {
                newID++;
            }
            const newUserObj = {
                userID: newID,
                userName: userName,
                subscribedLists: []
            }
            const newUserIDs = [...userIDs, newUserObj];
            setUserIDs(newUserIDs.sort((a, b) => {
                return a.userID - b.userID;
            }));
            localStorage.setItem(newID, JSON.stringify([{
                userName: userName,
                lists: [
                    {
                        listName: "Default Liste 1",
                        items: []
                    }
                ]
            }]))
        }
    }

    const deleteUser = (id) => {
        const newUserIDs = [...userIDs];
        newUserIDs.splice(newUserIDs.findIndex(element => element.userID === id), 1);
        // console.log(removeSubbedUserLists(newUserIDs, id));
        setUserIDs(removeSubbedUserLists(newUserIDs, id));
        localStorage.removeItem(id);
    }

    const removeSubbedUserLists = (newUsersIDs, id) => {
        const tmpArray = [...newUsersIDs];
        // console.log(tmpArray);

        for (const newUsersIDElement of tmpArray) {
            newUsersIDElement.subscribedLists = newUsersIDElement.subscribedLists.filter(element => {
                return element.subscribedUser !== id;
            })
        }
        return tmpArray;
    }

    const searchFreeID = (newID) => {
        return userIDs.some(element => element.userID === newID);
    }

    const [activeUser, setActiveUser] = useState(1);
    const selectActiveUser = (userID) => {
        setActiveUser(userID);
    }

    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography className={classes.title} varaint={"h2"} style={{cursor: "default"}}>
                            <span>Einkaufslisten für </span>
                            <a id="linkToUnsere-Kochrezepte" href="https://unsere-kochrezepte.de/#/">
                                <i>Unsere Kochrezepte</i>
                            </a>
                        </Typography>
                        <NavLink id="homeLink" className={classes.menuButton} exact to={"/"}>
                            <FontAwesomeIcon icon={faHome}/>
                            <span className="toolTipText">Home</span>
                        </NavLink>
                        <NavLink id="listViewLink" className={classes.menuButton} to={"/listView/" + activeUser}>
                            <FontAwesomeIcon icon={faList}/>
                            <span className="toolTipText" style={{}}>Listen</span>
                        </NavLink>
                        <NavLink id="subscribeToList" style={{width: "15px", textAlign: "center"}} className={classes.menuButton}
                                 to={"/subscribeListView/" + activeUser}>
                            <FontAwesomeIcon icon={faClipboardList}/>
                            <span className="toolTipText" style={{}}>Abo</span>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes" style={{
                height: "100%",
                background: "linear-gradient(180deg, rgba(162,162,162,1) 0%, rgba(175,150,134,1) 60%, rgba(211,57,76,1) 100%)",
            }}>
                <Route exact path="/" render={(props) => (
                    <HomeView {...props} userIDs={userIDs} setUserIDs={setUserIDs}
                              activeUser={activeUser} addNewUser={addNewUser} deleteUser={deleteUser}
                              selectActiveUser={selectActiveUser}/>
                )}/>
                <Route path="/listView/:userID" render={(props) => (
                    <ListView {...props} userID={activeUser} userIDs={userIDs}/>
                )}/>
                <Route path="/listCreator/:userID/:listName" render={(props) => (
                    <ListCreatorView {...props} userID={activeUser}/>
                )}/>
                <Route path="/subscribeListView/:userID" render={(props) => (
                    <SubscribeListView {...props} activeUser={activeUser} userIDs={userIDs} setUserIDs={setUserIDs}/>
                )}/>
            </div>
        </HashRouter>
    );
}

const ListView = (props) => {
    const [listData, setListData] = useState(() => {
        const tmpListData = JSON.parse(localStorage.getItem(props.userID))
        if (tmpListData !== null) {
            return tmpListData;
        }
        return [
            {
                userName: props.userIDs[props.userIDs.findIndex(element => element.userID === props.userID)].userName,
                lists: [
                ]
            }
        ]
    });

    const userIDArray = [];
    const initializeSubscribedLists = () => {
        const tmpArray = [...props.userIDs[props.userIDs.findIndex(element => element.userID === props.userID)].subscribedLists];
        const tmpArray2 = [];
        for (const tmpArrayElement of tmpArray) {
            if(tmpArrayElement.subscribedUserLists.length > 0) {
                const tmpJSONData = JSON.parse(localStorage.getItem(tmpArrayElement.subscribedUser));
                for (const tmpArrayElementElement of tmpArrayElement.subscribedUserLists) {
                    userIDArray[userIDArray.length] = tmpArrayElement.subscribedUser;
                    tmpArray2.push(tmpJSONData[0].lists[tmpJSONData[0].lists.findIndex(element => element.listName === tmpArrayElementElement.subscribedListName)])
                }
            }
        }
        return tmpArray2;
    }

    const [subscribedLists, setSubscribedLists] = useState(initializeSubscribedLists());
    const toggleSubbedListItem = (listIndex, itemIndex, subbedUserID) => {
        const tmpData = [...subscribedLists];
        tmpData[listIndex].items[itemIndex].isSelected = !tmpData[listIndex].items[itemIndex].isSelected;
        setSubscribedLists(tmpData);

        if(subbedUserID !== 0) {
            const tmpArrayData = [...(JSON.parse(localStorage.getItem(subbedUserID + "")))];
            for (const tmpDataElement of tmpArrayData[0].lists) {
                if(tmpDataElement.listName === subscribedLists[listIndex].listName) {
                    tmpDataElement.items = subscribedLists[listIndex].items;
                    localStorage.setItem(subbedUserID, JSON.stringify(tmpArrayData));
                }
            }
        }
    }

    useEffect(() => {
    }, [subscribedLists])

    useEffect(() => {
        localStorage.setItem(props.userID, JSON.stringify(listData));
    }, [listData, props.userID]);

    const toggleComplete = (listIndex, itemIndex) => {
        const newListData = [...listData];
        newListData[0].lists[listIndex].items[itemIndex].isSelected = !newListData[0].lists[listIndex].items[itemIndex].isSelected;
        setListData(newListData);
    };

    const handleDeleteList = (index) => {
        // eslint-disable-next-line no-restricted-globals
        if (confirm("Liste wirklich Löschen?")) {
            const newListData = [...listData];
            newListData[0].lists.splice(index, 1);
            setListData(newListData);
        }
    };

    const history = useHistory();
    const handleOpenListCreator = (listName) => {
        history.push("/listCreator/" + props.userID + "/" + listName.replaceAll(" ", "+"));
    }

    const readJSONFromInput = (event) => {
        let reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0])
    }

    const onReaderLoad = (event) => {
        try {
            const obj = JSON.parse(event.target.result);
            if (validateJSONUpload(obj)) {
                updateListData(obj);
            }
        } catch (e) {
            console.log("The data needs to have one array that contains one and only one JSON Object in it! -> Check your loaded data it seems to be malformed :^)");
            console.log(e);
        }
    }

    const validateJSONUpload = (obj) => {
        const Ajv = require("ajv");
        const ajv = new Ajv({allErrors: true});
        const jsonData = obj;

        const listDataSchema = {
            type: "array",
            items: [
                {
                    type: "object",
                    properties: {
                        userName: {
                            type: "string"
                        },
                        lists: {
                            type: "array",
                            items: [
                                {
                                    type: "object",
                                    properties: {
                                        listName: {
                                            type: "string"
                                        },
                                        items: {
                                            type: "array",
                                            items: [
                                                {
                                                    type: "object",
                                                    properties: {
                                                        itemName: {
                                                            type: "string"
                                                        },
                                                        quantity: {
                                                            type: "integer"
                                                        },
                                                        itemMeasurement: {
                                                            type: "string",
                                                            enum: ["pck.", "stk.", "g"]
                                                        },
                                                        isSelected: {
                                                            type: "boolean"
                                                        }
                                                    },
                                                    required: ["itemName", "quantity", "itemMeasurement", "isSelected"],
                                                    additionalItems: true,
                                                    additionalProperties: false
                                                }
                                            ]
                                        }
                                    },
                                    required: ["listName", "items"],
                                    additionalItems: true,
                                    additionalProperties: false
                                }
                            ]
                        }
                    },
                    required: ["userName", "lists"],
                    additionalProperties: false,
                    additionalItems: false
                }
            ],
            additionalItems: false,
            additionalProperties: false,
        }

        if (jsonData === undefined || jsonData.length === 0) {
            console.log("JSON is undefined or empty");
            return false;
        }
        const validateListNames = ajv.compile(listDataSchema);
        if (validateListNames(jsonData)) {
            return true;
        } else {
            console.log("Invalid JSON Format");
            console.log(ajv.errorsText(validateListNames.errors));
            return false;
        }
    }

    const updateListData = (jsonData) => {
        const newListData = [...listData];
        for (const dataJSONElement of jsonData[0].lists) {
            const index = newListData[0].lists.findIndex(item => item.listName === dataJSONElement.listName);
            if (index !== -1) {
                newListData[0].lists[index].items = dataJSONElement.items;
            } else {
                newListData[0].lists = [...newListData[0].lists, dataJSONElement]
            }
        }
        console.log("Update Successful!");
        setListData(newListData);
    }

    return (
        <div className="mainContainer">
            <div className="nav">
                <div style={{width: "100%", margin: "5px 0 10px 0"}}>
                    <label className="userGreeting">Willkommen: {listData[0].userName}</label>
                </div>
                <label className="fileDownload" onClick={() => {
                    console.log("Download List JSON File...");
                    let blob = new Blob([JSON.stringify(listData)], {type: "application/json"});
                    saveAs(blob, "User_" + props.userID + "=lists.json");
                }}>
                    <FontAwesomeIcon icon={faDownload}/>
                    <span> Downloaden</span>
                </label>
                <input name="fileInput" id="file-1" className="fileUploadInput" onChange={(event) => {
                    console.log("Trying to Upload and Synchronize Lists");
                    readJSONFromInput(event);
                }} type={"file"} accept={"application/json"} multiple={false}
                />
                <label className="fileUploadLabel" htmlFor="file-1">
                    <FontAwesomeIcon id="syncIcon" icon={faSyncAlt}/>
                    <span> Listen Sync.</span>
                </label>
                <label className="newListLabel" onClick={() => handleOpenListCreator("Neue Liste")}>
                    <FontAwesomeIcon id="hammerIcon" icon={faHammer}/>
                    <span> Neue Liste</span>
                </label>
            </div>

            <div className="main">
                {listData[0].lists.map((list, listIndex) => (
                    <div key={listIndex}>
                        <ShoppingList listName={list.listName} items={list.items}
                                      deleteFunction={handleDeleteList} handleOpenListCreator={handleOpenListCreator}
                                      listIndex={listIndex} toggleComplete={toggleComplete} subscribedList={false}
                                      subscribedUserID={null} toggleSubbedListItem={null}
                        />
                    </div>
                ))}
                <div style={{width: "100%"}}/>
                <div style={{width: "100%", border: "solid 4px white", borderRadius: "4px"}}/>
                {subscribedLists.map((list, listIndex) => (
                    list !== undefined ? (
                        <div key={listIndex}>
                            <ShoppingList listName={list.listName} items={list.items}
                                          deleteFunction={handleDeleteList} handleOpenListCreator={handleOpenListCreator}
                                          listIndex={listIndex} toggleComplete={toggleComplete} subscribedList={true}
                                          subscribedUserID={userIDArray[listIndex]} toggleSubbedListItem={toggleSubbedListItem}
                            />
                        </div>
                        ) : (
                            <div key={listIndex}/>
                        )
                ))}
            </div>
        </div>
    )
}

const HomeView = (props) => {
    const [newUserInputField, setNewUserInputField] = useState("");

    return (
        <div className="mainContainer">
            <div className="nav">
                <div className="newUserAddField">
                    <input value={newUserInputField} onChange={event => setNewUserInputField(event.target.value)}
                           placeholder="Neuer User..."/>
                    <button className="newUserAddButton" onClick={() => {
                        props.addNewUser(newUserInputField);
                        setNewUserInputField("");
                    }}>
                        <FontAwesomeIcon icon={faPlus}/>
                    </button>
                </div>
            </div>
            <div className="main">
                <HomeUsers {...props}/>
            </div>
        </div>
    )
}

const SubscribeListView = (props) => {
    return (
        <div className="mainContainer">
            <div className="main">
                <div style={{width: "100%", margin: "5px 0 10px 0", display: "flex", justifyContent: "center", fontWeight: "520"}}>
                    <label className="userGreeting">Willkommen: {props.userIDs[props.userIDs.findIndex(element => element.userID === props.activeUser)].userName}</label>
                </div>
                {props.userIDs.filter(element => element.userID !== props.activeUser).map((element, index) => (
                    <SubscribeList {...props} element={element} key={index}/>
                ))}
            </div>
        </div>
    )
}

const ListCreatorView = (props) => {
    const checkListName = (listName) => {
        return "Neue Liste" === listName;
    }
    return (
        <div className="mainContainer">
            <div className="main">
                <ListCreator {...props} checkListName={checkListName}/>
            </div>
        </div>
    )
}

export default App;