import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const ToDoList = () => {
    const [inputValue, setInputValue] = useState("");
    const [toDos, setToDos] = useState([]);
    const [completedTodos, setCompletedTodos] = useState([]);
    const [hovered, setHover] = useState(-1);

    const handleKeyDown = (event) => {
        if (event.key === "Enter") {
            if (inputValue.trim() !== "") {
                setToDos([...toDos, { id: uuidv4(), label: inputValue, done: false }]);
                setInputValue("");
                sendTodo();
            } else {
                alert("Oops! You forgot to enter a task. Please try again.");
            }
        }
    };

    const handleDelete = (index) => {
        const deletedTodo = toDos[index];
        setCompletedTodos([...completedTodos, deletedTodo]);
        const updatedTodos = toDos.filter((_, i) => i !== index);
        setToDos(updatedTodos);
        deleteTodos(deletedTodo.id);
    };

    const handleCleanAll = () => {
        const filteredData = toDos.filter((todo) => todo.label !== "Sample Task");
        setToDos([]);
        setCompletedTodos([]);
        deleteAllTodos();
    };

    const activeTodoCount = toDos.filter((todo) => !todo.done).length;
    const taskCountMessage =
        toDos.length === 0
            ? "No tasks, add a task"
            : `${activeTodoCount} item${activeTodoCount !== 1 ? "s" : ""} left`;

    const postApi = () => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify([]);

        var requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/eunicehg", requestOptions)
            .then((response) => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const deleteTodos = (id) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify(toDos);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch("https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/eunicehg", requestOptions)
            .then((response) => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log("Error en deleteTodo" + error);
            });
    };

    const deleteAllTodos = () => {
        var requestOptions = {
            method: "DELETE",
        };

        fetch("https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/eunicehg", requestOptions)
            .then((response) => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                postApi();
            })
            .catch((error) => {
                console.log("Error en deleteAllTodo" + error);
            });
    };

    function getTodo() {
        var requestOptions = {
            method: "GET",
            redirect: "follow",
        };

        fetch("https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/eunicehg", requestOptions)
            .then((response) => {
                if (response.status == "400") {
                    postApi()
                } else
                    return response.json();
            })
            .then((data) => {
                console.log(data);
                setToDos(data);
            })
            .catch((error) => {
                console.log("Error en getTodo", error);
            });
    }

    const sendTodo = () => {
        if (toDos.length === 0) {
            console.log("No tasks to send. Please add at least one task.");
            return;
        }

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify([...toDos, { id: uuidv4(), label: inputValue, done: false }]);

        var requestOptions = {
            method: "PUT",
            headers: myHeaders,
            body: raw,
            redirect: "follow",
        };

        fetch(
            "https://fake-todo-list-52f9a4ed80ce.herokuapp.com/todos/user/eunicehg",
            requestOptions
        )
            .then((response) => {
                console.log(response.ok);
                console.log(response.status);
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log("Error en sentTodo", error);
            });
    };


    useEffect(() => {
        getTodo();
    }, []);

    return (
        <div className="bigContainer">
            <h1 className="title">To Do List</h1>
            <div className="listContainer">
                <div className="textLine row lineItem">
                    <div className="col">
                        <input
                            type="text"
                            placeholder="What needs to be done?"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="firstLine"
                        />
                    </div>
                </div>
                {toDos.map((todo, index) => (
                    <div
                        className={`textLine row lineItem ${hovered === index ? "active" : ""}`}
                        key={index}
                        onMouseEnter={() => setHover(index)}
                        onMouseLeave={() => setHover(-1)}
                    >
                        <div className="col">{todo.label}</div>
                        {hovered === index && (
                            <div className="deleteXmark col-auto">
                                <i className="fa-solid fa-xmark" onClick={() => handleDelete(index)}></i>
                            </div>
                        )}
                    </div>
                ))}
                <div className="deleteAll">
                    <div className="taskCount">{taskCountMessage}</div>
                    <button className="cleanButton" onClick={handleCleanAll}>
                        <i className="fa-solid fa-trash"></i>
                    </button>
                </div>
            </div>
            <span id="border1" className="placeholder placeholder-xs shadow"></span>
            <span id="border2" className="placeholder placeholder-xs shadow"></span>
        </div>
    );
};

export default ToDoList;