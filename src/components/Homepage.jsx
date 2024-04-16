import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import animationData from "../assets/flyingBee.json";

const Homepage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/game");
  };
  return (
    <Flex
      gap="4px 10px"
      wrap="wrap"
      vertical
      direction="column"
      align="center"
      justify="center"
      style={{ height: "80vh", textAlign: "center" }}
    >
      <Flex
        style={{
          height: "10rem",
          width: "10rem",
          backgroundColor: "#ffffff",
          borderRadius: "50%",
        }}
      >
        <Lottie animationData={animationData} />
      </Flex>
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "#3a3637",
        }}
      >
        Welcome to Spelling Bee
      </h1>
      <Button type="primary" onClick={handleClick}>
        Start Now
      </Button>
    </Flex>
  );
};

export default Homepage;
