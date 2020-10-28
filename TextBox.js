class TextBox {
    carretPosition = 0;

    constructor(css) {
        this.textarea = document.createElement('textarea');
        this.textarea.classList.add(css.inputClass);
        this.textarea.value = '';
        this.carretPosition = 0;
        document.querySelectorAll('.intro')[0].appendChild(this.textarea);
    }

    get text() {
        return this.textarea.value;
    }

    set text(v) {        
        this.textarea.value = v;
    }

    typeText(v) {
        if (this.textarea.selectionStart != null && this.textarea.selectionStart != undefined) {
            const firstPart = this.textarea.value.substr(0, this.textarea.selectionStart);
            const secondPart = this.textarea.value.substr(this.textarea.selectionEnd, this.textarea.value.length);
            this.carretPosition = this.textarea.selectionStart;
            this.textarea.value = firstPart + v + secondPart;
            this.carretPosition += v.length;
            this.setCaretPosition(this.carretPosition);                         
        }

        document.querySelector('.use-keyboard-input').focus();
    }

    setCaretPosition(caretPos) {      
        if (this.textarea.createTextRange) {
            let range = this.textarea.createTextRange();
            range.move('character', caretPos);
            range.select();
            return true;
        } else {           
            if (this.textarea.selectionStart || this.textarea.selectionStart === 0) {
                this.textarea.focus();
                this.textarea.setSelectionRange(caretPos, caretPos);
                return true;
            } else {
                this.textarea.focus();
                return false;
            }
        }    
    }

    moveLeftCaretPosition() {
        this.carretPosition = this.textarea.selectionStart === this.textarea.selectionEnd ? this.textarea.selectionStart - 1 : this.textarea.selectionStart;
        if (this.carretPosition < 0) this.carretPosition = 0;
        this.setCaretPosition(this.carretPosition);
    }

    moveRightCaretPosition() {
        this.carretPosition = this.textarea.selectionStart === this.textarea.selectionEnd ? this.textarea.selectionEnd + 1 : this.textarea.selectionEnd;        
        this.setCaretPosition(this.carretPosition);
    }
   
    removeChar() {
        if (this.textarea.selectionStart != null && this.textarea.selectionStart != undefined && this.textarea.selectionStart > 0) {
            const firstEnd = this.textarea.selectionStart === this.textarea.selectionEnd ? this.textarea.selectionStart - 1 : this.textarea.selectionStart;
            const firstPart = this.textarea.value.substr(0, firstEnd);
            const secondPart = this.textarea.value.substr(this.textarea.selectionEnd, this.textarea.value.length);            
            this.textarea.value = firstPart + secondPart;            
            
            this.carretPosition = firstEnd;
            
            this.setCaretPosition(this.carretPosition);            
        }        
    }

    set listener(f) {        
        this.textarea.addEventListener('focus', f);
    }
}
