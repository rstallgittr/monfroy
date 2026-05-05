document.addEventListener('DOMContentLoaded', () => {
  const triviaWidget = document.getElementById('trivia-auto-widget');
  if (!triviaWidget) return;

  const questionEl = triviaWidget.querySelector('.trivia-question');
  const answerEl = triviaWidget.querySelector('.trivia-answer');
  const indicatorEl = triviaWidget.querySelector('.trivia-indicator');
  const sourcePath = triviaWidget.dataset.source || '/trivia-data.json';
  const delay = Number(triviaWidget.dataset.delay) || 5000;

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

  fetch(sourcePath)
    .then((response) => {
      if (!response.ok) throw new Error('Failed to fetch trivia data');
      return response.json();
    })
    .then((data) => {
      const questions = Array.isArray(data.questions) ? data.questions : [];
      if (!questions.length) {
        showError();
        return;
      }

      let currentIndex = 0;
      updateCard(questions[currentIndex], currentIndex, questions.length);
      triviaWidget.classList.remove('loading');

      setInterval(() => {
        currentIndex = (currentIndex + 1) % questions.length;
        updateCard(questions[currentIndex], currentIndex, questions.length);
      }, delay);
    })
    .catch(() => {
      showError();
    });
});
