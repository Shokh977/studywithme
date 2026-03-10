import React, { useState, useEffect } from 'react';

const WordOfTheDay = () => {
  const [word, setWord] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const words = [
    {
      word: '사랑',
      pronunciation: 'sa-rang',
      definition: 'Love',
      example: '나는 너를 사랑해요. (I love you.)',
      audio: '/assets/audio/sarang.mp3',
    },
    {
      word: '행복',
      pronunciation: 'haeng-bok',
      definition: 'Happiness',
      example: '행복은 마음에서 시작됩니다. (Happiness starts from the heart.)',
      audio: '/assets/audio/haengbok.mp3',
    },
    {
      word: '친구',
      pronunciation: 'chin-gu',
      definition: 'Friend',
      example: '친구와 함께 영화를 봤어요. (I watched a movie with my friend.)',
      audio: '/assets/audio/chingu.mp3',
    },
  ];

  useEffect(() => {
    const today = new Date().getDate();
    setWord(words[today % words.length]);
  }, []);

  const addToFavorites = () => {
    if (word && !favorites.some((fav) => fav.word === word.word)) {
      setFavorites([...favorites, word]);
    }
  };

  const playAudio = () => {
    if (word && word.audio) {
      const audio = new Audio(word.audio);
      audio.play();
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-2xl mb-6">
      <h2 className="text-2xl font-bold mb-4">Korean Word of the Day</h2>
      {word ? (
        <div>
          <h3 className="text-xl font-bold text-gray-800">{word.word}</h3>
          <p className="text-gray-600 italic mb-2">[{word.pronunciation}]</p>
          <p className="text-gray-700 mb-2">Definition: {word.definition}</p>
          <p className="text-gray-700 mb-4">Example: {word.example}</p>
          <div className="flex space-x-4">
            <button
              onClick={playAudio}
              className="px-4 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors"
            >
              Play Audio
            </button>
            <button
              onClick={addToFavorites}
              className="px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors"
            >
              Add to Favorites
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading word of the day...</p>
      )}

      {favorites.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Favorite Words</h3>
          <ul className="list-disc list-inside text-gray-700">
            {favorites.map((fav, index) => (
              <li key={index}>{fav.word} - {fav.definition}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WordOfTheDay;