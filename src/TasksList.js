import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const TasksList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filterCompleted, setFilterCompleted] = useState(false);
  const [filterIncomplete, setFilterIncomplete] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskTitle, setEditedTaskTitle] = useState("");
  const [newTaskError, setNewTaskError] = useState("");

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users/1/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const addTask = () => {
    if (newTask.trim().length > 5) {
      const newTodo = {
        id: todos.length + 1,
        title: newTask,
        completed: false,
      };
      setTodos([newTodo, ...todos]);
      setNewTask("");
      setNewTaskError("");
    } else {
      setNewTaskError("Task should be greater than 5 characters and not empty");
    }
  };

  const toggleTaskStatus = (id) => {
    if (id === editingTaskId) {
      return;
    }

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditingTask = (id, title) => {
    setEditingTaskId(id);
    setEditedTaskTitle(title);
  };

  const cancelEditingTask = () => {
    setEditingTaskId(null);
    setEditedTaskTitle("");
  };

  const saveEditedTask = (id) => {
    if (editedTaskTitle.trim().length > 5) {
      setTodos(
        todos.map((todo) =>
          todo.id === id ? { ...todo, title: editedTaskTitle } : todo
        )
      );
      setEditingTaskId(null);
      setEditedTaskTitle("");
    } else {
      setNewTaskError("Task should be greater than 5 characters and not empty");
    }
  };

  const deleteTask = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1>To Do App</h1>
      <div className="mb-3">
        <input
          className="form-control"
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={addTask}>
          Add Task
        </button>
        {newTaskError && <p className="text-danger mt-2">{newTaskError}</p>}
      </div>

      <div className="mb-3">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="checkbox"
            checked={filterCompleted}
            onChange={() => setFilterCompleted(!filterCompleted)}
          />
          Show Completed Tasks
        </label>
      </div>

      <div className="mb-3">
        <label className="form-check-label">
          <input
            className="form-check-input"
            type="checkbox"
            checked={filterIncomplete}
            onChange={() => setFilterIncomplete(!filterIncomplete)}
          />
          Show Incomplete Tasks
        </label>
      </div>

      <table
        className="table table-bordered"
        style={{ borderRadius: "10px", border: "3px solid red" }}
      >
        <thead>
          <tr>
            <th style={{ width: "40%" }}>Task</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos
            .filter(
              (todo) =>
                (!filterCompleted && !filterIncomplete) ||
                (filterCompleted && todo.completed) ||
                (filterIncomplete && !todo.completed)
            )
            .map((todo) => (
              <tr key={todo.id}>
                <td
                  style={{
                    width: "40%",
                    backgroundColor: todo.completed ? "green" : "red",
                    textDecoration:
                      todo.completed && editingTaskId !== todo.id
                        ? "line-through"
                        : "none",
                    border: "2px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                  onClick={() => toggleTaskStatus(todo.id)}
                >
                  {editingTaskId === todo.id ? (
                    <>
                      <input
                        className="form-control"
                        type="text"
                        value={editedTaskTitle}
                        onChange={(e) => setEditedTaskTitle(e.target.value)}
                      />
                      {editedTaskTitle.trim().length === 0 && (
                        <p className="text-primary mt-2">
                          Task should not be empty!
                        </p>
                      )}
                      {editedTaskTitle.trim().length > 0 &&
                        editedTaskTitle.trim().length <= 5 && (
                          <p className="text-primary mt-2">
                            Task should be greater than 5 characters!
                          </p>
                        )}
                    </>
                  ) : (
                    todo.title
                  )}
                </td>
                <td
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  {todo.completed ? "Completed" : "Incomplete"}
                </td>
                <td
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    padding: "12px",
                  }}
                >
                  {editingTaskId === todo.id ? (
                    <>
                      <button
                        className="btn btn-success"
                        onClick={() => saveEditedTask(todo.id)}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary ms-2"
                        onClick={cancelEditingTask}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-warning"
                      onClick={() => startEditingTask(todo.id, todo.title)}
                    >
                      Edit
                    </button>
                  )}
                  <button
                    className="btn btn-danger ms-2"
                    onClick={() => deleteTask(todo.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default TasksList;
