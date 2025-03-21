
function getMockSystemData() {
    const processes = [
        { id: 1, name: "chrome.exe", cpu: Math.random() * 50, memory: Math.random() * 1000 },
        { id: 2, name: "node.exe", cpu: Math.random() * 30, memory: Math.random() * 500 },
        { id: 3, name: "explorer.exe", cpu: Math.random() * 10, memory: Math.random() * 200 },
        { id: 4, name: "idle", cpu: Math.random() * 5, memory: Math.random() * 50 },
    ];
    const totalCpu = processes.reduce((sum, p) => sum + p.cpu, 0);
    const totalMem = processes.reduce((sum, p) => sum + p.memory, 0);
    return { processes, totalCpu: Math.min(totalCpu, 100), totalMem, maxMem: 16000 };
}


let systemData = getMockSystemData();
function fetchData() {
    systemData = getMockSystemData(); 
    updateUI();
    updateCharts();
}


setInterval(fetchData, 2000); 


function updateUI() {
   
    document.getElementById("cpu-total").textContent = `${systemData.totalCpu.toFixed(1)}%`;
    document.getElementById("mem-total").textContent = `${systemData.totalMem.toFixed(0)} MB / ${systemData.maxMem} MB`;

 
    const tbody = document.getElementById("process-list");
    tbody.innerHTML = "";
    systemData.processes.forEach(proc => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${proc.id}</td>
            <td>${proc.name}</td>
            <td>${proc.cpu.toFixed(1)}</td>
            <td>${proc.memory.toFixed(0)}</td>
            <td><button onclick="terminateProcess(${proc.id})">Terminate</button></td>
        `;
        if (proc.cpu > 40) row.classList.add("alert"); 
        tbody.appendChild(row);
    });
}


function sortTable(column) {
    const sorted = systemData.processes.sort((a, b) => {
        const values = [
            a.id - b.id,
            a.name.localeCompare(b.name),
            a.cpu - b.cpu,
            a.memory - b.memory
        ];
        return values[column];
    });
    updateUI();
}


function refreshData() {
    fetchData();
}

function terminateProcess(id) {
    systemData.processes = systemData.processes.filter(p => p.id !== id);
    updateUI();
    updateCharts();
}


const cpuChart = new Chart(document.getElementById("cpuChart"), {
    type: "line",
    data: {
        labels: [],
        datasets: [{
            label: "CPU Usage (%)",
            data: [],
            borderColor: "blue",
            fill: false
        }]
    },
    options: { scales: { y: { min: 0, max: 100 } } }
});

const memChart = new Chart(document.getElementById("memChart"), {
    type: "bar",
    data: {
        labels: [],
        datasets: [{
            label: "Memory Usage (MB)",
            data: [],
            backgroundColor: "green"
        }]
    },
    options: { scales: { y: { min: 0 } } }
});

let timeStamps = [];
function updateCharts() {
  
    const now = new Date().toLocaleTimeString();
    timeStamps.push(now);
    cpuChart.data.labels = timeStamps.slice(-10);
    cpuChart.data.datasets[0].data.push(systemData.totalCpu);
    cpuChart.data.datasets[0].data = cpuChart.data.datasets[0].data.slice(-10);
    cpuChart.update();

  
    memChart.data.labels = systemData.processes.map(p => p.name);
    memChart.data.datasets[0].data = systemData.processes.map(p => p.memory);
    memChart.update();
}


fetchData();
