import './App.css';
import React, {useEffect, useState} from "react";
import {HashRouter, NavLink, Route, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppBar, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {faDownload, faHammer, faHome, faList, faPlus, faSyncAlt, faTrash} from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./Components/ShoppingList";
import ListCreator from "./Components/ListCreator";
import {saveAs} from "file-saver";
import HomeUsers from "./Components/homeUsers";

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
        if (tmpUserIDs === undefined) {
            return [
                {
                    userID: 1,
                    userName: "Julian"
                }
            ]
        } else {
            return tmpUserIDs;
        }
    })

    // const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        localStorage.setItem("userIDs", JSON.stringify(userIDs));
        // setUserCount(userIDs.length);
    }, [userIDs]);

    const addNewUser = (userName) => {
        if (userName !== "") {
            let newID = 1;
            while (searchFreeID(newID)) {
                newID++;
            }
            const newUserObj = {
                userID: newID,
                userName: userName
            }
            const newUserIDs = [...userIDs, newUserObj];
            setUserIDs(newUserIDs);
        }
    }

    const deleteUser = (id) => {
        const newUserIDs = [...userIDs];
        newUserIDs.splice(newUserIDs.findIndex(element => element.userID === id), 1);
        setUserIDs(newUserIDs);
    }

    const searchFreeID = (newID) => {
        return userIDs.some(element => element.userID === newID);
    }

    const [activeUser, setActiveUser] = useState(1);
    const selectActiveUser = (userID) => {
        setActiveUser(userID);
    }

    console.log(activeUser);

    return (
        <HashRouter>
            <div className={classes.root}>
                <AppBar position="static" className={classes.appBar}>
                    <Toolbar>
                        <Typography className={classes.title} varaint={"h2"} style={{cursor: "default"}}>
                            <span>Einkaufsliste für </span>
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
                        </NavLink>
                        <NavLink id="newListLink" className={classes.menuButton}
                                 to={"/listCreator/" + activeUser + "/Neue+Liste"}>
                            <FontAwesomeIcon id="createNewList" icon={faHammer}/>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes" style={{
                height: "100vh",
                background: "linear-gradient(180deg, rgba(162,162,162,1) 0%, rgba(175,150,134,1) 60%, rgba(211,57,76,1) 100%)",
            }}>
                {/*<Route path="/"/>*/}
                <Route exact path="/" render={(props) => (
                    <HomeView {...props} userIDs={userIDs} setUserIDs={setUserIDs}
                              activeUser={activeUser} addNewUser={addNewUser} deleteUser={deleteUser}
                              selectActiveUser={selectActiveUser}/>
                )}/>
                <Route path="/listView/:userID" render={(props) => (
                    <ShoppingLists {...props} userID={activeUser} userIDs={userIDs}/>
                )}/>
                <Route path="/listCreator/:userID/:listName" render={(props) => (
                    <ListCreatorView {...props} userID={activeUser}/>
                )}/>
            </div>
        </HashRouter>
    );
}

