document.addEventListener('DOMContentLoaded', () => {
  const triviaWidget = document.getElementById('trivia-auto-widget');
  if (!triviaWidget) return;

  const questionEl = triviaWidget.querySelector('.trivia-question');
  const answerEl = triviaWidget.querySelector('.trivia-answer');
  const indicatorEl = triviaWidget.querySelector('.trivia-indicator');
  const forwardBtn = document.getElementById('trivia-forward');
  const backwardBtn = document.getElementById('trivia-backward');
  const answerBtn = document.getElementById('trivia-answer');
  const sourcePath = triviaWidget.dataset.source || '/trivia-data.json';
  const delay = Number(triviaWidget.dataset.delay) || 6000;

  let questions = [];
  let currentIndex = 0;
  let autoScrollInterval = null;
  let isAutoScrollExtended = false;

  function updateCard(question, index, total) {
    questionEl.textContent = question.question || 'No question available.';
    answerEl.textContent = question.answer ? `Answer: ${question.answer}` : '';
    indicatorEl.textContent = `Question ${index + 1} of ${total} · Round: ${question.round || 'Unknown'}`;
  }

  function showError() {
    questionEl.textContent = 'Unable to load trivia questions.';
    answerEl.textContent = '';
    indicatorEl.textContent = 'Check the trivia-data.json file or site deployment.';
    triviaWidget.classList.add('error');
  }

  function startAutoScroll(delayMs = delay) {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    autoScrollInterval = setInterval(() => {
      currentIndex = (currentIndex + 1) % questions.length;
      updateCard(questions[currentIndex], currentIndex, questions.length);
      
      // If we extended the delay, return to normal after one auto-advance
      if (isAutoScrollExtended) {
        isAutoScrollExtended = false;
        startAutoScroll(delay);
      }
    }, delayMs);
  }

  function handleButtonClick(direction) {
    if (!questions.length) return;
    
    // Clear existing interval
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    
    // Move in the specified direction
    if (direction === 'forward') {
      currentIndex = (currentIndex + 1) % questions.length;
    } else if (direction === 'backward') {
      currentIndex = (currentIndex - 1 + questions.length) % questions.length;
    }
    
    updateCard(questions[currentIndex], currentIndex, questions.length);
    
    // Set extended delay (12 seconds) and mark that we need to return to normal after one auto-advance
    isAutoScrollExtended = true;
    startAutoScroll(12000);
  }

  fetch(sourcePath)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch trivia data');
      return response.json();
    })
    .then((data) => {
      questions = Array.isArray(data.questions) ? data.questions : [];
      if (!questions.length) {
        showError();
        return;
      }

      currentIndex = Math.floor(Math.random() * questions.length);
      updateCard(questions[currentIndex], currentIndex, questions.length);
      triviaWidget.classList.remove('loading');

      startAutoScroll();

      // Attach button event listeners
      forwardBtn.addEventListener('click', () => handleButtonClick('forward'));
      backwardBtn.addEventListener('click', () => handleButtonClick('backward'));
      answerBtn.addEventListener('click', () => {
        // TBD: Answer button functionality
        console.log('Answer button clicked - TBD');
      });
    })
    .catch(() => {
      showError();
    });
});
