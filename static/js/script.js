const form = document.getElementById("transferForm");
const resetButton = document.getElementById("resetButton");

const resultBlock = document.getElementById("result");
const transferStatus = document.getElementById("transferStatus");

const resultHighlights =
    document.getElementById("resultHighlights");

const calculationDetails =
    document.getElementById("calculationDetails");

const copyBlock = document.getElementById("copyBlock");
const formText = document.getElementById("formText");
const copyButton = document.getElementById("copyButton");

const openGoogleFormButton =
    document.getElementById("openGoogleFormButton");

const employeeNameInput =
    document.getElementById("employeeName");

const progressBar = document.getElementById("progressBar");
const progressPercent =
    document.getElementById("progressPercent");

const formStatus = document.getElementById("formStatus");
const formStatusText =
    document.getElementById("formStatusText");

const transferLessonsInput =
    document.getElementById("transferLessons");

const sourceClassInput =
    document.getElementById("sourceClass");

const sourceSubjectInput =
    document.getElementById("sourceSubject");

const targetClassInput =
    document.getElementById("targetClass");

const targetSubjectInput =
    document.getElementById("targetSubject");

const fullTransferInfo =
    document.getElementById("fullTransferInfo");

const fullTransferText =
    document.getElementById("fullTransferText");

const partialTransferFields =
    document.getElementById("partialTransferFields");

const transferLessonsHint =
    document.getElementById("transferLessonsHint");

const requiredFields = Array.from(
    document.querySelectorAll("[data-required-field]")
);

const stepCards = Array.from(
    document.querySelectorAll("[data-step-card]")
);

const progressSteps = Array.from(
    document.querySelectorAll("[data-progress-step]")
);

const progressLines = Array.from(
    document.querySelectorAll(".progress-line")
);

const transferModeInputs = Array.from(
    document.querySelectorAll('input[name="transferMode"]')
);

let calculationCompleted = false;

const GOOGLE_FORM_URL =
    "https://docs.google.com/forms/d/e/1FAIpQLSczE07d5BuxN2ppiB96cGfmA51R_9T9DvFfjvD1Y3-38Z4RxA/viewform";

const EMPLOYEE_NAME_STORAGE_KEY =
    "transferCalculatorEmployeeName";

const SUBJECTS_BY_CLASS = {
    "5": [
        "Пакет предметов",
        "Математика",
        "Русский язык"
    ],

    "6": [
        "Пакет предметов",
        "Математика",
        "Русский язык"
    ],

    "7": [
        "Пакет предметов",
        "Английский язык",
        "Биология",
        "История",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика"
    ],

    "8": [
       "Пакет предметов",
        "Английский язык",
        "Биология",
        "Информатика",
        "История",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика",
        "Химия"
    ],

    "9": [
       "Пакет предметов",
        "Английский язык",
        "Биология",
        "География",
        "Информатика",
        "История",
        "Литература",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика",
        "Химия"
    ],

    "10": [
       "Пакет предметов",
        "Английский язык",
        "Базовая математика",
        "Биология",
        "География",
        "Информатика",
        "История",
        "Литература",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика",
        "Химия"
    ],

    "11": [
       "Пакет предметов",
        "Английский язык",
        "Базовая математика",
        "Биология",
        "География",
        "Информатика",
        "История",
        "Литература",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика",
        "Химия"
    ]
};

/*
 * СОБЫТИЯ ФОРМЫ
 */

form.addEventListener("input", function () {
    calculationCompleted = false;
    clearGoogleFormLink();

    clearFieldErrors();
    updateTransferModeInterface();
    updateProgress();
});

form.addEventListener("change", function () {
    calculationCompleted = false;
    clearGoogleFormLink();

    clearFieldErrors();
    updateTransferModeInterface();
    updateProgress();
});

transferModeInputs.forEach(input => {
    input.addEventListener("change", function () {
        updateTransferModeInterface();
    });
});

const savedEmployeeName =
    localStorage.getItem(EMPLOYEE_NAME_STORAGE_KEY);

if (savedEmployeeName && employeeNameInput) {
    employeeNameInput.value = savedEmployeeName;
}

if (employeeNameInput) {
    employeeNameInput.addEventListener("input", function () {
        const employeeName =
            employeeNameInput.value.trim();

        if (employeeName) {
            localStorage.setItem(
                EMPLOYEE_NAME_STORAGE_KEY,
                employeeName
            );
        } else {
            localStorage.removeItem(
                EMPLOYEE_NAME_STORAGE_KEY
            );
        }
    });
}

