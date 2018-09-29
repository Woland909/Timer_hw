function Timer(timerContainerSelector, timerEndContainerSelector, audiosrc) {
    let countdown;
    let timerContainer = document.querySelector(timerContainerSelector);
    let endTimerContainer = document.querySelector(timerEndContainerSelector);
    let audio = new Audio(audiosrc);
    /**
     * Функция запуска таймера
     * @param {number} seconds 
     */
    this.start = function (seconds) {
        clearInterval(countdown);

        const now = Date.now();
        const then = now + seconds * 1000;
        displayTimeLeft(seconds);
        displayEndTime(then);

        
        countdown = setInterval(() => {
            const secondsLeft = Math.round((then - Date.now()) / 1000);
            
            if(secondsLeft < 0) {
                audio.play();
                return clearInterval(countdown);
            }
            
            displayTimeLeft(secondsLeft); 
        }, 1000);
    }
    /**
     * 
     */
    this.stop = function() {
        clearInterval(countdown);
        timerContainer.innerHTML = "";
        endTimerContainer.innerHTML ='';
        document.title ='';
    }

    /**
     * Функция для вывода таймера в разметку. Принемает секунды и выводит их в разметку в правильном формате.
     * @param {number} seconds -текущее время в секундах
     * @returns {void}
     */
    function displayTimeLeft(seconds) {
        const minutes = Math.floor(seconds / 60);
        const reminderSeconds = seconds % 60;
        const hours = Math.floor(minutes / 60);
        const reminderMinues = minutes % 60;
        const day = Math.floor(hours / 24);
        const reminderDay = hours % 24;

        const minutess = `${minutes < 10 ? '0': ''}${minutes}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`;

        const hourse = minutes > 59 ? `${hours < 10 ? '0' : ''}${hours}:${reminderMinues < 10 ? '0': ''}${reminderMinues}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`: `${minutess}`;

        const dayy = `${day}d:${reminderDay < 10 ? "0" : ''}${reminderDay}h:${reminderMinues < 10 ? '0': ''}${reminderMinues}:${reminderSeconds < 10 ? '0' : ''}${reminderSeconds}`;

        


        const display = hours > 23 ? `${dayy}` : `${hourse}`;

        document.title = display;
        timerContainer.textContent = display;

    }

    /**
    * Функция вывода даты окончания работы таймера
    * @param {number} timestamp - время окончания работы в милле/сек
    * @returns {void}
    */
    function displayEndTime(timestamp) {
        const now = Date.now();
        const date = new Date(timestamp);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const display = date - now > 86400000 ? `Be back across ${parseInt(`${(date - now) / 1000 / 60 /60/ 24}`)} day in ${hours}:${minutes < 10 ? "0" : ""}${minutes}` : `Be back at ${hours}:${minutes < 10 ? "0" : ""}${minutes}`;
        endTimerContainer.textContent = display;
    }
}

const btns = document.querySelectorAll("[data-time]");
const stopbtn = document.querySelector('.stop__timer');
const form = document.forms['customForm'];
const formInput = form['minutes'];



const myTimer = new Timer ('.display__time-left',
'.display__end-time', 'audio/bell.mp3');

/**
 * Функция принимает значение атрибута data-time в теге btn и передает его в myTimer.start 
 * @param {event} click 
 */
function startTimerOnCkick() {
    const seconds = parseFloat(this.dataset.time);
    myTimer.start(seconds);
}

/**
 * Функция котороя принемает value тега form и проверяет его на привильность  контекста и передает его в myTimer.start 
 * @param {event} click
 */
function startTimerOnForm(e) {
    e.preventDefault();
    const minutes = parseFloat(formInput.value) * 60;
    if ( minutes !== NaN && formInput.value > 0 && formInput.value.indexOf(".") === -1) {
        myTimer.start(minutes);
    } else {
       return alert("Введите корректное содержание");
    }
}

form.addEventListener('submit', startTimerOnForm);
btns.forEach(btn => btn.addEventListener("click", startTimerOnCkick));
stopbtn.addEventListener('click', myTimer.stop.bind(myTimer));