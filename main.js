const operators = {
    '+': (a, b) => a.plus(b),
    '-': (a, b) => a.minus(b),
    '*': (a, b) => a.times(b),
    '/': (a, b) => a.div(b)
}

class Calculator {
    constructor() {
        this.displayElement = document.querySelector('.display');
        this.firstOperand = null;
        this.operator = null;
        this.secondOperand = null;
        this.isDecimalActive = false;
    }
    
    set isDecimalActive(value) {
        this._isDecimalActive = value;

        const decimalButton = document.querySelectorAll('.number-button');
    }

    set firstOperand(value) {
        if (this.operator) return;
        
        this._firstOperand = value;
        this.display = value;
    }
    
    get firstOperand() {
        return this._firstOperand;
    }
    
    set operator(value) {
        if (!this._firstOperand) return;
        
        this.isDecimalUsed = false;
        this._operator = value;

        // cal.operator = event.target.textContent;
        const operatorButtons = document.querySelectorAll('.operator-button');
        operatorButtons.forEach(button => button.textContent === value ? button.classList.add('operator-button-selected') : button.classList.remove('operator-button-selected'));
    }
    
    get operator() {
        return this._operator;
    }
    
    set secondOperand(value) {
        if (!this.firstOperand || !this.operator) return;

        this._secondOperand = value;
        this.display = value;
    }

    get secondOperand() {
        return this._secondOperand;
    }
    
    set display(value) {
        this._display = value;
        this.displayElement.textContent = (value === null) ? '0' : value;
    }
    
    get display() {
        return this._display;
    }

    clear() {
        this.isDecimalUsed = false;
        this.secondOperand = null;
        this.operator = null;
        this.firstOperand = null;
        this.display = '0';
    }

    back() {
        if (this.display.length === 1) {
            if (!this.operator) {
                if (!this.firstOperand) return;
                this.firstOperand = null;
            } else {
                if (!this.secondOperand) return;
                this.secondOperand = null;
            }
            return this.display = '0';
        } 

        if (!this.operator) {
            // setting the first operand
            this.firstOperand = this.firstOperand.slice(0, -1);
            this.display = this.firstOperand;
            return;
        }

        // setting the second operand
        this.secondOperand = this.secondOperand.slice(0, -1);
        this.display = this.secondOperand;
        
    }
    
    signswitch() {
        if (!this.operator) {
            if (!this.firstOperand) return;

            if (this.firstOperand.startsWith('-')) {
                this.firstOperand = this.firstOperand.slice(1);
                this.display = this.firstOperand;
                return;
            }

            this.firstOperand = '-' + this.firstOperand;
            this.display = this.firstOperand;
            return;
        }

        if (!this.secondOperand) return;

        if (this.secondOperand.startsWith('-')) {
            this.secondOperand = this.secondOperand.slice(1);
            this.display = this.secondOperand;
            return;
        }

        this.secondOperand = '-' + this.secondOperand;
        this.display = this.secondOperand;
        return;
    }
    
    equals() {
        if (!this.firstOperand || !this.operator || !this.secondOperand) return;

        const first = new Big(this.firstOperand);
        const second = new Big(this.secondOperand);

        const result = operators[this.operator](first, second).toString();
        this.clear();
        this.firstOperand = result;
        this.display = result;
    }

}

const handleButtonClick = (event) => {
    if(event.target.textContent === ''){
        return;
    }
    
    if (event.target.textContent === '.') {
        const current = cal.operator ? cal.secondOperand : cal.firstOperand;

        if (current && current.includes('.')) return; // Cannot put 2 decimals

        if (cal.operator) {
            const val = cal.secondOperand ? cal.secondOperand + '.' : '0.';
            cal.secondOperand = val;
            cal.display = val;
        } else {
            const val = cal.firstOperand ? cal.firstOperand + '.' : '0.';
            cal.firstOperand = val;
            cal.display = val;
        }
        return;
    }

    if(event.target.textContent === 'AC') {
        return cal.clear();
    }

    if (event.target.textContent === 'Back') {
        return cal.back();
    }
    
    if (event.target.textContent === '=') {
        return cal.equals();
    }
    
    if (event.target.textContent === '+/-') {
        return cal.signswitch();
    } 

    if (event.target.classList.contains('operator-button')) {
        if (cal.secondOperand || !cal.firstOperand) return;
        return cal.operator = event.target.textContent;
    }

    if (event.target.classList.contains('number-button')) {
        if (cal.operator) {
            if (!cal.secondOperand || cal.secondOperand === 0) {
                return cal.secondOperand = event.target.textContent;
            }

            return cal.secondOperand += event.target.textContent;
        }

        if (!cal.firstOperand || cal.firstOperand === 0) {
            return cal.firstOperand = event.target.textContent;
            }

            return cal.firstOperand += event.target.textContent;
    }
}

const cal = new Calculator();