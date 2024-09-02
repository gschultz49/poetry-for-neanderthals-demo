import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const wordBank = [
  'Breakfast Menu',
  'Roller-blade',
  'Cookie Crumbs',
  'Surprise Birthday Party',
  'Pie Crust',
  'Hey, batter, batter!',
  'Small Fry',
  'Salad Bar',
  'Animal Cracker',
  'Bad Apple',
  'Catnap',
  'Cotton Candy',
  'Ejection Seat',
  'Bagpipes',
  'Babysitter',
  'Hacky Sack',
  'Full Circle',
  'Close Encounter',
  'Anteater',
  'Caesar Salad',
  'Carrot Cake',
  'Bird Cage',
  'Poop Scoop',
  'Snow Angel',
  'Spider Bite',
  'Road Rage',
  'Water Balloon Fight',
  'Sand Castle',
  'Funny Bone',
  'Disposable Camera',
  'Barn Owl',
  'Massage Table',
  'Radioactive',
  'Sponge Bath',
  'Movie Popcorn',
  'Puppy Party',
  'Bounce Back',
  'Paintbrush',
  'Clam Chowder',
  'Pickle Jar',
  'Free Advice',
  'Alligator Wrestling',
  'Sandstorm',
  'Waffle Cone',
  'Pump Iron',
  'Parade Float',
  'Wedding Crasher',
  'Lightning Bug',
  'Pumpkin Patch',
  'Winter Break',
];

const App: React.FC = () => {
  const [index, setIndex] = useState(
    Math.floor(Math.random() * wordBank.length)
  ); // Randomize the starting word
  const [swipeClass, setSwipeClass] = useState('');
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState<string | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // State for timer pause
  const [successCount, setSuccessCount] = useState(0); // Count for successes
  const [failureCount, setFailureCount] = useState(0); // Count for failures

  const handleSwipe = (direction: 'left' | 'right') => {
    if (gameOver || isPaused) return; // Ignore swipes if game is over or paused

    if (direction === 'right') {
      setMessage('Success');
      setSwipeClass('swipe-right');
      setSuccessCount((prev) => prev + 1); // Increment success count
    } else {
      setMessage('Failure');
      setSwipeClass('swipe-left');
      setFailureCount((prev) => prev + 1); // Increment failure count
    }

    setTimeout(() => {
      setSwipeClass('');
      setMessage(null);
      setIndex((prev) => (prev + 1) % wordBank.length);
      setTimer(60); // Reset the timer
    }, 300);
  };

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Allows mouse swiping for testing on desktops
  });

  useEffect(() => {
    if (gameOver || isPaused) return; // Stop timer if game is over or paused

    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          setGameOver(true); // End the game when the timer hits 0
        }
        return prev > 0 ? prev - 1 : 0;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [gameOver, isPaused]);

  const restartGame = () => {
    setGameOver(false);
    setIsPaused(false);
    setIndex(Math.floor(Math.random() * wordBank.length)); // Randomize the starting word
    setTimer(60);
    setSuccessCount(0); // Reset success count
    setFailureCount(0); // Reset failure count
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetCounts = () => {
    setSuccessCount(0);
    setFailureCount(0);
  };

  if (gameOver) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
        <div className="text-3xl mb-4">Game ended, restart?</div>
        <button
          onClick={restartGame}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Restart Game
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <button
          onClick={togglePause}
          className="px-4 py-2 bg-gray-800 text-white rounded-full shadow-md hover:bg-gray-700 transition"
        >
          {isPaused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={resetCounts}
          className="px-4 py-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
        >
          Reset Counts
        </button>
      </div>
      <div
        className={`text-2xl mb-4 ${
          timer === 0 ? 'text-red-500' : timer <= 10 ? 'text-yellow-500' : ''
        }`}
      >
        {timer <= 10 && timer > 0
          ? `${timer} seconds left!`
          : `Time left: ${timer}s`}
      </div>
      <div
        {...handlers}
        className={`w-80 h-48 bg-white rounded-lg shadow-lg flex justify-center items-center text-xl text-gray-700 
          transition-transform duration-300 ${
            swipeClass === 'swipe-left'
              ? 'transform -translate-x-full rotate-12'
              : ''
          } 
          ${
            swipeClass === 'swipe-right'
              ? 'transform translate-x-full -rotate-12'
              : ''
          }`}
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
      <div className="absolute bottom-4 flex space-x-4">
        <div className="text-xl">Successes: {successCount}</div>
        <div className="text-xl">Failures: {failureCount}</div>
      </div>
    </div>
  );
};
export default App;
