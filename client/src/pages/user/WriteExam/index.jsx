import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getExamById } from "../../../apicalls/exams";
import { addReport } from "../../../apicalls/reports";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import Instructions from "./Instructions";
import "./index.css"

function WriteExam() {
  const [examData, setExamData] = React.useState(null);
  const [questions = [], setQuestions] = React.useState([]);
  const [selectedQuestionIndex, setSelectedQuestionIndex] = React.useState(0);
  const [selectedOptions, setSelectedOptions] = React.useState({});
  const [result = {}, setResult] = React.useState({});
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [view, setView] = useState("instructions");
  const [secondsLeft = 0, setSecondsLeft] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const { user } = useSelector((state) => state.users);
  const getExamData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getExamById({
        examId: params.id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setQuestions(response.data.questions);
        setExamData(response.data);
        setSecondsLeft(response.data.duration);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const calculateResult = async () => {
    try {
      let correctAnswers = [];
      let wrongAnswers = [];

      questions.forEach((question, index) => {
        if (question.correctOption === selectedOptions[index]) {
          correctAnswers.push(question);
        } else {
          wrongAnswers.push(question);
        }
      });

      let verdict = "Pass";
      if (correctAnswers.length < examData.passingMarks) {
        verdict = "Fail";
      }

      const tempResult = {
        correctAnswers,
        wrongAnswers,
        verdict,
      };
      setResult(tempResult);
      dispatch(ShowLoading());
      const response = await addReport({
        exam: params.id,
        result: tempResult,
        user: user._id,
      });
      dispatch(HideLoading());
      if (response.success) {
        setView("result");
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  const startTimer = () => {
    let totalSeconds = examData.duration;
    const intervalId = setInterval(() => {
      if (totalSeconds > 0) {
        totalSeconds = totalSeconds - 1;
        setSecondsLeft(totalSeconds);
      } else {
        setTimeUp(true);
      }
    }, 1000);
    setIntervalId(intervalId);
  };

  useEffect(() => {
    if (timeUp && view === "questions") {
      clearInterval(intervalId);
      calculateResult();
    }
  }, [timeUp]);

  useEffect(() => {
    if (params.id) {
      getExamData();
    }
  }, []);
  return (
    examData && (
      <div className="mt-2">
        <div className="divider"></div>
        <h1 className="text-center">{examData.name}</h1>
        <div className="divider"></div>

        {view === "instructions" && (
          <Instructions
            examData={examData}
            setView={setView}
            startTimer={startTimer}
          />
        )}

        {view === "questions" && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-2xl">
                {selectedQuestionIndex + 1} :{" "}
                {questions[selectedQuestionIndex].name}
              </h1>

              <div className="timer">
                <span className="text-2xl">{secondsLeft}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {Object.keys(questions[selectedQuestionIndex].options).map(
                (option, index) => {
                  return (
                    <div
                      className={`flex gap-2 flex-col ${
                        selectedOptions[selectedQuestionIndex] === option
                          ? "selected-option"
                          : "option"
                      }`}
                      key={index}
                      onClick={() => {
                        setSelectedOptions({
                          ...selectedOptions,
                          [selectedQuestionIndex]: option,
                        });
                      }}
                    >
                      <h1 className="text-xl">
                        {option} :{" "}
                        {questions[selectedQuestionIndex].options[option]}
                      </h1>
                    </div>
                  );
                }
              )}
            </div>

            <div className="flex justify-between">
              {selectedQuestionIndex > 0 && (
                <button
                  className="primary-outlined-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex - 1);
                  }}
                >
                  Previous
                </button>
              )}

              {selectedQuestionIndex < questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    setSelectedQuestionIndex(selectedQuestionIndex + 1);
                  }}
                >
                  Next
                </button>
              )}

              {selectedQuestionIndex === questions.length - 1 && (
                <button
                  className="primary-contained-btn"
                  onClick={() => {
                    clearInterval(intervalId);
                    setTimeUp(true);
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        )}

{view === "result" && (
  <div style={{
    display: "flex",
    flexDirection: "column", // Default for small screens
    alignItems: "center",
    justifyContent: "center",
    marginTop: "20px",
    width: "100%",
  }}>
    {/* Animation and Result Card - flexDirection change for large screens */}
    <div style={{
      display: "flex",
      flexDirection: window.innerWidth >= 1024 ? "row" : "column", // Change to row for large screens
      alignItems: "center",
      justifyContent: "center",
      marginTop: "20px",
      gap: "20px", // Add gap between the result and animation for larger screens
      width: "100%",
    }}>
      {/* Animation */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
        width: "100%",
        order: window.innerWidth >= 1024 ? 2 : 1, // Ensure the animation is on the right on large screens
      }}>
        {result.verdict === "Pass" && (
          <lottie-player
            src="https://assets2.lottiefiles.com/packages/lf20_ya4ycrti.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{
              width: "100%",
              maxWidth: "350px", // Limits animation width for larger screens
              height: "auto",
              minHeight: "150px", // Keeps a minimum height for consistency
            }}
          ></lottie-player>
        )}

        {result.verdict === "Fail" && (
          <lottie-player
            src="https://assets4.lottiefiles.com/packages/lf20_qp1spzqv.json"
            background="transparent"
            speed="1"
            loop
            autoplay
            style={{
              width: "100%",
              maxWidth: "350px", // Limits animation width for larger screens
              height: "auto",
              minHeight: "150px", // Keeps a minimum height for consistency
            }}
          ></lottie-player>
        )}
      </div>

      {/* Result Card */}
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "600px",
        width: "100%",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        padding: "20px",
        order: window.innerWidth >= 1024 ? 1 : 2, // Ensure the result card is on the left on large screens
      }}>
        <h1 style={{
          fontSize: "24px",
          fontWeight: "bold",
        }}>RESULT</h1>
        <div style={{
          height: "1px",
          backgroundColor: "#ccc",
          margin: "10px 0",
        }}></div>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}>
          <h1 style={{
            fontSize: "16px",
          }}>Total Marks : {examData.totalMarks}</h1>
          <h1 style={{
            fontSize: "16px",
          }}>Obtained Marks : {result.correctAnswers.length}</h1>
          <h1 style={{
            fontSize: "16px",
          }}>Wrong Answers : {result.wrongAnswers.length}</h1>
          <h1 style={{
            fontSize: "16px",
          }}>Passing Marks : {examData.passingMarks}</h1>
          <h1 style={{
            fontSize: "16px",
            color: result.verdict === "Pass" ? "green" : "red", // Conditional color change
          }}>VERDICT : {result.verdict}</h1>

          <div style={{
            display: "flex",
            gap: "10px",
            marginTop: "10px",
          }}>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                border: "1px solid #007bff",
                backgroundColor: "transparent",
                color: "#007bff",
                cursor: "pointer",
                width: "150px",
              }}
              onClick={() => {
                setView("instructions");
                setSelectedQuestionIndex(0);
                setSelectedOptions({});
                setSecondsLeft(examData.duration);
              }}
            >
              Retake Exam
            </button>
            <button
              style={{
                padding: "10px 20px",
                borderRadius: "5px",
                backgroundColor: "#007bff",
                color: "white",
                cursor: "pointer",
                width: "150px",
              }}
              onClick={() => {
                setView("review");
              }}
            >
              Review Answers
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
)}



        {view === "review" && (
          <div className="flex flex-col gap-2">
            {questions.map((question, index) => {
              const isCorrect =
                question.correctOption === selectedOptions[index];
              return (
                <div
                  className={`
                  flex flex-col gap-1 p-2 ${
                    isCorrect ? "bg-success" : "bg-error"
                  }
                `}
                >
                  <h1 className="text-xl">
                    {index + 1} : {question.name}
                  </h1>
                  <h1 className="text-md">
                    Submitted Answer : {selectedOptions[index]} -{" "}
                    {question.options[selectedOptions[index]]}
                  </h1>
                  <h1 className="text-md">
                    Correct Answer : {question.correctOption} -{" "}
                    {question.options[question.correctOption]}
                  </h1>
                </div>
              );
            })}

            <div className="flex justify-center gap-2">
              <button
                className="primary-outlined-btn button1"
                onClick={() => {
                  navigate("/");
                }}
              >
                Close
              </button>
              <button
                className="primary-contained-btn button1"
                onClick={() => {
                  setView("instructions");
                  setSelectedQuestionIndex(0);
                  setSelectedOptions({});
                  setSecondsLeft(examData.duration);
                }}
              >
                Retake Exam
              </button>
            </div>
          </div>
        )}
      </div> 
    )
  );
}

export default WriteExam;