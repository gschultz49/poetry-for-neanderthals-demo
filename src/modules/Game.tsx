import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import { wordBank } from './wordbank'; // Import wordBank from the wordbank file

const TIME_TO_PLAY = 60; // Define the constant for the game duration

const App: React.FC = () => {
  const [index, setIndex] = useState(Math.floor(Math.random() * wordBank.length));
  const [swipeClass, setSwipeClass] = useState('');
  const [timer, setTimer] = useState(TIME_TO_PLAY);
  const [message, setMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [successCount, setSuccessCount] = useState(0);
  const [failureCount, setFailureCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (gameOver || isPaused) return;

    if (direction === 'right') {
      setMessage('Success');
      setSwipeClass('swipe-right');
      setSuccessCount((prev) => prev + 1);
    } else {
      setMessage('Failure');
      setSwipeClass('swipe-left');
      setFailureCount((prev) => prev + 1);
    }

    setTimeout(() => {
      setSwipeClass('');
      setMessage(null);
      setIndex((prev) => (prev + 1) % wordBank.length);
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    trackMouse: true,
  });

  useEffect(() => {
    if (gameOver || isPaused) return;

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setGameOver(true);
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameOver, isPaused]);

  const startGame = () => {
    setHasStarted(true);
    setGameOver(false);
    setIsPaused(true); // Set the game to paused state when restarting
    setIndex(Math.floor(Math.random() * wordBank.length));
    setTimer(TIME_TO_PLAY);
    setSuccessCount(0);
    setFailureCount(0);
  };

  const togglePause = () => {
    if (!hasStarted) {
      setHasStarted(true);
      setIsPaused(false);
    } else {
      setIsPaused((prev) => !prev);
    }
  };

  const resetCounts = () => {
    setSuccessCount(0);
    setFailureCount(0);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="text-3xl mb-4">Game ended</div>
        <div className="text-xl mb-2">Successes: {successCount}</div>
        <div className="text-xl mb-6">Failures: {failureCount}</div>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-gray-100 overflow-hidden">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={togglePause}
          className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition"
        >
          {isPaused && !hasStarted ? 'Start' : isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={startGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition"
        >
          Restart Game
        </button>
        <button
          onClick={resetCounts}
          className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
        >
          Reset Counts
        </button>
      </div>
      <div className={`text-2xl mb-4 ${timer === 0 ? 'text-red-500' : timer <= 10 ? 'text-yellow-500' : ''}`}>
        {timer <= 10 && timer > 0 ? `${timer} seconds left!` : `Time left: ${timer}s`}
      </div>
      <div
        {...handlers}
        className={`w-80 h-48 bg-white rounded-lg shadow-lg flex justify-center items-center text-xl text-gray-700 
          transition-transform duration-300 ${swipeClass === 'swipe-left' ? 'transform -translate-x-full rotate-12' : ''} 
          ${swipeClass === 'swipe-right' ? 'transform translate-x-full -rotate-12' : ''}`}
      >
        {wordBank[index]}
      </div>
      {message && (
        <div
          className={`absolute top-1/2 transform -translate-y-1/2 text-4xl font-bold 
          ${message === 'Success' ? 'text-green-500' : 'text-red-500'} 
          animate-bounce`}
        >
          {message}
        </div>
      )}
      <div className="mt-4 flex space-x-4">
        <div className="text-xl text-green-500">Successes: {successCount}</div>
        <div className="text-xl text-red-500">Failures: {failureCount}</div>
      </div>
    </div>
  );
};

export default App;