document.addEventListener('DOMContentLoaded', (event) => {
    const TIMER_KEY = 'countdownTimer';
    const INITIAL_TIME = 10 * 60; // 10 minutes in seconds
    const WARNING_TIME = 1 * 60; // 1 minute in seconds
    const LOGOUT_TIME = INITIAL_TIME; // 10 minutes in seconds

    let totalSeconds = INITIAL_TIME;
    let timerInterval, inactivityTimeout, warningTimeout;
    let warningShown = false;

    const isLoginPage = window.location.pathname.includes('login.html');
    const isAuthenticated = sessionStorage.getItem("userAuthenticated") === "true";

    function updateTimer() {
        const minutesElement = document.getElementById('minutes');
        const secondsElement = document.getElementById('seconds');
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        if (minutesElement && secondsElement) {
            minutesElement.textContent = String(minutes).padStart(2, '0');
            secondsElement.textContent = String(seconds).padStart(2, '0');
        }

        if (totalSeconds <= 0) {
            clearInterval(timerInterval);
            sessionStorage.removeItem(TIMER_KEY);

            if (!warningShown) {
                // If the timer reaches zero and the warning hasn't been shown yet, reset the timer
                resetActivityTimer();
            } else if (isAuthenticated) {
                alert("You have been logged out due to inactivity.");
                sessionStorage.removeItem("userAuthenticated");
                window.location.href = '/login.html';
            }
        } else {
            totalSeconds--;
            sessionStorage.setItem(TIMER_KEY, totalSeconds);
        }
    }

    function inactivityTime() {
        function logout() {
            if (warningShown) {
                alert("You have been logged out due to inactivity.");
                sessionStorage.removeItem("userAuthenticated");
                window.location.href = '/login.html';
            }
        }

        function showWarning() {
            if (!warningShown) {
                alert("You will be logged out soon due to inactivity.");
                warningShown = true;
            }
        }

        function resetActivityTimer() {
            clearTimeout(inactivityTimeout);
            clearTimeout(warningTimeout);
            warningShown = false;

            // Set the timeout to show the warning and logout
            warningTimeout = setTimeout(showWarning, (LOGOUT_TIME - WARNING_TIME) * 1000);
            inactivityTimeout = setTimeout(logout, LOGOUT_TIME * 1000);

            // Reset countdown timer
            totalSeconds = INITIAL_TIME;
            sessionStorage.setItem(TIMER_KEY, totalSeconds);

            // Restart the timer interval
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(updateTimer, 1000);
        }

        // Monitor user activity to reset the inactivity timer
        window.onload = resetActivityTimer;
        document.onmousemove = resetActivityTimer;
        document.onkeypress = resetActivityTimer;
        document.onscroll = resetActivityTimer;
        document.onclick = resetActivityTimer;
    }

    

    if (isAuthenticated && !isLoginPage) {
        inactivityTime();
        totalSeconds = parseInt(sessionStorage.getItem(TIMER_KEY), 10) || INITIAL_TIME;
        timerInterval = setInterval(updateTimer, 1000);
    }

    window.addEventListener('popstate', function (event) {
        if (sessionStorage.getItem("userAuthenticated") === "true") {
            window.location.href = '/main.html';
        }
    });
});
