const modal = {
    open() {
        document.getElementById("modal").classList.add("modal")
    },

    close() {
        document.getElementById("modal").classList.remove("modal")
        
    }
}

const DOM = {

    newtr: document.querySelector("#data-table tbody"),

    insertHtml(transactions, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.InnerHTMLInjection(transactions, index)
        tr.dataset.index = index

        DOM.newtr.appendChild(tr)
    },

    InnerHTMLInjection(transactions, index) {
        const tdClass = transactions.amount < 0 ? "expense" : "income"

        const amount = Utils.formatCurrency(transactions.amount)

        const html = `<tr>
        <td class="description">${transactions.description}</td>
        <td class=${tdClass}>${amount}</td>
        <td class="date">${transactions.data}</td>
        <td>
        <img onclick="funcTransactions.remove(${index})" src="./assets/minus.svg" alt="Remover transacao">
        </td>
        </tr>`

        return html
    },

    clearTrasactions() {
        DOM.newtr.innerHTML = ""
    },

}

const Utils = {
    formatCurrency(value) {

        const signal = Number(value) > 0 ? "" : "-"

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        
        return signal + value
        
    },


    formatAmount(value) {
        let amount = Number(value) * 100
       
        return amount
    },

    formatDate(value) {
        let splitedDate = value.split("-")
        let newDate = `${splitedDate[2]}/${splitedDate[1]}/${splitedDate[0]}`
        
        return newDate
    }
}

const storage = {
    get() {
        return JSON.parse(localStorage.getItem("savedTrans")) || []
    },

    set() {
        localStorage.setItem("savedTrans", JSON.stringify(funcTransactions.all))    
    }
}

const funcTransactions = {

    all: storage.get(),

    addTransactions(transaction) {

        funcTransactions.all.push(transaction)
        
        App.reload()
    },

    remove(index) {
        funcTransactions.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let sumIcome = 0
        funcTransactions.all.forEach((trans) => {
            if (trans.amount > 0) {
                sumIcome += trans.amount
            }
        })
        return sumIcome
    },

    expenses() {
        let sumExpense = 0
        funcTransactions.all.forEach(trans => {
            if (trans.amount < 0) {
                sumExpense += trans.amount
            }
        })
        return sumExpense
    },

    total() {
        let total = funcTransactions.incomes() + funcTransactions.expenses()
        return total
    }
}

const Form = {

    amount: document.querySelector("input#amount"),
    description: document.querySelector("input#description"), 
    data: document.querySelector("input#date"),

    getValues() {
        return {
            amount: Form.amount.value,
            description: Form.description.value,
            data: Form.data.value,
        }
        
    },

    formValidate() {

        const {amount, description, data} = Form.getValues()

        if(amount.trim() === "" || description.trim() === "" || data.trim() === "") {
            throw new Error("Preencha todos os dados corretmente!")
        }  
    },

    formatValues() {
        let {amount, description, data} = Form.getValues()

        amount = Utils.formatAmount(amount)

        data = Utils.formatDate(data)

        return {
            amount,
            description,
            data
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.data.value = ""
    },

    submit(event) {
        event.preventDefault()

        try{
            Form.formValidate()
            Form.formatValues()

            const formatedTransaction = Form.formatValues()
            funcTransactions.addTransactions(formatedTransaction)

            Form.clearFields()
            modal.close()

        } catch(error) {
            console.log(error)
            alert(error.message)
        }
    }
}

const renderValues = {

    balanceValue() {
        document.querySelector("#entrada")
            .innerHTML = Utils.formatCurrency(funcTransactions.incomes())
        document.querySelector("#saidas")
            .innerHTML = Utils.formatCurrency(funcTransactions.expenses()) 
        document.querySelector("#total")
            .innerHTML = Utils.formatCurrency(funcTransactions.total()) 
    },
}

const App = {

    init() {
        funcTransactions.all.forEach((trans, index) => {
            DOM.insertHtml(trans, index)
        })
        renderValues.balanceValue()
        storage.set(funcTransactions.all)
    },

    reload() {

        DOM.clearTrasactions()
        App.init()
    }
}

App.init()




