import React from "react";
import { useNavigate } from "react-router-dom";
import "./Instructions.css"; // Import CSS file

function Instructions({ examData, setView, startTimer }) {
  const navigate = useNavigate();

  return (
    <div className="instructions-container">
      <ul className="instructions-list">
        <h1 className="instructions-title">Instructions</h1>
        <li>Exam must be completed in {examData.duration} seconds.</li>
        <li>Exam will be submitted automatically after {examData.duration} seconds.</li>
        <li>Once submitted, you cannot change your answers.</li>
        <li>Do not refresh the page.</li>
        <li>
          You can use the <span className="bold-text">"Previous"</span> and 
          <span className="bold-text">"Next"</span> buttons to navigate between questions.
        </li>
        <li>
          Total marks of the exam is <span className="bold-text">{examData.totalMarks}</span>.
        </li>
        <li>
          Passing marks of the exam is <span className="bold-text">{examData.passingMarks}</span>.
        </li>
      </ul>

      <div className="buttons-container">
        <button className="close-btn" onClick={() => navigate("/")}>
          CLOSE
        </button>
        <button
          className="start-btn"
          onClick={() => {
            startTimer();
            setView("questions");
          }}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
}

export default Instructions;