sourceClassInput.addEventListener("change", function () {
    updateSubjectOptions(
        sourceClassInput,
        sourceSubjectInput
    );
});

targetClassInput.addEventListener("change", function () {
    updateSubjectOptions(
        targetClassInput,
        targetSubjectInput
    );
});

updateSubjectOptions(
    sourceClassInput,
    sourceSubjectInput
);

updateSubjectOptions(
    targetClassInput,
    targetSubjectInput
);

updateTransferModeInterface();
updateProgress();

/*
 * РАСЧЁТ
 */

/*
 * РАСЧЁТ
 */

form.addEventListener("submit", function (event) {
    event.preventDefault();

    clearFieldErrors();

    const employeeName =
        employeeNameInput
            ? employeeNameInput.value.trim()
            : "";

    const sourceUserId =
        document.getElementById("sourceUserId").value.trim();

    const targetUserId =
        document.getElementById("targetUserId").value.trim();

    const sourceSubject =
        document.getElementById("sourceSubject").value;

    const sourceClass =
        document.getElementById("sourceClass").value;

    const sourceGrade =
        document.getElementById("sourceGrade").value;

    const targetSubject =
        document.getElementById("targetSubject").value;

    const targetClass =
        document.getElementById("targetClass").value;

    const targetGrade =
        document.getElementById("targetGrade").value;

    const totalLessons =
        getNumberValue("totalLessons");

    const packagePrice =
        getNumberValue("packagePrice");

    const completedPractice =
        getNumberValue("completedPractice");

    const completedTheory =
        getNumberValue("completedTheory");

    const giftLessons =
        getNumberValue("giftLessons");

    const promoAmount =
        getOptionalNumberValue("promoAmount", 0);

    const transferNote =
        document.getElementById("transferNote").value.trim();

    const urgentTransfer =
        document.getElementById("urgentTransfer").checked;

    const transferMode = getTransferMode();

    const completedPaidLessons =
        completedPractice + completedTheory;

    const remainingPaidLessons =
        totalLessons - completedPaidLessons;

    let transferLessons;

    if (transferMode === "full") {
        transferLessons = remainingPaidLessons;
    } else {
        transferLessons =
            getNumberValue("transferLessons");
    }

    resultBlock.classList.remove("hidden");
    copyBlock.classList.add("hidden");
    clearGoogleFormLink();

    resultHighlights.innerHTML = "";
    calculationDetails.innerHTML = "";

    /*
     * ПРОВЕРКА СОТРУДНИКА
     */

    if (!employeeName) {
        showError(
            "Укажите имя и фамилию сотрудника.",
            "employeeName"
        );
        return;
    }

    localStorage.setItem(
        EMPLOYEE_NAME_STORAGE_KEY,
        employeeName
    );

    /*
     * ПРОВЕРКИ USERID
     */

    if (!sourceUserId) {
        showError(
            "Укажите USERID, с которого выполняется перенос.",
            "sourceUserId"
        );
        return;
    }

    if (!targetUserId) {
        showError(
            "Укажите USERID, на который выполняется перенос.",
            "targetUserId"
        );
        return;
    }


    /*
     * ПРОВЕРКИ ПРОДУКТОВ
     */

    if (!sourceClass) {
        showError(
            "Выберите класс исходного продукта.",
            "sourceClass"
        );
        return;
    }

    if (!sourceSubject) {
        showError(
            "Выберите предмет исходного продукта.",
            "sourceSubject"
        );
        return;
    }

    if (!sourceGrade) {
        showError(
            "Выберите грейд исходного продукта.",
            "sourceGrade"
        );
        return;
    }

    if (!targetClass) {
        showError(
            "Выберите класс нового продукта.",
            "targetClass"
        );
        return;
    }

    if (!targetSubject) {
        showError(
            "Выберите предмет нового продукта.",
            "targetSubject"
        );
        return;
    }

    if (!targetGrade) {
        showError(
            "Выберите грейд нового продукта.",
            "targetGrade"
        );
        return;
    }
    /*
     * ПРОВЕРКА КЛАССА И ГРЕЙДА
     */

    if (sourceClass !== targetClass) {
        showError(
            "Проверьте введенные данные! Перенос между разными классами невозможен. Клиенту необходимо обратиться в группу возвратов и переносов."
        );
        return;
    }

    if (sourceGrade !== targetGrade) {
        showError(
            "Проверьте введенные данные! Перенос между разными грейдами невозможен. Клиенту необходимо обратиться в группу возвратов и переносов."
        );
        return;
    }


    /*
     * ПРОВЕРКИ ЧИСЕЛ
     */

    if (
        !Number.isInteger(totalLessons) ||
        totalLessons <= 0
    ) {
        showError(
            "Количество оплаченных занятий в пакете должно быть целым числом больше нуля.",
            "totalLessons"
        );
        return;
    }

    if (
        !Number.isFinite(packagePrice) ||
        packagePrice <= 0
    ) {
        showError(
            "Стоимость оплаченного пакета должна быть больше нуля.",
            "packagePrice"
        );
        return;
    }

    if (!isNonNegativeInteger(completedPractice)) {
        showError(
            "Количество пройденных практических занятий должно быть целым числом от нуля.",
            "completedPractice"
        );
        return;
    }

    if (!isNonNegativeInteger(completedTheory)) {
        showError(
            "Количество пройденных ТВЛ должно быть целым числом от нуля.",
            "completedTheory"
        );
        return;
    }

    if (!isNonNegativeInteger(giftLessons)) {
        showError(
            "Количество подарочных занятий должно быть целым числом от нуля.",
            "giftLessons"
        );
        return;
    }

    if (
        !Number.isFinite(promoAmount) ||
        promoAmount < 0
    ) {
        showError(
            "Промокод не может быть отрицательным.",
            "promoAmount"
        );
        return;
    }

    if (completedPaidLessons > totalLessons) {
        showError(
            `Пройдено ${completedPaidLessons} оплаченных занятий, ` +
            `но в пакете указано только ${totalLessons}. ` +
            "Проверьте данные."
        );
        return;
    }

    if (remainingPaidLessons <= 0) {
        showError(
            "В исходном пакете не осталось оплаченных занятий для переноса."
        );
        return;
    }

    /*
     * ПРОВЕРКИ ЧАСТИЧНОГО ПЕРЕНОСА
     */

    if (transferMode === "partial") {
        if (
            !Number.isInteger(transferLessons) ||
            transferLessons <= 0
        ) {
            showError(
                "Количество оплаченных занятий для частичного переноса должно быть целым числом больше нуля.",
                "transferLessons"
            );
            return;
        }

        if (transferLessons >= remainingPaidLessons) {
            showError(
                `Для частичного переноса необходимо указать меньше ` +
                `${remainingPaidLessons} занятий. ` +
                "Если переносится весь остаток, выберите полный перенос.",
                "transferLessons"
            );
            return;
        }
    }

    /*
     * РАСЧЁТ
     */

    const lessonPrice =
        packagePrice / totalLessons;

    const transferAmount =
        lessonPrice * transferLessons;

    const paidLessonsLeft =
        remainingPaidLessons - transferLessons;

    const totalLessonsToNewPackage =
        transferLessons + giftLessons;

    const transferType =
        transferMode === "full"
            ? "Полный перенос"
            : "Частичный перенос";

    const sourceProduct =
        buildPackageProductName(
            sourceSubject,
            sourceClass,
            totalLessons,
            sourceGrade
        );

    /*
     * Значение для поля:
     * «Укажи, на какой продукт делаем перенос»
     *
     * При полном переносе указываем только новый продукт.
     * При частичном — исходный продукт с остатком
     * и новый продукт с количеством переносимых занятий.
     */
    const transferProductField =
        buildTransferProductField({
            transferMode,
            sourceSubject,
            sourceClass,
            sourceGrade,
            targetSubject,
            targetClass,
            targetGrade,
            paidLessonsLeft,
            transferLessons
        });

    calculationCompleted = true;

    updateProgress();

    transferStatus.className =
        "status-box status-success";

    transferStatus.textContent =
        `✅ ${transferType} предварительно возможен. ` +
        "Проверьте значения перед отправкой данных.";

    /*
     * ГЛАВНЫЕ КАРТОЧКИ
     */

    resultHighlights.innerHTML = `
        <article class="highlight-card">
            <span class="highlight-icon">💰</span>

            <span class="highlight-label">
                Сумма переноса
            </span>

            <strong class="highlight-value">
                ${formatMoney(transferAmount)}
            </strong>
        </article>

        <article class="highlight-card">
            <span class="highlight-icon">📚</span>

            <span class="highlight-label">
                Всего занятий поступит
                в новый пакет
            </span>

            <strong class="highlight-value">
                ${formatLessons(totalLessonsToNewPackage)}
            </strong>
        </article>

        <article class="highlight-card">
            <span class="highlight-icon">🎁</span>

            <span class="highlight-label">
                Подарочных занятий
                переносится бесплатно
            </span>

            <strong class="highlight-value">
                ${formatLessons(giftLessons)}
            </strong>
        </article>

        <article class="highlight-card">
            <span class="highlight-icon">📌</span>

            <span class="highlight-label">
                Останется на исходном продукте
            </span>

            <strong class="highlight-value">
                ${formatLessons(paidLessonsLeft)}
            </strong>
        </article>
    `;

    /*
     * ПОДРОБНОСТИ
     */

    calculationDetails.innerHTML = `
        <div class="detail-item">
            <span class="detail-label">
                Тип переноса
            </span>

            <span class="detail-value">
                ${transferType}
            </span>
        </div>

        <div class="detail-item">
            <span class="detail-label">
                Стоимость одного оплаченного занятия
            </span>

            <span class="detail-value">
                ${formatMoney(lessonPrice)}
            </span>
        </div>

        <div class="detail-item">
            <span class="detail-label">
                Оплаченный остаток до переноса
            </span>

            <span class="detail-value">
                ${formatLessons(remainingPaidLessons)}
            </span>
        </div>

        <div class="detail-item">
            <span class="detail-label">
                Оплаченных занятий переносится
            </span>

            <span class="detail-value">
                ${formatLessons(transferLessons)}
            </span>
        </div>

        <div class="detail-item">
            <span class="detail-label">
                Исходный USERID
            </span>

            <span class="detail-value">
                ${escapeHtml(sourceUserId)}
            </span>
        </div>

        <div class="detail-item">
            <span class="detail-label">
                USERID назначения
            </span>

            <span class="detail-value">
                ${escapeHtml(targetUserId)}
            </span>
        </div>
    `;

    /*
     * ГОТОВЫЕ ДАННЫЕ
     * Порядок соответствует Google Форме.
     */

    formText.value =
`Имя и фамилия сотрудника:
${employeeName}

USERID, с которого переносим:
${sourceUserId}

USERID, на который переносим:
${targetUserId}

Исходный продукт:
${sourceProduct}

Укажи, на какой продукт делаем перенос:
${transferProductField}

Пройденные ТВЛ:
${completedTheory}

Пройденные практические занятия:
${completedPractice}

Незавершённые подарочные занятия:
${giftLessons}

Количество занятий в новом пакете:
${totalLessonsToNewPackage}

Сумма переноса:
${formatMoney(transferAmount)}

Промокод:
${formatMoney(promoAmount)}

Примечание:
${transferNote || "Нет"}

Срочный перенос:
${urgentTransfer ? "Да" : "Нет"}

Дополнительная информация:
Тип переноса — ${transferType}.
Оплаченных занятий переносится — ${transferLessons}.
Останется на исходном продукте — ${paidLessonsLeft}.
Стоимость одного оплаченного занятия — ${formatMoney(lessonPrice)}.`;

const googleFormUrl =
    buildGoogleFormUrl({
        employeeName,
        sourceUserId,
        targetUserId,
        sourceProduct,
        transferProductField,
        completedTheory,
        completedPractice,
        giftLessons,
        totalLessonsToNewPackage,
        transferAmount,
        promoAmount,
        transferNote,
        urgentTransfer
    });

if (openGoogleFormButton) {
    openGoogleFormButton.dataset.formUrl =
        googleFormUrl;

    openGoogleFormButton.classList.remove(
        "hidden"
    );
}

copyBlock.classList.remove("hidden");

    resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/*
 * РЕЖИМ ПЕРЕНОСА
 */

function updateTransferModeInterface() {
    const transferMode = getTransferMode();

    const totalLessons =
        getOptionalNumberValue("totalLessons", 0);

    const completedPractice =
        getOptionalNumberValue("completedPractice", 0);

    const completedTheory =
        getOptionalNumberValue("completedTheory", 0);

    const completedPaidLessons =
        completedPractice + completedTheory;

    const remainingPaidLessons =
        totalLessons - completedPaidLessons;

    if (transferMode === "full") {
        partialTransferFields.classList.add("hidden");
        fullTransferInfo.classList.remove("hidden");

        transferLessonsInput.removeAttribute(
            "data-required-field"
        );

        transferLessonsInput.required = false;
        transferLessonsInput.value = "";

        if (
            Number.isInteger(totalLessons) &&
            totalLessons > 0 &&
            isNonNegativeInteger(completedPractice) &&
            isNonNegativeInteger(completedTheory)
        ) {
            if (remainingPaidLessons > 0) {
                fullTransferText.textContent =
                    `Будет перенесён весь оплаченный остаток: ` +
                    `${formatLessons(remainingPaidLessons)}.`;
            } else if (remainingPaidLessons === 0) {
                fullTransferText.textContent =
                    "Оплаченных занятий для переноса не осталось.";
            } else {
                fullTransferText.textContent =
                    "Количество использованных занятий превышает размер пакета.";
            }
        } else {
            fullTransferText.textContent =
                "Укажите данные исходного пакета и использованных занятий.";
        }
    } else {
        fullTransferInfo.classList.add("hidden");
        partialTransferFields.classList.remove("hidden");

        transferLessonsInput.setAttribute(
            "data-required-field",
            ""
        );

        transferLessonsInput.required = true;

        if (remainingPaidLessons > 1) {
            transferLessonsInput.max =
                String(remainingPaidLessons - 1);

            transferLessonsHint.textContent =
                `Доступный оплаченный остаток: ` +
                `${remainingPaidLessons}. ` +
                `Для частичного переноса можно указать ` +
                `от 1 до ${remainingPaidLessons - 1}.`;
        } else {
            transferLessonsInput.removeAttribute("max");

            transferLessonsHint.textContent =
                "Для частичного переноса на исходном продукте должно остаться хотя бы одно занятие.";
        }
    }
}

function getTransferMode() {
    const selectedMode = document.querySelector(
        'input[name="transferMode"]:checked'
    );

    return selectedMode
        ? selectedMode.value
        : "full";
}

/*
 * ОЧИСТКА
 */

resetButton.addEventListener("click", function () {
    const savedName =
        localStorage.getItem(
            EMPLOYEE_NAME_STORAGE_KEY
        ) || "";

    form.reset();

    updateSubjectOptions(
    sourceClassInput,
    sourceSubjectInput
    );

    updateSubjectOptions(
        targetClassInput,
        targetSubjectInput
    );

    if (employeeNameInput) {
        employeeNameInput.value = savedName;
    }


    calculationCompleted = false;

    resultBlock.classList.add("hidden");
    copyBlock.classList.add("hidden");
    clearGoogleFormLink();

    resultHighlights.innerHTML = "";
    calculationDetails.innerHTML = "";

    transferStatus.textContent = "";
    transferStatus.className = "status-box";

    formText.value = "";

    copyButton.innerHTML =
        "<span>📄</span> Скопировать текст";

    clearFieldErrors();
    updateTransferModeInterface();
    updateProgress();

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/*
 * КОПИРОВАНИЕ
 */

copyButton.addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(formText.value);
        showCopySuccess();
    } catch (error) {
        formText.focus();
        formText.select();

        const copied =
            document.execCommand("copy");

        if (copied) {
            showCopySuccess();
        } else {
            copyButton.textContent =
                "Выделите и скопируйте текст";
        }
    }
});

if (openGoogleFormButton) {
    openGoogleFormButton.addEventListener(
        "click",
        function () {
            const googleFormUrl =
                openGoogleFormButton.dataset.formUrl;

            if (!googleFormUrl) {
                return;
            }

            window.open(
                googleFormUrl,
                "_blank",
                "noopener,noreferrer"
            );
        }
    );
}

/*
 * ПРОГРЕСС
 */

function updateProgress() {
    const currentRequiredFields = Array.from(
        document.querySelectorAll(
            "[data-required-field]"
        )
    );

    const filledFields =
        currentRequiredFields.filter(
            field => isFieldFilled(field)
        ).length;

    let percent = currentRequiredFields.length > 0
        ? Math.round(
            (
                filledFields /
                currentRequiredFields.length
            ) * 100
        )
        : 0;

    if (!calculationCompleted) {
        percent = Math.round(percent * 0.9);
    } else {
        percent = 100;
    }

    progressBar.style.width = `${percent}%`;
    progressPercent.textContent = `${percent}%`;

    updateStepCards();
    updateStepProgress();

    if (calculationCompleted) {
        setPageStatus(
            "calculated",
            "Расчёт выполнен"
        );
        return;
    }

    if (
        filledFields === currentRequiredFields.length
    ) {
        setPageStatus(
            "ready",
            "Готово к расчёту"
        );
    } else {
        setPageStatus(
            "incomplete",
            "Заполнено не всё"
        );
    }
}

function updateStepCards() {
    stepCards.forEach(card => {
        const fields = Array.from(
            card.querySelectorAll(
                "[data-required-field]"
            )
        );

        const cardCompleted =
            fields.length > 0 &&
            fields.every(
                field => isFieldFilled(field)
            );

        card.classList.toggle(
            "step-complete",
            cardCompleted
        );
    });
}

function updateStepProgress() {
    const completedCards =
        stepCards.filter(
            card => card.classList.contains(
                "step-complete"
            )
        ).length;

    progressSteps.forEach((step, index) => {
        step.classList.remove(
            "active",
            "completed"
        );

        const circle = step.querySelector(
            ".progress-step-circle"
        );

        if (index < completedCards) {
            step.classList.add("completed");
            circle.textContent = "✓";
        } else {
            circle.textContent =
                String(index + 1);
        }
    });

    if (calculationCompleted) {
        progressSteps.forEach(step => {
            step.classList.add("completed");

            step.querySelector(
                ".progress-step-circle"
            ).textContent = "✓";
        });
    } else {
        const activeIndex = Math.min(
            completedCards,
            progressSteps.length - 1
        );

        if (progressSteps[activeIndex]) {
            progressSteps[
                activeIndex
            ].classList.add("active");
        }
    }

    progressLines.forEach((line, index) => {
        const lineCompleted =
            calculationCompleted ||
            index < completedCards;

        line.classList.toggle(
            "completed",
            lineCompleted
        );
    });
}

/*
 * ОШИБКИ
 */

function showError(message, fieldId = null) {
    calculationCompleted = false;

    transferStatus.className =
        "status-box status-error";

    transferStatus.textContent =
        `⚠️ ${message}`;

    resultHighlights.innerHTML = "";
    calculationDetails.innerHTML = "";

    copyBlock.classList.add("hidden");
    clearGoogleFormLink();

    setPageStatus(
        "invalid",
        "Есть ошибка"
    );

    if (fieldId) {
        const field =
            document.getElementById(fieldId);

        field.classList.add("field-error");
        field.focus();
    }

    resultBlock.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function clearFieldErrors() {
    document
        .querySelectorAll(".field-error")
        .forEach(field => {
            field.classList.remove(
                "field-error"
            );
        });
}

/*
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 */

function isFieldFilled(field) {
    if (field.tagName === "SELECT") {
        return field.value.trim() !== "";
    }

    if (field.type === "number") {
        return (
            field.value.trim() !== "" &&
            Number.isFinite(
                Number(field.value)
            )
        );
    }

    return field.value.trim() !== "";
}

function setPageStatus(type, text) {
    formStatus.className =
        `form-status status-${type}`;

    formStatusText.textContent = text;
}

function getNumberValue(elementId) {
    const element =
        document.getElementById(elementId);

    return Number(element.value);
}

function getOptionalNumberValue(
    elementId,
    defaultValue
) {
    const element =
        document.getElementById(elementId);

    if (!element || element.value.trim() === "") {
        return defaultValue;
    }

    return Number(element.value);
}

function isNonNegativeInteger(value) {
    return (
        Number.isInteger(value) &&
        value >= 0
    );
}

function updateSubjectOptions(
    classInput,
    subjectInput
) {
    const selectedClass = classInput.value;

    subjectInput.innerHTML = "";

    const placeholderOption =
        document.createElement("option");

    placeholderOption.value = "";

    if (!selectedClass) {
        placeholderOption.textContent =
            "Сначала выберите класс";

        subjectInput.appendChild(
            placeholderOption
        );

        subjectInput.disabled = true;
        return;
    }

    placeholderOption.textContent =
        "Выберите предмет";

    subjectInput.appendChild(
        placeholderOption
    );

    const availableSubjects =
        SUBJECTS_BY_CLASS[selectedClass] || [];

    availableSubjects.forEach(subject => {
        const option =
            document.createElement("option");

        option.value = subject;
        option.textContent = subject;

        subjectInput.appendChild(option);
    });

    subjectInput.disabled = false;
}

function buildProductName(
    subject,
    classNumber,
    grade
) {
    return (
        `${subject}, ` +
        `${classNumber} класс, ` +
        `грейд «${grade}»`
    );
}

function showCopySuccess() {
    copyButton.innerHTML =
        "<span>✓</span> Скопировано";

    setTimeout(function () {
        copyButton.innerHTML =
            "<span>📄</span> Скопировать текст";
    }, 1500);
}

function formatMoney(value) {
    return new Intl.NumberFormat("ru-RU", {
        style: "currency",
        currency: "RUB",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

function formatLessons(value) {
    const lastTwoDigits = value % 100;
    const lastDigit = value % 10;

    let word = "занятий";

    if (
        lastDigit === 1 &&
        lastTwoDigits !== 11
    ) {
        word = "занятие";
    } else if (
        lastDigit >= 2 &&
        lastDigit <= 4 &&
        (
            lastTwoDigits < 12 ||
            lastTwoDigits > 14
        )
    ) {
        word = "занятия";
    }

    return `${value} ${word}`;
}

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function clearGoogleFormLink() {
    if (!openGoogleFormButton) {
        return;
    }

    openGoogleFormButton.classList.add("hidden");
    openGoogleFormButton.dataset.formUrl = "";
}

function buildGoogleFormUrl(data) {
    const params = new URLSearchParams();

    params.set("usp", "pp_url");

    params.set(
        "entry.964243843",
        data.employeeName
    );

    params.set(
        "entry.1633974462",
        data.sourceUserId
    );

    params.set(
        "entry.133315870",
        data.targetUserId
    );

    params.set(
        "entry.443234686",
        data.sourceProduct
    );

    params.set(
        "entry.1872012226",
        data.transferProductField
    );

    params.set(
        "entry.2096418987",
        String(data.completedTheory)
    );

    params.set(
        "entry.809093766",
        String(data.completedPractice)
    );

    params.set(
        "entry.1217915706",
        String(data.giftLessons)
    );

    params.set(
        "entry.1922523051",
        String(data.totalLessonsToNewPackage)
    );

    params.set(
        "entry.872425280",
        formatNumberForGoogleForm(
            data.transferAmount
        )
    );

    if (data.promoAmount > 0) {
        params.set(
            "entry.1318316300",
            formatNumberForGoogleForm(
                data.promoAmount
            )
        );
    }

    if (data.transferNote) {
        params.set(
            "entry.1632194400",
            data.transferNote
        );
    }

    if (data.urgentTransfer) {
        params.set(
            "entry.1857080703",
            "Горит"
        );
    }

    return (
        "https://docs.google.com/forms/d/e/" +
        "1FAIpQLSczE07d5BuxN2ppiB96cGfmA51R_9T9DvFfjvD1Y3-38Z4RxA/" +
        "viewform?" +
        params.toString()
    );
}


function formatNumberForGoogleForm(value) {
    return Number(value.toFixed(2)).toString();
}

function buildTransferProductField({
    transferMode,
    sourceSubject,
    sourceClass,
    sourceGrade,
    targetSubject,
    targetClass,
    targetGrade,
    paidLessonsLeft,
    transferLessons
}) {
    const targetPart =
        buildPackageProductName(
            targetSubject,
            targetClass,
            transferLessons,
            targetGrade
        );

    /*
     * При полном переносе на исходном продукте
     * оплаченных занятий не остаётся.
     */
    if (transferMode === "full") {
        return targetPart;
    }

    const sourcePart =
        buildPackageProductName(
            sourceSubject,
            sourceClass,
            paidLessonsLeft
        );

    return `${sourcePart}, ${targetPart}`;
}

function buildPackageProductName(
    subject,
    classNumber,
    lessons,
    grade = ""
) {
    const gradePart =
        grade ? ` ${grade}` : "";

    return (
        `Занятия с репетитором | ` +
        `${subject} ${classNumber} класс ` +
        `(${formatLessons(lessons)})` +
        gradePart
    );
}
