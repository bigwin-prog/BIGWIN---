// Function to set a cookie
function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
}

// Function to get a cookie value
function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(`${name}=`)) {
      return cookie.substring(name.length + 1);
    }
  }
  return null;
}

// Function to update balance in the cookie and display it
function updateBalance(amount) {
  let currentBalance = parseFloat(getCookie("balance")) || 0;
  currentBalance += amount;
  setCookie("balance", currentBalance.toFixed(2), 1); // Store in cookie, up to 1 day
  document.getElementById("balanceAmount").textContent = `Rs ${currentBalance.toFixed(2)}`;
}

// Function to start or resume a timer
function startTimer(id, duration) {
  let timer = duration;
  const element = document.getElementById(id);

  // Display the timer
  element.style.display = "block";

  const interval = setInterval(() => {
    const hours = Math.floor(timer / 3600);
    const minutes = Math.floor((timer % 3600) / 60);
    const seconds = timer % 60;
    element.innerHTML = `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      seconds < 10 ? "0" : ""
    }${seconds}`;
    timer--;

    // Save the timer in a cookie
    setCookie(`timer_${id}`, timer, 1);

    if (timer < 0) {
      element.innerHTML = "Time's up!";
      clearInterval(interval);
      setCookie(`timer_${id}`, "", -1); // Clear the cookie

      // Update balance when the timer ends
      updateBalance(20); // Add Rs 20 to balance
    }
  }, 1000);
}

// Function to verify input codes and start the timer
function verifyCode(level, timerId) {
  const input = document.getElementById(`input-${level}`);
  let correctCode;

  if (level === 1) {
    correctCode = "12345";
  } else if (level === 2) {
    correctCode = "67890";
  } else if (level === 3) {
    correctCode = "abcde";
  }

  const errorMsg = document.getElementById(`error-${level}`);

  if (input.value === correctCode) {
    errorMsg.textContent = "";

    // Check if a timer already exists in the cookie
    const savedTimer = getCookie(`timer_${timerId}`);
    if (savedTimer && !isNaN(savedTimer) && savedTimer > 0) {
      startTimer(timerId, parseInt(savedTimer)); // Start from saved cookie time
    } else {
      startTimer(timerId, 60); // Start a new timer with 1-minute duration
    }
  } else {
    errorMsg.textContent = "Enter correct code";
  }
}

// Resume timers and balance on page load
window.onload = () => {
  const levels = [1, 2, 3];
  levels.forEach((level) => {
    const timerId = `timer${level}`;
    const savedTimer = getCookie(`timer_${timerId}`);

    if (savedTimer && !isNaN(savedTimer) && savedTimer > 0) {
      const timerElement = document.getElementById(timerId);
      timerElement.style.display = "block"; // Ensure the timer is visible
      startTimer(timerId, parseInt(savedTimer));
    } else {
      // Hide the timer if no valid cookie exists
      const timerElement = document.getElementById(timerId);
      if (timerElement) {
        timerElement.style.display = "none";
        timerElement.innerHTML = ""; // Clear any content
      }
    }
  });

  // Initialize balance from the cookie and display it
  const savedBalance = getCookie("balance");
  if (savedBalance) {
    document.getElementById("balanceAmount").textContent = `Rs ${savedBalance}`;
  } else {
    updateBalance(0); // Initialize balance to 0 if not present
  }
};


