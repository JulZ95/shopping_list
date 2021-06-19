import './App.css';
import React, {useEffect, useState} from "react";
import {HashRouter, NavLink, Route, useHistory} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {AppBar, makeStyles, Toolbar, Typography} from "@material-ui/core";
import {faDownload, faHammer, faHome, faSyncAlt} from "@fortawesome/free-solid-svg-icons";
import ShoppingList from "./Components/ShoppingList";
import ListCreator from "./Components/ListCreator";
import {saveAs} from "file-saver";

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
    },
    title: {
        flexGrow: 1,
    },
}));

const App = () => {
    const classes = useStyles();

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
                            <FontAwesomeIcon icon={faHome} style={{color: "white"}}/>
                        </NavLink>
                        <NavLink id="newListLink" className={classes.menuButton} to={"/listCreator/Neue+Liste"}>
                            <FontAwesomeIcon id="createNewList" icon={faHammer} style={{color: "white"}}/>
                        </NavLink>
                    </Toolbar>
                </AppBar>
            </div>
            <div className="routes" style={{
                height: "100vh",
                background: "linear-gradient(180deg, rgba(162,162,162,1) 0%, rgba(175,150,134,1) 60%, rgba(211,57,76,1) 100%)",
            }}>
                <Route exact path="/" component={ShoppingLists}/>
                <Route path="/listCreator/:name" component={ListCreatorView}/>
            </div>
        </HashRouter>
    );
}

const ShoppingLists = () => {
    const [listNames, setlistNames] = useState(
        JSON.parse(localStorage.getItem("ListNames"))
        ||
        [
            {listName: "Standart Liste"},
        ]
    );

    const [allItems, setAllItems] = useState(() => {
        // localStorage.
    })

    useEffect(() => {
        localStorage.setItem("ListNames", JSON.stringify(listNames));
    }, [listNames]);

    const handleDeleteList = (index, oldListName) => {
        const newListNames = [...listNames];
        newListNames.splice(index, 1);
        localStorage.removeItem(oldListName);
        setlistNames(newListNames);
    };

    const history = useHistory();
    const handleOpenListCreator = (listName) => {
        history.push("/listCreator/" + listName.replace(" ", "+"));
    }

    const getAllItems = () => {
        let items = "";
        const listNames = JSON.parse(localStorage.getItem("ListNames"));
        for (let i = 0; i < listNames.length; i++) {
            items = [...items, JSON.parse(localStorage.getItem(listNames[i].listName))]
        }
        return [listNames, items];
    }

    // const [dataJSON, setDataJSON] = useState([]);

    const readJSONFromInput = (event) => {
        let reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0])
    }

    const onReaderLoad = async (event) => {
        console.log(event.target.result);
        let obj = JSON.parse(event.target.result);
        validateJSONUpload(obj);
        // setDataJSON(obj);
        console.log(obj);
    }

    // useEffect(() => {
    //     console.log("Updated JSON Upload Variable");
    //     console.log(dataJSON);
    // }, [dataJSON]);

    const validateJSONUpload = (obj) => {
        const Ajv = require("ajv");
        const ajv = new Ajv({allErrors: true});
        const dataJSONblub = obj;

        const listNameSchema = {
            type: "object",
            properties: {
                listName: {type: "string"},
            },
            required: ["listName"],
            additionalProperties: false,
        };

        const validateListNames = ajv.compile(listNameSchema);

        if (dataJSONblub[0] === undefined) {
            console.log("JSON is undefined");
            return false;
        }

        for (const item of dataJSONblub[0]) {
            if (!validateListNames(item)) {
                console.log("ListName");
                console.log(item);
                console.log(ajv.errorsText(validateListNames.errors));
                return false;
            }
        }

        const itemSchema = {
            type: "object",
            properties: {
                itemName: {type: "string"},
                quantity: {type: "number"},
                itemMeasurement: {
                    type: "string",
                    enum: ["stk.", "pck.", "g"],
                },
                isSelected: {type: "boolean"},
            },
            required: ["itemName", "quantity", "itemMeasurement", "isSelected"],
            additionalProperties: false,
        };

        const validateItem = ajv.compile(itemSchema);

        if (dataJSONblub[1] === undefined) {
            return false;
        }

        for (const item of dataJSONblub[1]) {
            for (const nestedItem of item) {
                if (!validateItem(nestedItem)) {
                    console.log("Items");
                    console.log(nestedItem);
                    console.log(ajv.errorsText(validateItem.errors));
                    return false;
                }
            }
        }

        updateJSONDataInLocalStorage(dataJSONblub);

        return true;
    }

    const updateJSONDataInLocalStorage = (dataJSON) => {
        // console.log(dataJSON[0]);
        localStorage.setItem("ListNames", JSON.stringify(dataJSON[0]));
        setlistNames(dataJSON[0]);
        let index = 0;

        for (const dataJSONElement of dataJSON[1]) {
            // console.log(dataJSONElement);
            // console.log(dataJSON[0][index].listName);
            localStorage.setItem(dataJSON[0][index].listName, JSON.stringify(dataJSONElement));
            index++;
        }
    }

    return (
        <div className="mainContainer">
            <div className="nav">
                <label className="fileDownload" onClick={() => {
                    console.log("Download List JSON File...");
                    var blob = new Blob([JSON.stringify(getAllItems())], {type: "application/json"});
                    saveAs(blob, "listInfo.json");
                }}>
                    <FontAwesomeIcon icon={faDownload}/>
                    <span> Listen Downloaden</span>
                </label>
                <input name="fileInput" id="file-1" className="fileUploadInput" onChange={(event) => {
                    readJSONFromInput(event);
                    // console.log("Ist das JSON valide? " + validateJSONUpload(event));
                    console.log("Upload and Synchronize Lists");
                    // console.log(dataJSON);
                    // validateJSONUpload();
                }} type={"file"} accept={"application/json"} multiple={false}
                />
                <label className="fileUploadLabel" htmlFor="file-1">
                    <FontAwesomeIcon id="syncIcon" icon={faSyncAlt}/>
                    <span> Listen Synchronisieren</span>
                </label>
            </div>

            <div className="main">
                {listNames.map((list, index) => (
                    <div key={index} className="shopping-lists-container">
                        <ShoppingList name={list.listName}
                                      deleteFunction={handleDeleteList}
                                      handleOpenListCreator={handleOpenListCreator}
                                      index={index}/>
                    </div>
                ))}
            </div>
        </div>
    )
}

const ListCreatorView = () => {
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
                <ListCreator checkListName={checkListName}/>
            </div>
        </div>
    )
}

export default App;
