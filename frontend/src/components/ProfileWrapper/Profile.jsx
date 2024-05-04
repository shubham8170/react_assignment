import { useEffect, useState } from "react";
import { SocialBar } from "./SocialBar";
import { AiOutlineEdit } from "react-icons/ai";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { EditNameModal } from "./EditNameModal";
import EditProfilePicModal from "./EditProfilePicModal";
import { getWeather, updateUsername } from "../../api/user";
import { loadStripe } from "@stripe/stripe-js";
import FetchProject from "./Github/FetchProject";
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { makePayment } from "../../api/contest";
import { Button, Container, Row, Col } from 'react-bootstrap';

export const Profile = ({ userData, setUserData }) => {
  const { lang } = useParams();

  const { t, i18n } = useTranslation();
  useEffect(() => {
       if (lang) {
      i18n.changeLanguage(lang);
    }
    }, [lang, i18n]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTemp, setcurrentTemp] = useState("0");
  const [windSpeed, setwindSpeed] = useState("0");
  const [humidity, sethumidity] = useState("0");
  const handleEditButtonClick = () => {
    setIsEditModalOpen(true);
  };
  const [isEditPicModalOpen, setIsEditPicModalOpen] = useState(false);
  const handleEditPicButtonClick = () => {
    setIsEditPicModalOpen(true);
  };
  const [name, setName] = useState(
    `${userData?.firstname || ""} ${userData?.lastname || ""}`
  );

  console.log(`${userData?.firstname} ${userData?.lastname}`);
  console.log(name);
  const [isEditUserName, setisEditUserName] = useState(false);
  const [username, setUsername] = useState(userData?.username);
  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };
  const handleEditUserNameButtonClick = () => {
    if (isEditUserName) {
      updateUsername({ username })
        .then((data) => {
          if (data) {
            setUserData(data);
            setisEditUserName(!isEditUserName);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      setisEditUserName(!isEditUserName);
    }
  };

  const handlePayment = async () => {
    makePayment();
};


  useEffect(() => {
    setName(`${userData?.firstname} ${userData?.lastname}`);
    setUsername(userData?.username);

    const weatherData = getWeather().then((data) => {
      console.log("weather data ", data);
      setcurrentTemp(data.current.feelslike_c);
      setwindSpeed(data.current.wind_kph);
      sethumidity(data.current.humidity);
    });
  }, [userData]);

  return (
    <div className="page-content">
      <div className="container profile-area">
        <div className="profile">
          <div className="main-profile">
            <div className="left-content d-flex justify-content-between">
              <div>
                {isEditUserName ? (
                  <input
                    type="text"
                    style={{ backgroundColor: "transparent" }}
                    name="name"
                    value={username}
                    onChange={handleInputChange}
                  />
                ) : (
                  <span
                    id="username"
                    style={{ fontWeight: "bold", color: "#FE9063" }}
                  >
                    @{userData?.username}
                  </span>
                )}

                <button
                  style={{
                    cursor: "pointer",
                    background: "none",
                    border: "none",
                    marginLeft: 10,
                    fontSize: "25px",
                  }}
                  onClick={handleEditUserNameButtonClick}
                >
                  {isEditUserName ? (
                    <BsFillArrowRightCircleFill color="#FE9063" />
                  ) : (
                    <AiOutlineEdit color="#FE9063" />
                  )}
                </button>
                <h5 id="fullname" className="mt-1">
                  {name}
                </h5>
              </div>
              <button
                style={{
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  marginLeft: 10,
                  fontSize: "25px",
                }}
                onClick={handleEditButtonClick}
              >
                <AiOutlineEdit color="#FE9063" />
              </button>
              <EditNameModal
                setUserData={setUserData}
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                firstName={userData?.firstname}
                lastName={userData?.lastname}
              />
            </div>
            <div className="right-content">
              <div
                className="upload-box"
                onClick={handleEditPicButtonClick}
                style={{
                  cursor: "pointer",
                }}
              >
                <img
                  id="pic"
                  src={
                    userData?.profileImage ||
                    userData?.avatar ||
                    "data:image/png;base64,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"
                  }
                  alt="profile-piture"
                />
              </div>
              <EditProfilePicModal
                isOpen={isEditPicModalOpen}
                onClose={() => setIsEditPicModalOpen(false)}
                profileImage={userData?.profileImage || userData?.avatar}
                setUserData={setUserData}
              />
            </div>
          </div>
        </div>
        
        <Container style={{ marginTop: '20px' }}>
            <Row>
                <Col>
                    <div className="weather-info">
                        <span className="info-label">Current temperature</span>
                        <span className="info-value">{currentTemp}°C</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="weather-info">
                        <span className="info-label">{t('wind_speed')}</span>
                        <span className="info-value">{windSpeed} km/h</span>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col>
                    <div className="weather-info">
                        <span className="info-label">Current humidity</span>
                        <span className="info-value">{humidity}%</span>
                    </div>
                </Col>
            </Row>
        </Container>
        <div className="d-flex align-items-center">
            <FetchProject />
            <Button  style={{ marginLeft: '15px', padding: '5px' }}  variant="success" onClick={(e) => handlePayment()}>Make Payment</Button>
        </div>

        <div className="contant-section">
          <SocialBar />
        </div>
      </div>
    </div>
  );
};