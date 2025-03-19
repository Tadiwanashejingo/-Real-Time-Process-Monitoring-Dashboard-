
function getRandomProcessData() {
    return [
        { pid: 1, name: 'system.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 },
        { pid: 2, name: 'app1.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 },
        { pid: 3, name: 'app2.exe', cpu: Math.random() * 100, memory: Math.random() * 1024 }
    ];
}

const cpuData = [{ 
    x: [], 
    y: [], 
    type: 'scatter', 
    mode: 'lines', 
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
    margin: { t: 20 }, /
    yaxis: { range: [0, 100] } 
};


Plotly.newPlot('cpu-chart', cpuData, layout);


Plotly.newPlot('memory-chart', memoryData, { 
    ...layout, 
    yaxis: { range: [0, 1024] } 
});


function updateDashboard() {
    const time = new Date().toLocaleTimeString(); 
    const cpuValue = Math.random() * 100; 
    const memoryValue = Math.random() * 1024; 

    
    Plotly.extendTraces('cpu-chart', { x: [[time]], y: [[cpuValue]] }, [0]);
    Plotly.extendTraces('memory-chart', { x: [[time]], y: [[memoryValue]] }, [0]);

    
    const processes = getRandomProcessData();
    const tbody = document.getElementById('process-list');
    tbody.innerHTML = ''; 

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


function terminateProcess(pid) {
    alert(`Terminating process ${pid} (simulated)`);
    
}


updateDashboard();
setInterval(updateDashboard, 2000); 
