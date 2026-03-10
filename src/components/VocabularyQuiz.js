import React, { useState } from 'react';

const VocabularyQuiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: 'What is the synonym of "happy"?',
      options: ['Sad', 'Joyful', 'Angry', 'Tired'],
      answer: 1,
    },
    {
      question: 'What is the antonym of "difficult"?',
      options: ['Easy', 'Hard', 'Challenging', 'Tough'],
      answer: 0,
    },
    {
      question: 'What does "benevolent" mean?',
      options: ['Kind', 'Evil', 'Lazy', 'Strong'],
      answer: 0,
    },
  ];

  const handleAnswer = (index) => {
    if (index === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleComplete = () => {
    onComplete(score);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl text-center">
      {showResult ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-lg mb-4">Your Score: {score} / {questions.length}</p>
          <button
            onClick={handleComplete}
            className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
          >
            Done
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Vocabulary Quiz</h2>
          <p className="text-lg mb-4">{questions[currentQuestion].question}</p>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className="px-4 py-2 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VocabularyQuiz;