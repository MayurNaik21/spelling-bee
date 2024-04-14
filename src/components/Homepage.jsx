import { Button, Flex } from "antd";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/game");
  };
  return (
    <Flex gap="4px 10px" wrap="wrap" vertical align="center">
      <h1
        style={{
          fontSize: "3rem",
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
