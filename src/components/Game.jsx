import { useState } from "react";
import { Button, Col, Divider, Flex, Input, Row, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Game = () => {
  const initialWords = [
    "Bougainvillea",
    "Quarantine",
    "Insouciance",
    "Programming",
    "Neighbor",
    "Mountain",
    "Amazing",
    "Chocolate",
    "Success",
  ];
  const [inputWord, setInputWord] = useState("");
  const [randomWord, setRandomWord] = useState("");
  const [wordsArray, setWordsArray] = useState(initialWords);
  const [correctWords, setCorrectWords] = useState([]);

  const handleChange = (e) => {
    setInputWord(e.target.value);
  };

  const getRandomWord = () => {
    if (wordsArray.length === 0) {
      alert("All words have been guessed! Game over.");
      return;
    }
    const index = Math.floor(Math.random() * wordsArray.length);
    const newRandomWord = wordsArray[index];

    setRandomWord(newRandomWord);
    speakRandomword(newRandomWord);
  };

  const speakRandomword = (randomWord) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(randomWord);
    synth.speak(utterThis);
  };

  const checkRandomWord = () => {
    if (inputWord.toLowerCase() === "") {
      toast.warn("Please enter a word!");
      return;
    }
    if (inputWord.toLowerCase() === randomWord.toLowerCase()) {
      toast.success("Correct!");
      setCorrectWords([...correctWords, inputWord]);

      // remove the correctly guessed word from wordarrray
      const updatedWordsArray = wordsArray.filter(
        (word) => word.toLowerCase() !== randomWord.toLowerCase()
      );
      setWordsArray(updatedWordsArray);
      setInputWord("");
      return;
    }
    toast.error("Incorrect! Try again.");
    return;
  };

  const restartGame = () => {
    setInputWord("");
    setWordsArray(initialWords);
    setRandomWord("");
    setCorrectWords([]);
  };

  return (
    <>
      <ToastContainer autoClose={3000} />

      <div>
        <Row>
          <Col span={24}>
            <div
              style={{ color: "#3a3637", fontSize: "2rem", padding: "2rem" }}
            >
              <h2>Start Guessing</h2>
              <Button onClick={getRandomWord}>Speak Word</Button>
            </div>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <div>
              <Flex gap="4px 10px" wrap="wrap">
                <Input
                  type="text"
                  placeholder="Enter Word"
                  value={inputWord}
                  onChange={handleChange}
                  required
                />
                <Button type="primary" onClick={checkRandomWord}>
                  Check
                </Button>

                <Button onClick={restartGame}>Restart Game</Button>
              </Flex>
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "10px",
              }}
            >
              <Divider>Correctly Guessed Words</Divider>
              <Flex gap="4px 0" wrap="wrap">
                {correctWords.map((word, index) => (
                  <Tag
                    icon={<CheckCircleOutlined />}
                    key={index}
                    color="success"
                  >
                    {word}
                  </Tag>
                ))}
              </Flex>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Game;
