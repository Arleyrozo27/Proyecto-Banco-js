// banco.js

// Variables de estado
let balance = 10000.00;
const transactionHistory = [
    {
        date: '25/05/2023 15:30',
        description: 'Consignación',
        reference: '1234567890123456',
        amount: '+500.00',
        balance: '10,000.00'
    },
    {
        date: '24/05/2023 14:20',
        description: 'Retiro',
        reference: '9876543210987654',
        amount: '-200.00',
        balance: '9,500.00'
    },
    {
        date: '15/05/2023 11:45',
        description: 'Transferencia',
        reference: '4567890123456789',
        amount: '-1,000.00',
        balance: '9,700.00'
    }
];

function generateReference() {
    let reference = '';
    for (let i = 0; i < 16; i++) {
        reference += Math.floor(Math.random() * 10);
    }
    return reference;
}

function formatBalance(amount) {
    return amount.toLocaleString('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 2
    });
}

function formatDate(date = new Date()) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function toggleModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    modal.classList.toggle('hidden');
}

function processDeposit() {
    const amountInput = document.getElementById('deposit-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({ icon: 'warning', title: 'Monto inválido', text: 'Por favor ingrese un monto válido' });
        return;
    }

    const reference = generateReference();
    const date = formatDate();

    balance += amount;
    document.getElementById('balance').textContent = formatBalance(balance);

    transactionHistory.unshift({
        date: date,
        description: 'Consignación',
        reference: reference,
        amount: `+${amount.toFixed(2)}`,
        balance: formatBalance(balance)
    });

    updateTransactionHistory();

    Swal.fire({
        icon: 'success',
        title: 'Consignación exitosa',
        html: `
            <p>Su consignación se ha completado correctamente.</p>
            <p><strong>Referencia:</strong> ${reference}</p>
            <p><strong>Monto:</strong> +${formatBalance(amount)}</p>
            <p><strong>Fecha:</strong> ${date}</p>
        `
    });

    toggleModal('deposit');
    amountInput.value = '';
}

function processWithdraw() {
    const amountInput = document.getElementById('withdraw-amount');
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({ icon: 'warning', title: 'Monto inválido', text: 'Por favor ingrese un monto válido' });
        return;
    }

    if (amount > balance) {
        Swal.fire({ icon: 'error', title: 'Fondos insuficientes', text: 'No tiene suficiente saldo' });
        return;
    }

    const reference = generateReference();
    const date = formatDate();

    balance -= amount;
    document.getElementById('balance').textContent = formatBalance(balance);

    transactionHistory.unshift({
        date: date,
        description: 'Retiro',
        reference: reference,
        amount: `-${amount.toFixed(2)}`,
        balance: formatBalance(balance)
    });

    updateTransactionHistory();

    document.getElementById('confirmation-title').textContent = 'Retiro exitoso';
    document.getElementById('confirmation-message').textContent = 'Su retiro se ha completado correctamente.';
    document.getElementById('confirmation-reference').textContent = reference;
    document.getElementById('confirmation-date').textContent = date;
    document.getElementById('confirmation-amount').textContent = `-${formatBalance(amount)}`;

    toggleModal('withdraw');
    toggleModal('confirmation');
    amountInput.value = '';
}

function processTransfer() {
    const amountInput = document.getElementById('transfer-amount');
    const amount = parseFloat(amountInput.value);
    const accountInput = document.getElementById('transfer-account');
    const account = accountInput.value.trim();

    if (isNaN(amount) || amount <= 0) {
        Swal.fire({ icon: 'warning', title: 'Monto inválido', text: 'Por favor ingrese un monto válido' });
        return;
    }

    if (amount > balance) {
        Swal.fire({ icon: 'error', title: 'Fondos insuficientes', text: 'No tiene suficiente saldo' });
        return;
    }

    if (!account) {
        Swal.fire({ icon: 'warning', title: 'Falta número de cuenta', text: 'Ingrese número de cuenta destino' });
        return;
    }

    const reference = generateReference();
    const date = formatDate();
    const bankSelect = document.getElementById('bank-select');
    const bankName = bankSelect.options[bankSelect.selectedIndex].text;

    balance -= amount;
    document.getElementById('balance').textContent = formatBalance(balance);

    transactionHistory.unshift({
        date: date,
        description: `Transferencia a ${bankName} ****${account.slice(-4)}`,
        reference: reference,
        amount: `-${amount.toFixed(2)}`,
        balance: formatBalance(balance)
    });

    updateTransactionHistory();

    document.getElementById('confirmation-title').textContent = 'Transferencia exitosa';
    document.getElementById('confirmation-message').textContent = `Transferencia a ${bankName} ****${account.slice(-4)} realizada.`;
    document.getElementById('confirmation-reference').textContent = reference;
    document.getElementById('confirmation-date').textContent = date;
    document.getElementById('confirmation-amount').textContent = `-${formatBalance(amount)}`;

    toggleModal('transfer');
    toggleModal('confirmation');
    amountInput.value = '';
    accountInput.value = '';
}

function updateTransactionHistory() {
    const historyTable = document.getElementById('transaction-history');
    historyTable.innerHTML = '';

    transactionHistory.forEach(transaction => {
        const row = document.createElement('tr');
        const amountClass = transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600';

        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${transaction.date}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${transaction.description}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">${transaction.reference}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm ${amountClass} text-right">${transaction.amount}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">${transaction.balance}</td>
        `;

        historyTable.appendChild(row);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('balance').textContent = formatBalance(balance);
    updateTransactionHistory();

    const numeroCuenta = localStorage.getItem('numeroCuenta');
    const cuentaEl = document.getElementById('account-number');
    if (numeroCuenta && numeroCuenta.length >= 4) {
        cuentaEl.textContent = `Cuenta: **** ${numeroCuenta.slice(-4)}`;
    } else {
        cuentaEl.textContent = 'Cuenta: ******';
    }
});
