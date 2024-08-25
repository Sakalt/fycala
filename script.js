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
            .replace(/(\bfunction\b)/g, '<span class="function">$1</span>')
            .replace(/(\bwindow\.addEventListener\b)/g, '<span class="event">$1</span>')
            .replace(/(\bvar\b|\blet\b|\bconst\b|\b[a-zA-Z_]\w*\b)/g, '<span class="variable">$1</span>');

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
            const code = codeArea.value.replace(/\bprint\((.*)\);?/g, 'customPrint($1);');
            
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
