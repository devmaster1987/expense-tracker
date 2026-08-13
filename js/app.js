/* =========================
   EXPENSE TRACKER APP
========================= */


let transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];

let budget =
    localStorage.getItem("budget")
    ||
    0;

    let categoryChart;
let incomeExpenseChart;



const form = document.getElementById("transactionForm");

const transactionList = document.getElementById(
    "transactionList"
);


const searchInput = document.querySelector(
    'input[type="search"]'
);



// Dashboard Elements

const balanceElement =
    document.querySelector(".hero-card h2");



const totalBalance =
    document.querySelectorAll(".stat-card p")[0];


const totalIncome =
    document.querySelectorAll(".stat-card p")[1];


const totalExpense =
    document.querySelectorAll(".stat-card p")[2];

const monthlyBudgetCard =
    document.querySelectorAll(".stat-card p")[3];




// Form Elements

const titleInput =
    document.querySelector(
        'input[placeholder="Transaction Title"]'
    );


const amountInput =
    document.querySelector(
        'input[placeholder="Amount"]'
    );


const typeInput =
    document.querySelectorAll("select")[0];


const categoryInput =
    document.querySelectorAll("select")[1];


const dateInput =
    document.querySelector(
        'input[type="date"]'
    );


const notesInput =
    document.querySelector(
        "textarea"
    );





/* =========================
   ADD / UPDATE TRANSACTION
========================= */


form.addEventListener(
    "submit",
    function (e) {


        e.preventDefault();



        const title = titleInput.value.trim();

        const amount = Number(
            amountInput.value
        );

        const type = typeInput.value;

        const category = categoryInput.value;

        const date = dateInput.value;

        const notes = notesInput.value;



        if (!title || !amount || !type) {

            alert(
                "Please fill required fields"
            );

            return;

        }



        const transaction = {


            id: Date.now(),

            title,

            amount,

            type,

            category,

            date,

            notes


        };





        const editId =
            document.getElementById(
                "editId"
            ).value;




        // Update existing transaction

        if (editId) {


            transactions =
                transactions.map(
                    (item) =>

                        item.id == editId
                            ?
                            {
                                ...item,
                                ...transaction,
                                id: Number(editId)
                            }
                            :
                            item

                );



        }


        // Add new transaction

        else {


            transactions.push(transaction);


        }




        saveTransactions();



        form.reset();


        document.getElementById(
            "editId"
        ).value = "";



        document.getElementById(
            "saveBtn"
        ).innerText =
            "Add Transaction";



        renderTransactions();

        updateDashboard();



    }

);







/* =========================
   SAVE DATA
========================= */


function saveTransactions() {


    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


}








/* =========================
   DISPLAY TRANSACTIONS
========================= */


function renderTransactions(
    data = transactions
) {


    transactionList.innerHTML = "";



    if (data.length === 0) {


        transactionList.innerHTML = `

<p>
No transactions available.
</p>

`;

        return;

    }





    data.forEach(
        (item) => {


            const div =
                document.createElement(
                    "div"
                );


            div.classList.add(
                "transaction-item"
            );



            div.innerHTML = `

<div>

<h4>
${item.title}
</h4>

<p>
${item.category || "Other"} -
${item.date}
</p>

</div>


<div>

<strong class="${item.type}">
${item.type === "Income" ? "+" : "-"}
$${item.amount}
</strong>


<button onclick="editTransaction(${item.id})">
Edit
</button>


<button onclick="deleteTransaction(${item.id})">
Delete
</button>


</div>

`;



            transactionList.appendChild(div);


        }

    );


}








/* =========================
   DELETE TRANSACTION
========================= */


function deleteTransaction(id) {


    transactions =
        transactions.filter(
            (item) => item.id !== id
        );



    saveTransactions();


    renderTransactions();


    updateDashboard();


}







/* =========================
   EDIT TRANSACTION
========================= */


function editTransaction(id) {



    const transaction =
        transactions.find(
            (item) => item.id === id
        );



    if (!transaction)
        return;




    titleInput.value =
        transaction.title;


    amountInput.value =
        transaction.amount;


    typeInput.value =
        transaction.type;


    categoryInput.value =
        transaction.category;


    dateInput.value =
        transaction.date;


    notesInput.value =
        transaction.notes;



    document.getElementById(
        "editId"
    ).value =
        transaction.id;



    document.getElementById(
        "saveBtn"
    ).innerText =
        "Update Transaction";



    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });


}







/* =========================
   DASHBOARD UPDATE
========================= */


function updateDashboard() {


    let income = 0;

    let expense = 0;



    transactions.forEach(
        (item) => {


            if (item.type === "Income") {

                income += item.amount;

            }

            else {

                expense += item.amount;

            }


        }

    );



    let balance =
        income - expense;



    balanceElement.innerText =
        `$${balance}`;


    totalBalance.innerText =
        `$${balance}`;


    totalIncome.innerText =
        `$${income}`;


    totalExpense.innerText =
        `$${expense}`;

updateCharts();

}







/* =========================
   SEARCH
========================= */


searchInput.addEventListener(
    "input",
    function () {


        const value =
            this.value.toLowerCase();



        const filtered =
            transactions.filter(
                (item) =>

                    item.title
                        .toLowerCase()
                        .includes(value)

            );



        renderTransactions(filtered);



    }

);












/* =========================
   BUDGET MANAGEMENT
========================= */


const budgetInput =
    document.getElementById(
        "budgetInput"
    );


const budgetBtn =
    document.getElementById(
        "budgetBtn"
    );



