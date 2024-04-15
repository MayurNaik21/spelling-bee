import { useEffect, useState } from "react";
import { Button, Col, Divider, Flex, Input, Row, Tag } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  SoundOutlined,
} from "@ant-design/icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Papa from "papaparse";

const Game = () => {
  const [inputWord, setInputWord] = useState("");
  const [randomWord, setRandomWord] = useState("");
  const [wordsArray, setWordsArray] = useState([]);
  const [correctWords, setCorrectWords] = useState([]);
  const [skippedWords, setSkippedWords] = useState([]);
  const [wordIsGuessed, setWordIsGuessed] = useState(false);

  const readCSVFile = async () => {
    const filePath = "src/words/words.csv";

    fetch(filePath)
      .then((response) => response.text())
      .then((data) => {
        const parsedData = Papa.parse(data, {
          delimiter: ",",
          header: false,
        });
        const words = parsedData.data
          .flat()
          .map((word) => word.trim())
          .filter((word) => word !== "");
        setWordsArray(words);
      })
      .catch((error) => {
        console.error("Error fetching and parsing CSV file:", error);
      });
  };

  useEffect(() => {
    readCSVFile();
    setWordIsGuessed(true);
  }, []);

  const handleChange = (e) => {
    setInputWord(e.target.value);
  };

  const getNewRandomWord = () => {
    const index = Math.floor(Math.random() * wordsArray.length);
    const newRandomWord = wordsArray[index];
    return newRandomWord;
  };

  const getRandomWord = () => {
    if (wordsArray.length === 0) {
      toast.success("All words have been guessed! Game over.");
      return;
    }

    if (!wordIsGuessed) {
      speakRandomword(randomWord);
    } else {
      setWordIsGuessed(false);
      const newRandomWord = getNewRandomWord();
      setRandomWord(newRandomWord);
      speakRandomword(newRandomWord);
    }
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
      setWordIsGuessed(true);
      return;
    }
    toast.error("Incorrect! Try again.");
    return;
  };

  const restartGame = () => {
    setInputWord("");
    setWordsArray([]);
    setRandomWord("");
    setCorrectWords([]);
    readCSVFile();
  };

  const handleSkip = () => {
    if (randomWord !== "") {
      setSkippedWords([...skippedWords, randomWord]);
      const updatedWordsArray = wordsArray.filter(
        (word) => word.toLowerCase() !== randomWord.toLowerCase()
      );
      setWordsArray(updatedWordsArray);
      setInputWord("");
      setWordIsGuessed(true);
    }
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
              <Button onClick={getRandomWord}>
                {" "}
                <SoundOutlined /> Speak Word
              </Button>
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
                  Check Word
                </Button>

                <Button onClick={restartGame}>Restart Game</Button>
                <Button type="primary" danger onClick={handleSkip}>
                  Skip This Word
                </Button>
              </Flex>
            </div>
          </Col>

          <Col span={12}>
            <div
              style={{
                backgroundColor: "#f5f5f5",
                padding: "1rem",
                borderRadius: "10px",
                overflow: "auto",
              }}
            >
              <Divider>Result</Divider>
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

                {skippedWords.map((word, index) => (
                  <Tag icon={<CloseCircleOutlined />} key={index} color="error">
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