const ShoppingLists = (props) => {
    const [listData, setListData] = useState(() => {
        const tmpListData = JSON.parse(localStorage.getItem(props.userID))
        if (tmpListData !== null) {
            return tmpListData;
        }
        return [
            {
                userName: props.userIDs[props.userIDs.findIndex(element => element.userID === props.userID)].userName,
                lists: [
                    {
                        listName: "Default Liste 1",
                        items: []
                    }
                ]
            }
        ]
    });

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

    // const [listNames, setListNames] = useState(() => {
    //     // const tmpListNames = initialListNameState;
    //     // if(tmpListNames !== null) {
    //     //     console.log("Loaded Storage");
    //     //     return tmpListNames;
    //     // } else {
    //     //     console.log("Storage Empty");
    //     //     return [{listName: "Standart Liste"},]
    //     // }
    //     return 0;
    // });
    // const [itemArray, setItemArray] = useState(() => {
    //     // let tmpListNames = initialListNameState;
    //     // if(tmpListNames === null) {
    //     //     tmpListNames = [
    //     //         {listName: "Standart Liste"},
    //     //     ]
    //     // } else {
    //     //     console.log("ListNames are Not null");
    //     // }
    //     // let allItemsData = [];
    //     // for (const name of tmpListNames) {
    //     //     if(JSON.parse(localStorage.getItem(name.listName)) !== null) {
    //     //         console.log("Loaded Item");
    //     //         allItemsData = [...allItemsData, JSON.parse(localStorage.getItem(name.listName))];
    //     //     } else {
    //     //         console.log("ListItems are Null!")
    //     //         allItemsData = [...allItemsData, [{
    //     //             itemName: "Erdbeere", quantity: 2, itemMeasurement: "pck.", isSelected: false,
    //     //         }]]
    //     //     }
    //     // }
    //     // return allItemsData;
    //     return 0;
    // });

    // useEffect(() => {
    //     const tmpListNames = JSON.parse(localStorage.getItem("ListNames"));
    //     setListNames(tmpListNames);
    // }, [])

    // useEffect(() => {
    //     // localStorage.setItem("ListNames", JSON.stringify(listNames));
    //     // console.log(listNames);
    //     // console.log("Updated ListNames");
    //
    //     // for (const listName of listNames) {
    //     //     console.log(listName.listName);
    //     //     let allItemsData = [];
    //     //     for (const name of listNames) {
    //     //         allItemsData = [...allItemsData, JSON.parse(localStorage.getItem(name.listName))];
    //     //         console.log(allItemsData);
    //     //     }
    //     // }
    //
    //     // setItemArray(() => {
    //     //     let allItemsData = [];
    //     //     for (const name of listNames) {
    //     //         allItemsData = [...allItemsData, JSON.parse(localStorage.getItem(name.listName))];
    //     //         // console.log(allItemsData);
    //     //     }
    //     //     return allItemsData;
    //     // })
    //
    // }, [listNames]);

    // useEffect(() => {
    //     // const tmpListNames = JSON.parse(localStorage.getItem("ListNames"));
    //     // console.log("Attempt to update itemArray");
    //     // let index = 0;
    //     // for (const tmpElement of itemArray) {
    //     //     if(tmpElement !== null) {
    //     //         console.log("itemArray is Not Null");
    //     //         localStorage.setItem(tmpListNames[index].listName, JSON.stringify(tmpElement));
    //     //     } else {
    //     //         console.log("itemArray is Null");
    //     //         localStorage.setItem(tmpListNames[index].listName, JSON.stringify([{
    //     //             itemName: "Erdbeere", quantity: 2, itemMeasurement: "pck.", isSelected: false,
    //     //         }]));
    //     //     }
    //     //     index++
    //     // }
    // }, [itemArray])


    // const getAllItems = () => {
    //     let items = "";
    //     const listNames = JSON.parse(localStorage.getItem("ListNames"));
    //     for (let i = 0; i < listNames.length; i++) {
    //         items = [...items, JSON.parse(localStorage.getItem(listNames[i].listName))]
    //     }
    //     return [listNames, items];
    // }

    // const [dataJSON, setDataJSON] = useState([]);

    const readJSONFromInput = (event) => {
        let reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0])
    }

    const onReaderLoad = (event) => {
        // console.log(event.target.result);
        try {
            const obj = JSON.parse(event.target.result);
            if (validateJSONUpload(obj)) {
                updateListData(obj);
            }
            // console.log(obj);
        } catch (e) {
            console.log("The data needs to have one array that contains one and only one JSON Object in it! -> Check your loaded data it seems to be malformed :^)");
            console.log(e);
        }
    }

    // useEffect(() => {
    //     console.log("Updated JSON Upload Variable");
    //     console.log(dataJSON);
    // }, [dataJSON]);

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
                    <span> Listen Downloaden</span>
                </label>
                <input name="fileInput" id="file-1" className="fileUploadInput" onChange={(event) => {
                    console.log("Trying to Upload and Synchronize Lists");
                    readJSONFromInput(event);
                }} type={"file"} accept={"application/json"} multiple={false}
                />
                <label className="fileUploadLabel" htmlFor="file-1">
                    <FontAwesomeIcon id="syncIcon" icon={faSyncAlt}/>
                    <span> Listen Synchronisieren</span>
                </label>
                <label className="newListLabel" onClick={() => handleOpenListCreator("Neue Liste")}>
                    <FontAwesomeIcon id="hammerIcon" icon={faHammer}/>
                    <span> Neue Liste</span>
                </label>
            </div>

            <div className="main">
                {listData[0].lists.map((list, listIndex) => (
                    <div key={listIndex} className="shopping-lists-container">
                        <ShoppingList listName={list.listName}
                                      items={list.items}
                                      deleteFunction={handleDeleteList}
                                      handleOpenListCreator={handleOpenListCreator}
                                      listIndex={listIndex}
                                      toggleComplete={toggleComplete}
                        />
                    </div>
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
                <div>
                    <input value={newUserInputField} onChange={event => setNewUserInputField(event.target.value)}
                           placeholder="Neuer User..."/>
                    <button onClick={() => props.addNewUser(newUserInputField)}>
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

const ListCreatorView = (props) => {
    const checkListName = (listName) => {
        return "Neue Liste" === listName;
    }

    // useEffect(() => {
    //     let value = JSON.parse(localStorage.getItem("ListNames"));
    //     const newEntry = {listName: "Neue Liste"};
    //     value = [...value, newEntry];
    //     localStorage.setItem("ListNames", JSON.stringify(value));
    // })

    return (
        <div className="mainContainer">
            <div className="main">
                <ListCreator {...props} checkListName={checkListName}/>
            </div>
        </div>
    )
}

export default App;