const budgetAmount =
    document.getElementById(
        "budgetAmount"
    );



const remainingBudget =
    document.getElementById(
        "remainingBudget"
    );



const progressBar =
    document.getElementById(
        "progressBar"
    );




budgetBtn.addEventListener(
    "click",
    function () {


        budget =
            Number(
                budgetInput.value
            );



        localStorage.setItem(
            "budget",
            budget
        );



        updateBudget();



        budgetInput.value = "";


    }

);





function updateBudget() {


    let expense = 0;


    transactions.forEach(
        (item) => {

            if (item.type === "Expense") {

                expense += item.amount;

            }

        });


    budgetAmount.innerText =
        `$${budget}`;


    monthlyBudgetCard.innerText =
        `$${budget}`;



    let remaining =
        budget - expense;



    remainingBudget.innerText =
        `Remaining: $${remaining}`;


}




/* =========================
   INITIAL LOAD
========================= */


renderTransactions();


updateDashboard();


updateBudget();


const typeFilter =
    document.getElementById(
        "typeFilter"
    );


const sortFilter =
    document.getElementById(
        "sortFilter"
    );




function applyFilters() {


    let data = [...transactions];



    const type =
        typeFilter.value;



    if (type !== "All") {


        data =
            data.filter(
                (item) =>
                    item.type === type
            );


    }




    const sort =
        sortFilter.value;



    if (sort === "latest") {


        data.sort(
            (a, b) =>
                b.id - a.id
        );


    }


    if (sort === "oldest") {


        data.sort(
            (a, b) =>
                a.id - b.id
        );


    }



    if (sort === "high") {


        data.sort(
            (a, b) =>
                b.amount - a.amount
        );


    }



    if (sort === "low") {


        data.sort(
            (a, b) =>
                a.amount - b.amount
        );


    }



    renderTransactions(data);



}






typeFilter.addEventListener(
    "change",
    applyFilters
);



sortFilter.addEventListener(
    "change",
    applyFilters
);





/* =========================
   ANALYTICS CHARTS
========================= */


function updateCharts() {


    const categoryData = {};

    let income = 0;

    let expense = 0;



    transactions.forEach(
        (item) => {


            if (item.type === "Expense") {


                categoryData[item.category] =
                    (categoryData[item.category] || 0)
                    +
                    item.amount;


                expense += item.amount;


            }
            else {


                income += item.amount;


            }


        }

    );





    // Category Chart


    const categoryCtx =
        document.getElementById(
            "categoryChart"
        );



    if (categoryChart) {

        categoryChart.destroy();

    }



    categoryChart =
        new Chart(
            categoryCtx,
            {

                type: "doughnut",

                data: {


                    labels:
                        Object.keys(categoryData),


                    datasets: [{

                        data:
                            Object.values(categoryData)

                    }]


                }


            }

        );





    // Income Expense Chart


    const incomeCtx =
        document.getElementById(
            "incomeExpenseChart"
        );



    if (incomeExpenseChart) {

        incomeExpenseChart.destroy();

    }



    incomeExpenseChart =
        new Chart(
            incomeCtx,
            {


                type: "bar",


                data: {


                    labels: [
                        "Income",
                        "Expense"
                    ],


                    datasets: [{

                        label: "Amount",

                        data: [
                            income,
                            expense
                        ]

                    }]


                }



            }

        );



}















/* =========================
   EXPORT IMPORT DATA
========================= */


const exportBtn =
document.getElementById(
"exportBtn"
);


const importBtn =
document.getElementById(
"importBtn"
);


const importFile =
document.getElementById(
"importFile"
);





// Export JSON

exportBtn.addEventListener(
"click",
function(){


const data =
JSON.stringify(
transactions,
null,
2
);



const blob =
new Blob(
[data],
{
type:"application/json"
}
);



const url =
URL.createObjectURL(
blob
);



const link =
document.createElement(
"a"
);


link.href = url;


link.download =
"transactions-backup.json";


link.click();



}
);

// Export CSV

const exportCsvBtn = document.getElementById("exportCsvBtn");

if (exportCsvBtn) {
exportCsvBtn.addEventListener("click", function () {
  const headers = ["ID", "Title", "Amount", "Type", "Category", "Date", "Notes"];
  const csvRows = [headers.join(",")];

  transactions.forEach(function (t, i) {
    const row = [
      i + 1,
      "\"" + String(t.title || "").replace(/"/g, "\"\"") + "\"",
      String(t.amount || 0),
      "\"" + String(t.type || "").replace(/"/g, "\"\"") + "\"",
      "\"" + String(t.category || "").replace(/"/g, "\"\"") + "\"",
      "\"" + String(t.date || "").replace(/"/g, "\"\"") + "\"",
      "\"" + String(t.notes || "").replace(/"/g, "\"\"") + "\""
    ];
    csvRows.push(row.join(","));
  });

  const csvContent = csvRows.join("
");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const now = new Date();
  const dateStr = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  link.download = "transactions-export-" + dateStr + ".csv";
  link.click();
  URL.revokeObjectURL(url);
});
}







// Import JSON

importBtn.addEventListener(
"click",
function(){


const file =
importFile.files[0];


if(!file){

alert(
"Please select JSON file"
);

return;

}




const reader =
new FileReader();



reader.onload =
function(e){


transactions =
JSON.parse(
e.target.result
);



saveTransactions();


renderTransactions();


updateDashboard();


alert(
"Data imported successfully"
);



}



reader.readAsText(file);



}
);