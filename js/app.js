/* =========================
   EXPENSE TRACKER APP
========================= */
let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
let budget = Number(localStorage.getItem("budget")) || 0;
let categoryChart;
let incomeExpenseChart;
const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
const searchInput = document.querySelector('input[type="search"]');
const balanceElement = document.querySelector(".hero-card h2");
const statValues = document.querySelectorAll(".stat-card p");
const totalBalance = statValues[0];
const totalIncome = statValues[1];
const totalExpense = statValues[2];
const monthlyBudgetCard = statValues[3];
const titleInput = document.querySelector('input[placeholder="Transaction Title"]');
const amountInput = document.querySelector('input[placeholder="Amount"]');
const typeInput = document.querySelectorAll("select")[0];
const categoryInput = document.querySelectorAll("select")[1];
const dateInput = document.querySelector('input[type="date"]');
const notesInput = document.querySelector("textarea");
const editIdInput = document.getElementById("editId");
const saveBtn = document.getElementById("saveBtn");
const budgetInput = document.getElementById("budgetInput");
const budgetBtn = document.getElementById("budgetBtn");
const budgetAmount = document.getElementById("budgetAmount");
const remainingBudget = document.getElementById("remainingBudget");
const progressBar = document.getElementById("progressBar");
const typeFilter = document.getElementById("typeFilter");
const sortFilter = document.getElementById("sortFilter");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const themeToggle = document.getElementById("themeToggle");
/* =========================
   ADD / UPDATE TRANSACTION
========================= */
form.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;
    const category = categoryInput.value;
    const date = dateInput.value;
    const notes = notesInput.value.trim();
    if (!title || !amount || type === "Select Type") {
        alert("Please fill required fields");
        return;
    }
    const editId = editIdInput.value;
    if (editId) {
        transactions = transactions.map(item => item.id == editId ? { ...item, title, amount, type, category, date, notes } : item);
    } else {
        transactions.push({ id: Date.now(), title, amount, type, category, date, notes });
    }
    saveTransactions();
    form.reset();
    editIdInput.value = "";
    saveBtn.innerText = "Add Transaction";
    renderTransactions();
    updateDashboard();
    updateBudget();
});
/* =========================
   SAVE DATA
========================= */
function saveTransactions() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
}
/* =========================
   DISPLAY TRANSACTIONS
========================= */
function renderTransactions(data = transactions) {
    transactionList.innerHTML = "";
    if (data.length === 0) {
        transactionList.innerHTML = "<p>No transactions available.</p>";
        return;
    }
    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "transaction-item";
        div.innerHTML = `<div><h4>${item.title}</h4><p>${item.category || "Other"} - ${item.date || "No date"}</p></div><div><strong class="${item.type}">${item.type === "Income" ? "+" : "-"}$${item.amount.toFixed(2)}</strong><button type="button" onclick="editTransaction(${item.id})">Edit</button> <button type="button" onclick="deleteTransaction(${item.id})">Delete</button></div>`;
        transactionList.appendChild(div);
    });
}
/* =========================
   DELETE TRANSACTION
========================= */
function deleteTransaction(id) {
    transactions = transactions.filter(item => item.id !== id);
    saveTransactions();
    renderTransactions();
    updateDashboard();
    updateBudget();
}
/* =========================
   EDIT TRANSACTION
========================= */
function editTransaction(id) {
    const transaction = transactions.find(item => item.id === id);
    if (!transaction) return;
    titleInput.value = transaction.title;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;
    categoryInput.value = transaction.category;
    dateInput.value = transaction.date;
    notesInput.value = transaction.notes;
    editIdInput.value = transaction.id;
    saveBtn.innerText = "Update Transaction";
    document.querySelector(".transaction-section").scrollIntoView({ behavior: "smooth" });
    titleInput.focus();
}
/* =========================
   DASHBOARD UPDATE
========================= */
function updateDashboard() {
    let income = 0;
    let expense = 0;
    transactions.forEach(item => {
        if (item.type === "Income") income += item.amount;
        else if (item.type === "Expense") expense += item.amount;
    });
    const balance = income - expense;
    balanceElement.innerText = `$${balance.toFixed(2)}`;
    totalBalance.innerText = `$${balance.toFixed(2)}`;
    totalIncome.innerText = `$${income.toFixed(2)}`;
    totalExpense.innerText = `$${expense.toFixed(2)}`;
    updateCharts();
}
/* =========================
   SEARCH
========================= */
searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase().trim();
    const filtered = transactions.filter(item => item.title.toLowerCase().includes(value) || (item.category || "").toLowerCase().includes(value));
    renderTransactions(filtered);
});
/* =========================
   BUDGET MANAGEMENT
========================= */
budgetBtn.addEventListener("click", function () {
    const value = Number(budgetInput.value);
    if (value <= 0) {
        alert("Please enter a valid budget");
        return;
    }
    budget = value;
    localStorage.setItem("budget", budget);
    updateBudget();
    budgetInput.value = "";
});
function updateBudget() {
    let expense = 0;
    transactions.forEach(item => {
        if (item.type === "Expense") expense += item.amount;
    });
    budgetAmount.innerText = `$${Number(budget).toFixed(2)}`;
    monthlyBudgetCard.innerText = `$${Number(budget).toFixed(2)}`;
    const remaining = budget - expense;
    remainingBudget.innerText = `Remaining: $${remaining.toFixed(2)}`;
    const percentage = budget > 0 ? Math.min((expense / budget) * 100, 100) : 0;
    progressBar.style.width = `${percentage}%`;
    progressBar.style.background = percentage >= 90 ? "#dc2626" : percentage >= 70 ? "#f59e0b" : "#2563eb";
}
/* =========================
   FILTERS + SORTING
========================= */
function applyFilters() {
    let data = [...transactions];
    const type = typeFilter.value;
    const sort = sortFilter.value;
    if (type !== "All") data = data.filter(item => item.type === type);
    if (sort === "latest") data.sort((a, b) => b.id - a.id);
    if (sort === "oldest") data.sort((a, b) => a.id - b.id);
    if (sort === "high") data.sort((a, b) => b.amount - a.amount);
    if (sort === "low") data.sort((a, b) => a.amount - b.amount);
    renderTransactions(data);
}
typeFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);
/* =========================
   ANALYTICS CHARTS
========================= */
function getChartTextColor() {
    return document.body.classList.contains("dark-mode") ? "#f1f5f9" : "#374151";
}
function updateCharts() {
    if (typeof Chart === "undefined") return;
    const categoryData = {};
    let income = 0;
    let expense = 0;
    transactions.forEach(item => {
        if (item.type === "Expense") {
            const category = item.category && item.category !== "Category" ? item.category : "Other";
            categoryData[category] = (categoryData[category] || 0) + item.amount;
            expense += item.amount;
        } else if (item.type === "Income") {
            income += item.amount;
        }
    });
    const categoryCtx = document.getElementById("categoryChart");
    if (categoryChart) categoryChart.destroy();
    categoryChart = new Chart(categoryCtx, {
        type: "doughnut",
        data: {
            labels: Object.keys(categoryData),
            datasets: [{
                data: Object.values(categoryData),
                backgroundColor: ["#2563eb", "#16a34a", "#f59e0b", "#dc2626", "#8b5cf6", "#06b6d4"],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: getChartTextColor() }
                }
            }
        }
    });
    const incomeCtx = document.getElementById("incomeExpenseChart");
    if (incomeExpenseChart) incomeExpenseChart.destroy();
    incomeExpenseChart = new Chart(incomeCtx, {
        type: "bar",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                label: "Amount",
                data: [income, expense],
                backgroundColor: ["#16a34a", "#dc2626"],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: { color: getChartTextColor() }
                }
            },
            scales: {
                x: {
                    ticks: { color: getChartTextColor() },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: getChartTextColor() },
                    grid: { color: "rgba(148,163,184,.12)" }
                }
            }
        }
    });
}
/* =========================
   EXPORT / IMPORT DATA
========================= */
exportBtn.addEventListener("click", function () {
    const backup = { transactions, budget, exportedAt: new Date().toISOString() };
    const data = JSON.stringify(backup, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "expense-tracker-backup.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
});
importBtn.addEventListener("click", function () {
    const file = importFile.files[0];
    if (!file) {
        alert("Please select JSON file");
        return;
    }
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                transactions = imported;
            } else {
                transactions = Array.isArray(imported.transactions) ? imported.transactions : [];
                if (imported.budget !== undefined) {
                    budget = Number(imported.budget) || 0;
                    localStorage.setItem("budget", budget);
                }
            }
            saveTransactions();
            renderTransactions();
            updateDashboard();
            updateBudget();
            importFile.value = "";
            alert("Data imported successfully");
        } catch (error) {
            alert("Invalid JSON file");
        }
    };
    reader.readAsText(file);
});
/* =========================
   DARK MODE
========================= */
function applyTheme(theme) {
    if (theme === "dark") {
        document.body.classList.add("dark-mode");
        themeToggle.innerText = "☀️ Light Mode";
    } else {
        document.body.classList.remove("dark-mode");
        themeToggle.innerText = "🌙 Dark Mode";
    }
}
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);
themeToggle.addEventListener("click", function () {
    const isDark = document.body.classList.contains("dark-mode");
    const newTheme = isDark ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    updateCharts();
});
/* =========================
   HERO + NAV INTERACTIONS
========================= */
const heroAddBtn = document.querySelector(".hero-content button");
if (heroAddBtn) {
    heroAddBtn.addEventListener("click", () => {
        document.querySelector(".transaction-section").scrollIntoView({ behavior: "smooth" });
        titleInput.focus();
    });
}
const navLinks = document.querySelectorAll(".header nav a");
if (navLinks.length >= 3) {
    navLinks[0].addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(".hero").scrollIntoView({ behavior: "smooth" });
    });
    navLinks[1].addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(".transactions").scrollIntoView({ behavior: "smooth" });
    });
    navLinks[2].addEventListener("click", e => {
        e.preventDefault();
        document.querySelector(".budget").scrollIntoView({ behavior: "smooth" });
    });
}
/* =========================
   INITIAL LOAD
========================= */
renderTransactions();
updateDashboard();
updateBudget();