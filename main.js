class TextBox {
    constructor(css) {
        this.textarea = document.createElement('textarea');
        this.textarea.classList.add(css.inputClass);
        this.textarea.value = this.value;
        document.querySelectorAll('.intro')[0].appendChild(this.textarea);
    }

    get text() {
        return this.textarea.value;
    }

    set text(v) {        
        this.textarea.value = v;
    }

    set listener(f) {
        this.textarea.addEventListener('focus', f);
    }
}

class Keyboard {
    elements = {
        main: null,
        keyContainer: null,
        keys: []
    }

    eventHandlers = {
        oninput: null,
        onclose: null
    }

    properties = {
        capsLock: false
    }

    textArea = null

    cssClasses = {
        keyboardClass: 'keyboard',
        hiddenClass: 'vk-hidden',
        keysClass: 'vk-keys',
        keyClass: 'vk-key',
        keyWideClass: 'vk-key-wide',
        keyXWideClass: 'vk-key-x-wide',
        hexagonPart: 'vk-key-hexagon_part',
        keyTextClass: 'vk-key-text',
        inputClass: 'use-keyboard-input'
    }

    constructor(inputClasses, textArea) {
        this.textArea = textArea;

        this.setDiffClasses(inputClasses, this.cssClasses);

        this.elements.main = document.createElement('div');
        this.elements.keyContainer = document.createElement('div');

        this.elements.main.classList.add(this.cssClasses.keyboardClass, this.cssClasses.hiddenClass);
        this.elements.keyContainer.classList.add(this.cssClasses.keysClass);
        this.elements.keyContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keyContainer.querySelectorAll('.' + this.cssClasses.keyClass);

        this.elements.main.appendChild(this.elements.keyContainer);
        document.body.appendChild(this.elements.main);

        console.log(this.textArea);

        this.textArea.listener = () => {
            this.show(this.textArea.text, currentValue => {this.textArea.text = currentValue})
        }
        /*document.querySelectorAll('.' + this.cssClasses.inputClass).forEach(element => {
            element.addEventListener('focus', () => {
                this.show(element.value.text, currentValue => {
                    //element.value.text = currentValue;
                });
            });
        });*/
    }

    setDiffClasses (input, init) {
        for (let k of Object.keys(init)) {
            init[k] = input[k] !== undefined ? input[k] : init[k];  
        }  
    }

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const keyLayout = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace',
            'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p',
            'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'enter',
            'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '?',
            'space'
        ];

        const createIconHTML = iconName => `<i class="material-icons">${iconName}</i>`;

        keyLayout.forEach(key => {
            const keyElement = document.createElement('div');
            const hexagonPart = document.createElement('div');
            const keyText = document.createElement('p');
            const insertLineBreak = ['backspace', 'p', 'enter', '?'].indexOf(key) !== -1;
            
            keyElement.classList.add(this.cssClasses.keyClass);
            hexagonPart.classList.add(this.cssClasses.hexagonPart);
            keyText.classList.add(this.cssClasses.keyTextClass);

            keyElement.appendChild(hexagonPart);
            keyElement.appendChild(hexagonPart.cloneNode(true));
            
            const hexagonPartText = hexagonPart.cloneNode(true);
            hexagonPartText.appendChild(keyText);
            keyElement.appendChild(hexagonPartText);
            
            switch (key) {
                case 'backspace':
                    //keyElement.classList.add(this.cssClasses.keyWideClass);
                    keyText.innerHTML = createIconHTML('backspace');

                    keyElement.setAttribute('name', 'Backspace');

                    keyElement.addEventListener('click', () => {
                        this.textArea.text = this.textArea.text.substring(0, this.textArea.text.length - 1);
                        this._triggerEvents('oninput');
                    })

                    break;

                case 'caps':
                    //keyElement.classList.add(this.cssClasses.keyWideClass);
                    keyText.innerHTML = createIconHTML('keyboard_capslock');

                    keyElement.setAttribute('name', 'CapsLock');

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('vk-key-on', this.properties.capsLock);
                    })

                    break;

                case 'enter':
                    //keyElement.classList.add(this.cssClasses.keyWideClass);
                    keyText.innerHTML = createIconHTML('keyboard_return');

                    keyElement.setAttribute('name', 'Enter');
    
                    keyElement.addEventListener('click', () => {
                        this.textArea.text += '\n';
                        this._triggerEvents('oninput');
                    })
    
                    break;
                
                case 'space':
                    keyText.classList.add(this.cssClasses.keyXWideClass);
                    keyText.innerHTML = createIconHTML('space_bar');

                    keyElement.setAttribute('name', ' ');

                    keyElement.addEventListener('click', () => {
                        this.textArea.text += ' ';
                        this._triggerEvents('oninput');
                    })

                    break;            

                case 'done':
                    //keyElement.classList.add(this.cssClasses.keyWideClass, 'vk-key-dark');
                    keyText.innerHTML = createIconHTML('check_circle');

                    keyElement.setAttribute('name', 'Escape');

                    keyElement.addEventListener('click', () => {
                        this.hide();
                        this._triggerEvents('onclose');
                    })

                    break;            

                default:
                    keyText.textContent = key.toLowerCase();

                    keyElement.setAttribute('name', key);
                                        
                    keyElement.addEventListener('click', () => {
                        this.textArea.text += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
                        this._triggerEvents('oninput');
                    });
                    
                    break;            
            }

            fragment.appendChild(keyElement);

            if (insertLineBreak)
                fragment.appendChild(document.createElement('br'));
        });

        return fragment;
    }

    _triggerEvents(handlerName) {
        if (typeof this.eventHandlers[handlerName] == "function") {
            this.eventHandlers[handlerName](this.properties.value.text);
        }
    }

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    }

    show(initialValue, oninput, onclose) {
        //this.properties.value.text = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove(this.cssClasses.hiddenClass);        
    }

    hide() {
        //this.properties.value.text = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add(this.cssClasses.hiddenClass);
    }    
}

window.addEventListener('DOMContentLoaded', () => {
    const classProps = {
        keyboardClass: 'keyboard',
        hiddenClass: 'vk-hidden',
        keysClass: 'vk-keys',
        keyClass: 'vk-key',
        keyWideClass: 'vk-key-wide',
        keyXWideClass: 'vk-key-x-wide',
        inputClass: 'use-keyboard-input'
    }

    const textarea = new TextBox(classProps);
    const keyboard = new Keyboard(classProps, textarea);
    keyboard.hide();       
    
    document.addEventListener('keydown', (event) => {
        const keyName = event.key;
        const keysHTML = document.querySelectorAll('.vk-key');

        textarea.textarea.focus();

        keysHTML.forEach(e => {
            if (e.getAttribute('name') == keyName) {                
                e.classList.add('vk-key-active');
                if (keyName === 'Escape') {
                    keyboard.hide();
                    keyboard._triggerEvents('onclose');
                    document.querySelectorAll('.use-keyboard-input')[0].blur();
                }
                if (keyName == 'CapsLock') {
                    keyboard._toggleCapsLock();
                    e.classList.toggle('vk-key-on', keyboard.properties.capsLock);
                }
            }
        })

        if (keyName === 'CapsLock')
            keyboard._toggleCapsLock();
      
        
    }, false);

    document.addEventListener('keyup', (event) => {
        const keyName = event.key;
        const keysHTML = document.querySelectorAll('.vk-key');

        keysHTML.forEach(e => {
            if (e.getAttribute('name') == keyName) {                
                e.classList.remove('vk-key-active');
            }
        })

        if (keyName === 'CapsLock')
            keyboard._toggleCapsLock();
      
        
    }, false);
})