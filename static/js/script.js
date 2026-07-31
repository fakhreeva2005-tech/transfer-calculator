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

const sourceClassInput =
    document.getElementById("sourceClass");

const sourceSubjectInput =
    document.getElementById("sourceSubject");

const progressBar = document.getElementById("progressBar");
const progressPercent =
    document.getElementById("progressPercent");

const formStatus = document.getElementById("formStatus");
const formStatusText =
    document.getElementById("formStatusText");

const targetProductsContainer =
    document.getElementById("targetProductsContainer");

const addTargetProductButton =
    document.getElementById("addTargetProductButton");

const distributionSummaryText =
    document.getElementById("distributionSummaryText");

let targetProductCounter = 0;

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
        "Математика",
        "Русский язык"
    ],

    "6": [
        "Математика",
        "Русский язык"
    ],

    "7": [
        "Английский язык",
        "Биология",
        "История",
        "Математика",
        "Обществознание",
        "Русский язык",
        "Физика"
    ],

    "8": [
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


updateSubjectOptions(
    sourceClassInput,
    sourceSubjectInput
);

addTargetProduct();

addTargetProductButton.addEventListener(
    "click",
    function () {
        if (getTransferMode() === "full") {
            return;
        }

        addTargetProduct();
        updateDistributionSummary();
        updateProgress();
    }
);

updateTransferModeInterface();
updateProgress();

/*
 * ДИНАМИЧЕСКИЕ НОВЫЕ ПРОДУКТЫ
 */

function addTargetProduct() {
    targetProductCounter += 1;

    const productCard = document.createElement("div");

    productCard.className = "target-product-card";
    productCard.dataset.targetProductId =
        String(targetProductCounter);

    productCard.innerHTML = `
        <div class="target-product-header">

            <h3 class="target-product-title">
                Новый продукт
            </h3>

            <button
                type="button"
                class="remove-target-product-button"
                aria-label="Удалить новый продукт"
            >
                Удалить
            </button>

        </div>

        <div class="grid">

            <div class="form-group">

                <label>
                    Новый класс
                </label>

                <select
                    class="target-class"
                    data-required-field
                    required
                >
                    <option value="">
                        Выберите класс
                    </option>

                    <option value="5">5 класс</option>
                    <option value="6">6 класс</option>
                    <option value="7">7 класс</option>
                    <option value="8">8 класс</option>
                    <option value="9">9 класс</option>
                    <option value="10">10 класс</option>
                    <option value="11">11 класс</option>
                </select>

            </div>

            <div class="form-group">

                <label>
                    Новый предмет
                </label>

                <select
                    class="target-subject"
                    data-required-field
                    required
                    disabled
                >
                    <option value="">
                        Сначала выберите класс
                    </option>
                </select>

            </div>

            <div class="form-group">

                <label>
                    Новый грейд
                </label>

                <select
                    class="target-grade"
                    data-required-field
                    required
                >
                    <option value="">
                        Выберите грейд
                    </option>

                    <option value="Компетентный">
                        Компетентный
                    </option>

                    <option value="Профессионал">
                        Профессионал
                    </option>

                    <option value="Эксперт">
                        Эксперт
                    </option>
                </select>

            </div>

            <div class="form-group">

                <label>
                    Оплаченных занятий
                </label>

                <input
                    type="number"
                    class="target-paid-lessons"
                    min="1"
                    step="1"
                    placeholder="Например, 10"
                    data-required-field
                    required
                >

                <small class="field-hint">
                    Количество оплаченных занятий,
                    которое переносится на этот предмет.
                </small>

            </div>

            <div class="form-group">

                <label>
                    Подарочных занятий
                </label>

                <input
                    type="number"
                    class="target-gift-lessons"
                    min="0"
                    step="1"
                    placeholder="Например, 2"
                    value="0"
                    data-required-field
                    required
                >

                <small class="field-hint">
                    Можно указать 0.
                    Общая сумма должна совпасть
                    с подарочным остатком.
                </small>

            </div>

        </div>
    `;

    targetProductsContainer.appendChild(productCard);

    const classInput =
        productCard.querySelector(".target-class");

    const subjectInput =
        productCard.querySelector(".target-subject");

    const removeButton =
        productCard.querySelector(
            ".remove-target-product-button"
        );

    classInput.addEventListener("change", function () {
        updateSubjectOptions(
            classInput,
            subjectInput
        );

        markCalculationAsChanged();
    });

    productCard.addEventListener("input", function () {
        markCalculationAsChanged();
        updateDistributionSummary();
    });

    productCard.addEventListener("change", function () {
        markCalculationAsChanged();
        updateDistributionSummary();
    });

    removeButton.addEventListener("click", function () {
        removeTargetProduct(productCard);
    });

    updateTargetProductCards();
    updateTransferModeInterface();
}

function removeTargetProduct(productCard) {
    const cards = getTargetProductCards();

    if (cards.length <= 1) {
        showError(
            "Должен остаться хотя бы один новый продукт."
        );
        return;
    }

    productCard.remove();

    calculationCompleted = false;
    clearGoogleFormLink();

    updateTargetProductCards();
    updateDistributionSummary();
    updateProgress();
}

function getTargetProductCards() {
    return Array.from(
        targetProductsContainer.querySelectorAll(
            ".target-product-card"
        )
    );
}

function updateTargetProductCards() {
    const cards = getTargetProductCards();

    cards.forEach((card, index) => {
        const title =
            card.querySelector(".target-product-title");

        const removeButton =
            card.querySelector(
                ".remove-target-product-button"
            );

        title.textContent =
            `Новый продукт №${index + 1}`;

        removeButton.classList.toggle(
            "hidden",
            cards.length === 1
        );
    });
}

function markCalculationAsChanged() {
    calculationCompleted = false;

    clearGoogleFormLink();
    clearFieldErrors();
    updateProgress();
}

function collectTargetProducts() {
    return getTargetProductCards().map(
        (card, index) => {
            const classInput =
                card.querySelector(".target-class");

            const subjectInput =
                card.querySelector(".target-subject");

            const gradeInput =
                card.querySelector(".target-grade");

            const paidLessonsInput =
                card.querySelector(
                    ".target-paid-lessons"
                );

            const giftLessonsInput =
                card.querySelector(
                    ".target-gift-lessons"
                );

            return {
                index: index + 1,
                card,
                classInput,
                subjectInput,
                gradeInput,
                paidLessonsInput,
                giftLessonsInput,

                classNumber:
                    classInput.value,

                subject:
                    subjectInput.value,

                grade:
                    gradeInput.value,

                paidLessons:
                    Number(paidLessonsInput.value),

                giftLessons:
                    giftLessonsInput.value.trim() === ""
                        ? 0
                        : Number(giftLessonsInput.value)
            };
        }
    );
}

function updateDistributionSummary() {
    if (!distributionSummaryText) {
        return;
    }

    const totalLessons =
        getOptionalNumberValue("totalLessons", 0);

    const completedPractice =
        getOptionalNumberValue(
            "completedPractice",
            0
        );

    const completedTheory =
        getOptionalNumberValue(
            "completedTheory",
            0
        );

    const giftLessons =
        getOptionalNumberValue("giftLessons", 0);

    const remainingPaidLessons =
        totalLessons -
        completedPractice -
        completedTheory;

    const targetProducts =
        collectTargetProducts();

    const distributedPaidLessons =
        targetProducts.reduce(
            (sum, product) => {
                return (
                    sum +
                    (
                        Number.isFinite(
                            product.paidLessons
                        )
                            ? product.paidLessons
                            : 0
                    )
                );
            },
            0
        );

    const distributedGiftLessons =
        targetProducts.reduce(
            (sum, product) => {
                return (
                    sum +
                    (
                        Number.isFinite(
                            product.giftLessons
                        )
                            ? product.giftLessons
                            : 0
                    )
                );
            },
            0
        );

    const paidLessonsLeft =
        remainingPaidLessons -
        distributedPaidLessons;

    distributionSummaryText.textContent =
        `Доступно оплаченных: ` +
        `${Math.max(remainingPaidLessons, 0)}. ` +
        `Распределено оплаченных: ` +
        `${distributedPaidLessons}. ` +
        `Осталось оплаченных: ` +
        `${paidLessonsLeft}. ` +
        `Подарочных распределено: ` +
        `${distributedGiftLessons} из ` +
        `${Math.max(giftLessons, 0)}.`;
}

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

    const targetProducts =
        collectTargetProducts();

    const transferLessons =
        targetProducts.reduce(
            (sum, product) =>
                sum + product.paidLessons,
            0
        );

    const distributedGiftLessons =
        targetProducts.reduce(
            (sum, product) =>
                sum + product.giftLessons,
            0
        );

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


    /*
     * ПРОВЕРКИ НОВЫХ ПРОДУКТОВ
     */

    if (targetProducts.length === 0) {
        showError(
            "Добавьте хотя бы один новый продукт."
        );
        return;
    }

    const sourceGroup =
        getClassGroup(sourceClass);

    for (const product of targetProducts) {
        if (!product.classNumber) {
            showError(
                `Выберите класс для нового продукта №${product.index}.`
            );

            product.classInput.classList.add(
                "field-error"
            );

            product.classInput.focus();
            return;
        }

        if (!product.subject) {
            showError(
                `Выберите предмет для нового продукта №${product.index}.`
            );

            product.subjectInput.classList.add(
                "field-error"
            );

            product.subjectInput.focus();
            return;
        }

        if (!product.grade) {
            showError(
                `Выберите грейд для нового продукта №${product.index}.`
            );

            product.gradeInput.classList.add(
                "field-error"
            );

            product.gradeInput.focus();
            return;
        }

        const targetGroup =
            getClassGroup(product.classNumber);

        if (sourceGroup !== targetGroup) {
            showError(
                `Новый продукт №${product.index}: ` +
                "перенос возможен только внутри групп " +
                "5–6 классов или 7–11 классов. " +
                "Клиенту необходимо обратиться в группу " +
                "возвратов и переносов."
            );

            product.classInput.classList.add(
                "field-error"
            );

            product.classInput.focus();
            return;
        }

        if (sourceGrade !== product.grade) {
            showError(
                `Новый продукт №${product.index}: ` +
                "перенос между разными грейдами невозможен. " +
                "Клиенту необходимо обратиться в группу " +
                "возвратов и переносов."
            );

            product.gradeInput.classList.add(
                "field-error"
            );

            product.gradeInput.focus();
            return;
        }

        if (
            !Number.isInteger(product.paidLessons) ||
            product.paidLessons <= 0
        ) {
            showError(
                `Укажите целое количество оплаченных занятий ` +
                `больше нуля для нового продукта №${product.index}.`
            );

            product.paidLessonsInput.classList.add(
                "field-error"
            );

            product.paidLessonsInput.focus();
            return;
        }

        if (
            !Number.isInteger(product.giftLessons) ||
            product.giftLessons < 0
        ) {
            showError(
                `Количество подарочных занятий для нового ` +
                `продукта №${product.index} должно быть ` +
                "целым числом от нуля."
            );

            product.giftLessonsInput.classList.add(
                "field-error"
            );

            product.giftLessonsInput.focus();
            return;
        }
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
     * ПРОВЕРКА РАСПРЕДЕЛЕНИЯ ЗАНЯТИЙ
     */

    if (transferLessons > remainingPaidLessons) {
        showError(
            `Распределено ${transferLessons} оплаченных занятий, ` +
            `но доступный остаток составляет только ` +
            `${remainingPaidLessons}.`
        );
        return;
    }

    if (
        transferMode === "full" &&
        transferLessons !== remainingPaidLessons
    ) {
        showError(
            `При полном переносе необходимо распределить ` +
            `все ${remainingPaidLessons} оплаченных занятий. ` +
            `Сейчас распределено ${transferLessons}.`
        );
        return;
    }

    if (
        transferMode === "partial" &&
        targetProducts.length < 2
    ) {
        showError(
            "При частичном переносе добавьте минимум два новых продукта."
        );
        return;
    }

    if (
        transferMode === "full" &&
        targetProducts.length > 1
    ) {
        showError(
            "При полном переносе можно указать только один новый продукт."
        );
        return;
    }

    if (distributedGiftLessons !== giftLessons) {
        showError(
            `Распределите все подарочные занятия. ` +
            `Доступно ${giftLessons}, ` +
            `распределено ${distributedGiftLessons}.`
        );
        return;
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

    const amountLeftOnSource =
        lessonPrice * paidLessonsLeft;

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

    const targetProductLines =
        targetProducts.map(product => {
            const totalProductLessons =
                product.paidLessons +
                product.giftLessons;

            return buildPackageProductName(
                product.subject,
                product.classNumber,
                totalProductLessons,
                product.grade
            );
        });

    const transferProductParts = [];

    if (
        transferMode === "partial" &&
        paidLessonsLeft > 0
    ) {
        transferProductParts.push(
            buildPackageProductName(
                sourceSubject,
                sourceClass,
                paidLessonsLeft,
                sourceGrade
            )
        );
    }

    transferProductParts.push(...targetProductLines);

    const transferProductField =
        transferProductParts.join(" / ");

    const lessonsForFormParts = [];

    if (
        transferMode === "partial" &&
        paidLessonsLeft > 0
    ) {
        lessonsForFormParts.push(
            `${sourceSubject}, ${sourceClass} класс — ` +
            `${formatLessons(paidLessonsLeft)}`
        );
    }

    targetProducts.forEach(product => {
        const totalProductLessons =
            product.paidLessons +
            product.giftLessons;

        const giftPart =
            product.giftLessons > 0
                ? `, из них ${formatLessons(product.giftLessons)} подарочных`
                : "";

        lessonsForFormParts.push(
            `${product.subject}, ` +
            `${product.classNumber} класс — ` +
            `${formatLessons(totalProductLessons)}` +
            giftPart
        );
    });

    const lessonsForForm =
        lessonsForFormParts.join(" / ");

    const transferAmountParts = [];

    if (
        transferMode === "partial" &&
        paidLessonsLeft > 0
    ) {
        transferAmountParts.push(
            `${sourceSubject}, ${sourceClass} класс — ` +
            `${formatNumberForGoogleForm(amountLeftOnSource)}`
        );
    }

    targetProducts.forEach(product => {
        const productAmount =
            lessonPrice * product.paidLessons;

        transferAmountParts.push(
            `${product.subject}, ` +
            `${product.classNumber} класс — ` +
            `${formatNumberForGoogleForm(productAmount)}`
        );
    });

    const transferAmountForForm =
        transferMode === "full" &&
        targetProducts.length === 1
            ? formatNumberForGoogleForm(
                transferAmount
            )
            : transferAmountParts.join(" / ");



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

    const transferAmountForTextParts = [];

    if (
        transferMode === "partial" &&
        paidLessonsLeft > 0
    ) {
        transferAmountForTextParts.push(
            `${sourceSubject}, ${sourceClass} класс — ` +
            `${formatMoney(amountLeftOnSource)}`
        );
    }

    targetProducts.forEach(product => {
        const productAmount =
            lessonPrice * product.paidLessons;

        transferAmountForTextParts.push(
            `${product.subject}, ` +
            `${product.classNumber} класс — ` +
            `${formatMoney(productAmount)}`
        );
    });

    const transferAmountForText =
        transferAmountForTextParts.join(" / ");

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
${lessonsForForm}

Сумма переноса:
${transferAmountForText}

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
        lessonsForForm,
        transferAmount,
        transferAmountForForm,
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
        getOptionalNumberValue(
            "completedPractice",
            0
        );

    const completedTheory =
        getOptionalNumberValue(
            "completedTheory",
            0
        );

    const remainingPaidLessons = Math.max(
        totalLessons -
        completedPractice -
        completedTheory,
        0
    );

    const productCards = getTargetProductCards();

    if (transferMode === "full") {
        /*
         * При полном переносе должен остаться
         * только один новый продукт.
         */
        productCards
            .slice(1)
            .forEach(card => card.remove());

        const firstCard =
            getTargetProductCards()[0];

        if (firstCard) {
            const paidLessonsInput =
                firstCard.querySelector(
                    ".target-paid-lessons"
                );

            if (paidLessonsInput) {
                paidLessonsInput.value =
                    remainingPaidLessons > 0
                        ? String(remainingPaidLessons)
                        : "";

                paidLessonsInput.readOnly = true;
                paidLessonsInput.classList.add(
                    "auto-filled-field"
                );
            }
        }

        addTargetProductButton.disabled = true;
        addTargetProductButton.classList.add(
            "button-disabled"
        );
    } else {
        const firstCard =
            getTargetProductCards()[0];

        if (firstCard) {
            const paidLessonsInput =
                firstCard.querySelector(
                    ".target-paid-lessons"
                );

            if (
                paidLessonsInput &&
                paidLessonsInput.readOnly
            ) {
                paidLessonsInput.value = "";
                paidLessonsInput.readOnly = false;

                paidLessonsInput.classList.remove(
                    "auto-filled-field"
                );
            }
        }

        addTargetProductButton.disabled = false;
        addTargetProductButton.classList.remove(
            "button-disabled"
        );
    }

    updateTargetProductCards();
    updateDistributionSummary();
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

    targetProductsContainer.innerHTML = "";
    targetProductCounter = 0;

    addTargetProduct();

    updateSubjectOptions(
    sourceClassInput,
    sourceSubjectInput
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
    updateDistributionSummary();
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

function getClassGroup(classNumber) {
    const classValue = Number(classNumber);

    if (classValue >= 5 && classValue <= 6) {
        return 1;
    }

    if (classValue >= 7 && classValue <= 11) {
        return 2;
    }

    return null;
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
        data.lessonsForForm
    );

    params.set(
        "entry.872425280",
        data.transferAmountForForm
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
