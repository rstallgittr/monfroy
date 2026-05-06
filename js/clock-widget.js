function initClockBanner() {
  var banner = document.getElementById('clock-banner');
  var dateLine = document.getElementById('clock-date');
  var timeLine = document.getElementById('clock-time');

  if (!banner || !dateLine || !timeLine) {
    return;
  }

  function pad(value) {
    return value.toString().padStart(2, '0');
  }

  function getTimezoneLabel() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    } catch (error) {
      return '';
    }
  }

  function updateClock() {
    var now = new Date();
    var month = pad(now.getMonth() + 1);
    var day = pad(now.getDate());
    var year = now.getFullYear().toString().slice(-2);
    var hours = pad(now.getHours());
    var minutes = pad(now.getMinutes());
    var seconds = pad(now.getSeconds());
    var timezone = getTimezoneLabel();

    dateLine.textContent = month + '.' + day + '.' + year + ' T';
    timeLine.textContent = hours + ':' + minutes + ':' + seconds + (timezone ? timezone : '');
  }

  var isCompact = false;

  function updateCompactState() {
    // Hysteresis: different thresholds for entering vs exiting
    var shouldCompact;
    if (isCompact) {
      // Exit compact mode only if scrolled back below 30px AND window is wide enough
      shouldCompact = window.scrollY > 30 || window.innerWidth < 680;
    } else {
      // Enter compact mode if scrolled past 60px OR window is narrow
      shouldCompact = window.scrollY > 60 || window.innerWidth < 680;
    }
    
    if (shouldCompact !== isCompact) {
      isCompact = shouldCompact;
      banner.classList.toggle('compact', shouldCompact);
    }
  }

  updateClock();
  updateCompactState();
  window.setInterval(updateClock, 1000);
  window.addEventListener('scroll', updateCompactState);
  window.addEventListener('resize', updateCompactState);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initClockBanner);
} else {
  initClockBanner();
}
