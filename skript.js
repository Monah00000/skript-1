// 1. БАЗА ДАННЫХ ВОПРОСОВ ТЕСТА
const quizQuestions = [
    { q: "Какой тег используется для создания многострочного текстового поля?", a: ["input", "textarea", "text", "form"], right: 1 },
    { q: "Какое CSS свойство фиксирует элемент на экране при скролле?", a: ["position: absolute", "position: relative", "position: fixed", "position: sticky"], right: 2 },
    { q: "За что отвечает свойство z-index?", a: ["Размер шрифта", "Прозрачность", "Расположение слоев по оси Z", "Внутренние отступы"], right: 2 },
    { q: "Какое свойство включает Flexbox сетку?", a: ["display: block", "display: grid", "display: flex", "display: inline-block"], right: 2 },
    { q: "В каком формате записывается цвет #000000?", a: ["RGB", "HEX", "HSL", "RGBA"], right: 1 },
    { q: "Какая технология отвечает за структуру и каркас веб-страницы?", a: ["CSS", "JavaScript", "HTML", "PHP"], right: 2 },
    { q: "Для чего используются медиазапросы (@media)?", a: ["Для работы с базами данных", "Для адаптации под разные экраны", "Для анимации картинок", "Для валидации форм"], right: 1 },
    { q: "Какое хранилище браузера сохраняет данные даже после перезагрузки?", a: ["sessionStorage", "localStorage", "Cookies", "Память вкладки"], right: 1 },
    { q: "Что делает свойство text-align: center?", a: ["Центрирует блочный контейнер", "Выравнивает текст по центру", "Задает фоновый цвет", "Делает шрифт жирным"], right: 1 },
    { q: "Какой язык программирования добавляет интерактивность на стороне клиента?", a: ["C++", "Python", "SQL", "JavaScript"], right: 3 }
];

document.addEventListener("DOMContentLoaded", () => {
    // 2. РАБОТА С ИМЕНЕМ ПОЛЬЗОВАТЕЛЯ
    let userName = localStorage.getItem("username");
    const nameDisplay = document.getElementById("user-name-display");

    if (!userName) {
        userName = prompt("Пожалуйста, представьтесь:") || "Гость";
        localStorage.setItem("username", userName);
    }
    nameDisplay.textContent = userName;

    // 3. ПЕРЕКЛЮЧЕНИЕ ТЕМЫ (МЕНЯЕМ КЛАСС НА BODY)
    const themeBtn = document.getElementById("theme-btn");
    let currentTheme = localStorage.getItem("theme") || "dark";/*  по дэфолту темная */
    document.body.className = currentTheme + "-theme";

    themeBtn.addEventListener("click", () => {
        currentTheme = document.body.classList.contains("dark-theme") ? "light" : "dark";
        document.body.className = currentTheme + "-theme";
        localStorage.setItem("theme", currentTheme);
    });

    // 4. ГЕНЕРАЦИЯ ТЕСТА (ЕСЛИ МЫ НА СТРАНИЦЕ ТЕСТА)
    const quizForm = document.getElementById("quiz-form");
    if (quizForm) {
        quizQuestions.forEach((item, index) => {
            const qBlock = document.createElement("div");
            qBlock.className = "quiz-question-block";
            qBlock.innerHTML = `<p class="quiz-q-title"><b>Вопрос ${index + 1}:</b> ${item.q}</p>`;

            item.a.forEach((answer, aIndex) => {
                qBlock.innerHTML += `
                    <label class="quiz-answer-label">
                        <input type="radio" name="question${index}" value="${aIndex}" required> ${answer}
                    </label><br>
                `;
            });
            quizForm.appendChild(qBlock);
        });
        // Проверка результатов теста
        document.getElementById("submit-quiz-btn").addEventListener("click", () => {
            if (!quizForm.checkValidity()) { /* выбрал ли все радио  */
                alert("Пожалуйста, ответьте на все вопросы теста!");
                return;
            }

            let score = 0;
            let reviewHTML = "<h3>Детальный разбор ответов:</h3>";

            quizQuestions.forEach((item, index) => {
                const selected = document.querySelector(`input[name="question${index}"]:checked`);
                const answerIndex = parseInt(selected.value);

                if (answerIndex === item.right) {
                    score++;
                    reviewHTML += `<p class="res-correct">✔ Вопрос ${index + 1}: Верно (${item.a[item.right]})</p>`;
                } else {
                    reviewHTML += `<p class="res-wrong">❌ Вопрос ${index + 1}: Неверно. Твой ответ: "${item.a[answerIndex]}". Правильно: "${item.a[item.right]}"</p>`;
                }
            });

            const finalResultText = `Вы набрали ${score} из ${quizQuestions.length} правильных ответов.`;
            localStorage.setItem("quiz_result", finalResultText);

            const resultBlock = document.getElementById("quiz-result");
            resultBlock.innerHTML = `<h4>Итог: ${finalResultText}</h4>` + reviewHTML;
            resultBlock.style.display = "block";
        });
    }

    // 5. МОДАЛЬНОЕ ОКНО СТАТИСТИКИ ПО КЛИКУ НА ИМЯ
    const modal = document.getElementById("result-modal");
    const modalText = document.getElementById("modal-score-text");

    nameDisplay.addEventListener("click", () => {
        const savedScore = localStorage.getItem("quiz_result");
        modalText.innerHTML = savedScore ? `<b>Пользователь:</b> ${userName}<br><b>Последний результат:</b> ${savedScore}` : `<b>Пользователь:</b> ${userName}<br>Вы еще не проходили тест на этом устройстве.`;
        modal.style.display = "block";
    });

    document.getElementById("close-modal-btn").addEventListener("click", () => modal.style.display = "none"); /* кнопка закрытия */
    window.addEventListener("click", (e) => { if (e.target === modal) modal.style.display = "none"; });
});