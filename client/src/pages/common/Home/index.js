import { Col, message, Row } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllExams } from "../../../apicalls/exams";
import { HideLoading, ShowLoading } from "../../../redux/loaderSlice";
import PageTitle from "../../../components/PageTitle";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Import CSS file

function Home() {
  const [exams, setExams] = React.useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const getExams = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getAllExams();
      if (response.success) {
        setExams(response.data);
      } else {
        message.error(response.message);
      }
      dispatch(HideLoading());
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
    }
  };

  useEffect(() => {
    getExams();
  }, []);

  return (
    user && (
      <div className="home-container">
        <PageTitle title={`Hi ${user.name}, Welcome to Virtual Assessement System`} />
        <div className="divider"></div>
        <Row gutter={[16, 16]}>
          {exams.map((exam) => (
            <Col key={exam._id} xs={24} sm={12} md={8} lg={7}>
              <div className="exam-card">
                <h1 className="exam-title">{exam?.name}</h1>
                <h1 className="exam-detail">Category: {exam.category}</h1>
                <h1 className="exam-detail">Total Marks: {exam.totalMarks}</h1>
                <h1 className="exam-detail">Passing Marks: {exam.passingMarks}</h1>
                <h1 className="exam-detail">Duration: {exam.duration} seconds</h1>

                <button
                  className="start-exam-btn"
                  onClick={() => navigate(`/user/write-exam/${exam._id}`)}
                >
                  Start Exam
                </button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    )
  );
}

export default Home;
