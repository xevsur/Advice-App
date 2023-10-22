import { useState, useEffect } from "react";

const MainBox = () => {
  const [advice, setAdvice] = useState("");
  const [adviceNumber, setAdviceNumber] = useState(0);
  const [previousNumbers, setPreviousNumbers] = useState<number[]>([]);

  const fetchAdvice = () => {
    fetch("https://api.adviceslip.com/advice?t=" + Math.random())
      .then((response) => response.json())
      .then((data) => {
        const newAdvice = `“${data.slip.advice}”`;
        if (newAdvice !== advice) {
          setAdvice(newAdvice);
          localStorage.setItem("advice", newAdvice);
          generateRandomNumber();
        } else {
          fetchAdvice();
        }
      })
      .catch((error) => console.error(error));
  };

  const generateRandomNumber = () => {
    let newNumber = Math.floor(Math.random() * 10000) + 1;
    while (previousNumbers.includes(newNumber)) {
      newNumber = Math.floor(Math.random() * 10000) + 1;
    }
    setAdviceNumber(newNumber);
    setPreviousNumbers([...previousNumbers, newNumber]);
    localStorage.setItem("adviceNumber", newNumber.toString());
  };

  useEffect(() => {
    const storedAdvice = localStorage.getItem("advice");
    if (storedAdvice) {
      setAdvice(storedAdvice);
    } else {
      fetchAdvice();
    }
    const storedAdviceNumber = localStorage.getItem("adviceNumber");
    if (storedAdviceNumber) {
      setAdviceNumber(parseInt(storedAdviceNumber));
    } else {
      generateRandomNumber();
    }
  }, []);

  //ovals animation
  function spawnOval() {
    const oval = document.createElement("div");
    oval.classList.add("oval");
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    oval.style.top = `${Math.random() * (screenHeight - 150)}px`;
    oval.style.left = `${Math.random() * (screenWidth - 50)}px`;
    document.body.appendChild(oval);
    return oval;
  }

  function spawnOvals() {
    const maxOvals = 15;
    function spawn() {
      const ovals = document.querySelectorAll(".oval");
      if (ovals.length >= maxOvals) {
        return;
      }
      const oval = spawnOval();
      const delay = Math.random() * 5000;
      setTimeout(() => {
        oval.style.opacity = "0";
        oval.addEventListener("transitionend", () => {
          oval.remove();
        });
      }, delay);
      setTimeout(spawn, Math.random() * 5000);
    }
    setTimeout(spawn, Math.random() * 5000);
  }

  spawnOvals();

  return (
    <div className="MainBox">
      <div className="adviceNumber">Advice #{adviceNumber}</div>
      <div className="Advices">{advice}</div>
      <div className="divider">
        <img src="/images/pattern-divider-mobile.svg" alt="divideImg" />
      </div>
      <div className="buttonContainer">
        <button
          className="Button"
          onClick={() => {
            fetchAdvice();
          }}
        >
          <img src="/images/icon-dice.svg" alt="dice" />
        </button>
      </div>
    </div>
  );
};

export default MainBox;
