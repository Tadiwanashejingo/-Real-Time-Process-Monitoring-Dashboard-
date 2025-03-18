class ProcessMonitor {
    constructor(config = {}) {
        // DOM Elements
        this.elements = {
            statusIndicator: document.getElementById('statusIndicator'),
            statusText: document.getElementById('statusText'),
            cpuUsage: document.getElementById('cpuUsage'),
            memoryUsage: document.getElementById('memoryUsage'),
            log: document.getElementById('log')
        };

        // Configuration
        this.config = {
            updateInterval: config.updateInterval || 1000,
            maxLogEntries: config.maxLogEntries || 50,
            apiEndpoint: config.apiEndpoint || '/api/process-stats'
        };

        // State
        this.state = {
            isRunning: false,
            lastUpdate: null,
            errorCount: 0,
            maxErrors: 5
        };

        this.init();
    }

    init() {
        try {
            this.startMonitoring();
            this.addLogEntry('Process Monitor initialized');
        } catch (error) {
            this.handleError('Initialization failed', error);
        }
    }

    startMonitoring() {
        if (this.state.isRunning) return;
        
        this.state.isRunning = true;
        this.monitoringLoop();
        
        // Clean up on page unload
        window.addEventListener('unload', () => {
            this.stopMonitoring();
        });
    }

    stopMonitoring() {
        this.state.isRunning = false;
        this.addLogEntry('Monitoring stopped');
    }

    async monitoringLoop() {
        while (this.state.isRunning) {
            try {
                await this.updateMetrics();
                this.state.errorCount = 0;
            } catch (error) {
                this.handleError('Update failed', error);
                if (this.state.errorCount >= this.state.maxErrors) {
                    this.stopMonitoring();
                    break;
                }
            }
            await new Promise(resolve => setTimeout(resolve, this.config.updateInterval));
        }
    }

    async updateMetrics() {
        // Simulated API call - replace with real data source
        const data = await this.fetchMetrics();
        
        // Update UI
        this.elements.cpuUsage.textContent = `${data.cpu}%`;
        this.elements.memoryUsage.textContent = `${data.memory} MB`;
        this.setStatus(data.status);
        this.addLogEntry(`CPU: ${data.cpu}%, Memory: ${data.memory}MB`);
        
        this.state.lastUpdate = new Date();
    }

    // Simulated data fetch - replace with actual API
    async fetchMetrics() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    cpu: Math.floor(Math.random() * 100),
                    memory: Math.floor(Math.random() * 1000),
                    status: Math.random() < 0.1 ? 'stopped' : 
                           Math.random() < 0.2 ? 'warning' : 'running'
                });
            }, 200);
        });
    }

    setStatus(status) {
        const statusMap = {
            running: { text: 'Running', class: 'status-running' },
            stopped: { text: 'Stopped', class: 'status-stopped' },
            warning: { text: 'Warning', class: 'status-warning' }
        };

        const statusInfo = statusMap[status] || statusMap.running;
        this.elements.statusText.textContent = statusInfo.text;
        this.elements.statusIndicator.className = `status-indicator ${statusInfo.class}`;
    }

    addLogEntry(message) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.textContent = `[${timestamp}] ${message}`;
        
        this.elements.log.insertBefore(entry, this.elements.log.firstChild);
        
        // Maintain max log entries
        while (this.elements.log.children.length > this.config.maxLogEntries) {
            this.elements.log.removeChild(this.elements.log.lastChild);
        }
        
        // Auto-scroll to top if near top
        if (this.elements.log.scrollTop < 50) {
            this.elements.log.scrollTop = 0;
        }
    }

    handleError(message, error) {
        console.error(`${message}:`, error);
        this.state.errorCount++;
        this.addLogEntry(`ERROR: ${message} - ${error.message}`);
        this.setStatus('warning');
    }
}

// Usage
const monitor = new ProcessMonitor({
    updateInterval: 1000,    // Update every 1 second
    maxLogEntries: 50,       // Keep last 50 log entries
    apiEndpoint: '/api/process-stats'  // Your API endpoint
});

// Example: Add manual controls
document.addEventListener('keydown', (e) => {
    if (e.key === 'p') monitor.stopMonitoring();
    if (e.key === 's') monitor.startMonitoring();
});
