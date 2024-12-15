// script.js

document.addEventListener("DOMContentLoaded", () => {
    const formModal = document.getElementById("formModal");
    const openFormBtn = document.getElementById("openFormBtn");
    const closeFormBtn = document.getElementById("closeFormBtn");
    const callForm = document.getElementById("callForm");
    const callTableBody = document.querySelector("#callTable tbody");
    const searchBox = document.getElementById("searchBox");
    const statsList = document.getElementById("statsList");

    let calls = JSON.parse(localStorage.getItem("calls")) || [];

    const renderCalls = () => {
        callTableBody.innerHTML = "";
        statsList.innerHTML = "";

        const statusCounts = {};

        calls.forEach((call, index) => {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${call.name}</td>
                <td>${call.details}</td>
                <td>${call.status}</td>
                <td>
                    <button onclick="editCall(${index})">Editar</button>
                    <button onclick="deleteCall(${index})">Excluir</button>
                </td>
            `;
            callTableBody.appendChild(row);

            statusCounts[call.status] = (statusCounts[call.status] || 0) + 1;
        });

        for (const status in statusCounts) {
            const li = document.createElement("li");
            li.textContent = `${status}: ${statusCounts[status]} atendimentos`;
            statsList.appendChild(li);
        }

        localStorage.setItem("calls", JSON.stringify(calls));
    };

    openFormBtn.addEventListener("click", () => formModal.style.display = "flex");
    closeFormBtn.addEventListener("click", () => formModal.style.display = "none");

    callForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("clientName").value;
        const details = document.getElementById("details").value;
        const status = document.getElementById("status").value;

        calls.push({ name, details, status });
        renderCalls();
        callForm.reset();
        formModal.style.display = "none";
    });

    searchBox.addEventListener("input", (e) => {
        const term = e.target.value.toLowerCase();
        const filteredCalls = calls.filter(call =>
            call.name.toLowerCase().includes(term) ||
            call.details.toLowerCase().includes(term) ||
            call.status.toLowerCase().includes(term)
        );

        callTableBody.innerHTML = "";
        filteredCalls.forEach((call, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${call.name}</td>
                <td>${call.details}</td>
                <td>${call.status}</td>
                <td>
                    <button onclick="editCall(${index})">Editar</button>
                    <button onclick="deleteCall(${index})">Excluir</button>
                </td>
            `;
            callTableBody.appendChild(row);
        });
    });

    renderCalls();

    window.editCall = (index) => {
        const call = calls[index];
        document.getElementById("clientName").value = call.name;
        document.getElementById("details").value = call.details;
        document.getElementById("status").value = call.status;
        calls.splice(index, 1);
        formModal.style.display = "flex";
    };

    window.deleteCall = (index) => {
        calls.splice(index, 1);
        renderCalls();
    };
});
