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

// Main Game component
const Game = () => {
  // State variables
  const [inputWord, setInputWord] = useState(""); // User input word
  const [randomWord, setRandomWord] = useState(""); // Randomly selected word from CSV
  const [wordsArray, setWordsArray] = useState([]); // List of words from CSV file
  const [correctWords, setCorrectWords] = useState([]); // List of correctly guessed words
  const [skippedWords, setSkippedWords] = useState([]); // List of skipped words
  const [wordIsGuessed, setWordIsGuessed] = useState(false); // Tracks if a word has been guessed

  // Function to read the CSV file and load words into the wordsArray
  const readCSVFile = async () => {
    // Path to the CSV file
    const filePath = "src/words/words.csv";
    // const filePath = "./words.csv";

    // Fetch the CSV file, parse the data, and set the wordsArray
    fetch(filePath)
      .then((response) => response.text())
      .then((data) => {
        const parsedData = Papa.parse(data, {
          delimiter: ",",
          header: false,
        });

        // Extract and set the words in wordsArray
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

  // useEffect hook to read the CSV file when the component is mounted
  useEffect(() => {
    readCSVFile();
    setWordIsGuessed(true);
  }, []);

  // Handler for input changes
  const handleChange = (e) => {
    setInputWord(e.target.value);
  };

  // Function to get a new random word from wordsArray
  const getNewRandomWord = () => {
    const index = Math.floor(Math.random() * wordsArray.length);
    const newRandomWord = wordsArray[index];
    return newRandomWord;
  };

  // Function to get a random word and handle speaking it
  const getRandomWord = () => {
    if (wordsArray.length === 0) {
      toast.success("All words have been guessed! Game over.");
      return;
    }

    // If the word hasn't been guessed yet, speak the current random word
    if (!wordIsGuessed) {
      speakRandomWord(randomWord);
    } else {
      // If the word has been guessed, get a new random word and speak it
      setWordIsGuessed(false);
      const newRandomWord = getNewRandomWord();
      setRandomWord(newRandomWord);
      speakRandomWord(newRandomWord);
    }
  };

  // Function to use the speech synthesis API to speak a word
  const speakRandomWord = (randomWord) => {
    const synth = window.speechSynthesis;
    const utterThis = new SpeechSynthesisUtterance(randomWord);
    synth.speak(utterThis);
  };

  // Function to check if the user's input matches the random word
  const checkRandomWord = () => {
    if (inputWord.toLowerCase() === "") {
      toast.warn("Please enter a word!");
      return;
    }

    // Check if the user's input matches the random word
    if (inputWord.toLowerCase() === randomWord.toLowerCase()) {
      toast.success("Correct!");
      setCorrectWords([...correctWords, inputWord]);

      // Remove the correctly guessed word from the wordsArray
      const updatedWordsArray = wordsArray.filter(
        (word) => word.toLowerCase() !== randomWord.toLowerCase()
      );
      setWordsArray(updatedWordsArray);
      setInputWord("");
      setWordIsGuessed(true);
      return;
    }

    // Inform the user that the guess was incorrect
    toast.error("Incorrect! Try again.");
    return;
  };

  // Function to restart the game
  const restartGame = () => {
    setInputWord("");
    setRandomWord("");
    setWordsArray([]);
    setCorrectWords([]);
    setSkippedWords([]);
    readCSVFile(); // Reload the words from the CSV file
  };

  // Function to handle skipping a word
  const handleSkip = () => {
    if (randomWord !== "") {
      // Check if the randomWord is already in the skippedWords array
      if (
        !skippedWords.includes(randomWord) &&
        !correctWords.includes(randomWord)
      ) {
        setSkippedWords([...skippedWords, randomWord]);

        // Remove the skipped word from wordsArray
        const updatedWordsArray = wordsArray.filter(
          (word) => word.toLowerCase() !== randomWord.toLowerCase()
        );
        setWordsArray(updatedWordsArray);
        setInputWord("");
        setWordIsGuessed(true);
      }
    }
  };

  // Render the game UI
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

                {skippedWords.length > 0 &&
                  skippedWords.map((word, index) => (
                    <Tag
                      icon={<CloseCircleOutlined />}
                      key={index}
                      color="error"
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
