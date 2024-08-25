document.addEventListener('DOMContentLoaded', () => {
    const codeArea = document.getElementById('codeArea');
    const saveButton = document.getElementById('saveButton');
    const runButton = document.getElementById('runButton');
    const highlightedCode = document.getElementById('highlightedCode');
    const output = document.getElementById('output');

    // Load saved code from local storage
    codeArea.value = localStorage.getItem('code') || '';

    // Highlight code function
    function highlightCode(code) {
        const highlighted = code
            .replace(/(\d+)/g, '<span class="number">$1</span>')
            .replace(/(\bfunction\b|\bdef\b)/g, '<span class="function">$1</span>')
            .replace(/(\bif\b|\belse\b)/g, '<span class="event">$1</span>')
            .replace(/(\bfor\b|\bin\b|range\b)/g, '<span class="event">$1</span>')
            .replace(/(\blet\b|\bconst\b|\bvar\b|\b[a-zA-Z_]\w*\b)/g, '<span class="variable">$1</span>');

        return highlighted;
    }

    // Update highlighted code
    function updateHighlight() {
        highlightedCode.innerHTML = highlightCode(codeArea.value);
    }

    // Custom print function
    function customPrint(message) {
        output.textContent += message + '\n';
    }

    // Save code to local storage
    saveButton.addEventListener('click', () => {
        localStorage.setItem('code', codeArea.value);
        updateHighlight();
    });

    // Run code
    runButton.addEventListener('click', () => {
        output.innerHTML = ''; // Clear previous output
        try {
            // Replace 'print' function with customPrint
            let code = codeArea.value
                .replace(/def\s+(\w+)\(([^)]*)\):\s*([\s\S]*?)(?=def\s|\s*$)/g, 'function $1($2) { $3 }')
                .replace(/(\bprint\(([^)]*)\);?)/g, 'customPrint($2);');
            
            // Evaluate the code in a sandboxed environment
            const result = new Function('customPrint', code);
            result(customPrint);
        } catch (error) {
            output.textContent = `エラー: ${error.message}`;
        }
    });

    // Initial highlight
    updateHighlight();

    // Update highlight on code input change
    codeArea.addEventListener('input', updateHighlight);
});
