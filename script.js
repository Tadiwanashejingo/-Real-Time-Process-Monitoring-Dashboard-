// Simulated process data (replace with real backend data in production)
function getRandomProcessData() {
    return [
        { pid: 1, name: 'system.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 },
        { pid: 2, name: 'app1.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 },
        { pid: 3, name: 'app2.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 }
    ];
}

// Chart initialization with Plotly.js
const cpuData = [{ 
    x: [], // Time values
    y: [], // CPU usage values
    type: 'scatter', 
    mode: 'lines', // Line chart
    name: 'CPU' 
}];

const memoryData = [{ 
    x: [], 
    y: [], 
    type: 'scatter', 
    mode: 'lines', 
    name: 'Memory' 
}];

const layout = { 
    margin: { t: 20 }, // Minimal top margin for compact display
    yaxis: { range: [0, 100] } // CPU range: 0-100%
};

// Initialize CPU chart
Plotly.newPlot('cpu-chart', cpuData, layout);

// Initialize Memory chart with adjusted range
Plotly.newPlot('memory-chart', memoryData, { 
    ...layout, 
    yaxis: { range: [0, 1024] } // Memory range: 0-1024 MB
});

// Update dashboard with real-time data
function updateDashboard() {
    const time = new Date().toLocaleTimeString(); // Current time for x-axis
    const cpuValue = Math.random() * 100; // Simulated CPU usage
    const memoryValue = Math.random() * 1024; // Simulated memory usage

    // Update charts by appending new data points
    Plotly.extendTraces('cpu-chart', { x: [[time]], y: [[cpuValue]] }, [0]);
    Plotly.extendTraces('memory-chart', { x: [[time]], y: [[memoryValue]] }, [0]);

    // Update process list
    const processes = getRandomProcessData();
    const tbody = document.getElementById('process-list');
    tbody.innerHTML = ''; // Clear existing rows

    processes.forEach(proc => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${proc.pid}</td>
            <td>${proc.name}</td>
            <td>${proc.cpu.toFixed(2)}</td>
            <td>${proc.memory.toFixed(2)}</td>
            <td><button class="terminate-btn" onclick="terminateProcess(${proc.pid})">Terminate</button></td>
        `;
        tbody.appendChild(tr);
    });
}

// Simulate process termination
function terminateProcess(pid) {
    alert(`Terminating process ${pid} (simulated)`);
    // In a real app, this would send a request to the backend, e.g.:
    // fetch(`/terminate/${pid}`, { method: 'POST' }).then(() => updateDashboard());
}

// Start the dashboard and set real-time updates
updateDashboard(); // Initial call
setInterval(updateDashboard, 2000); // Update every 2 seconds