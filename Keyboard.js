class Keyboard {
    elements = {
        main: null,
        keyContainer: null,
        keys: []
    }

    properties = {
        show: false,
        capsLock: false,
        lang: 'en',
        shift: false,
        sound: false,
        rec: false
    }

    audio = {
        type: new Audio('assets/audio/type.wav'),
        typeru: new Audio('assets/audio/typeru.wav'),
        enter: new Audio('assets/audio/enter.wav'),
        backspace: new Audio('assets/audio/backspace.wav'),
        shift: new Audio('assets/audio/shift.wav'),
        caps: new Audio('assets/audio/caps.wav'),
        lang: new Audio('assets/audio/lang.wav'),
        show: new Audio('assets/audio/open.wav'),
        hide: new Audio('assets/audio/close.wav')
    }

    textArea = null;

    rec = null;

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

        this.textArea.listener = () => {
            if (!this.properties.show)
                this.show();
        }
    }

    setDiffClasses (input, init) {
        for (let k of Object.keys(init)) {
            init[k] = input[k] !== undefined ? input[k] : init[k];  
        }  
    }

    _createKeys() {
        const fragment = document.createDocumentFragment();
        const enLayout = [
            '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
            'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
            'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', '\\', 'enter',
            'shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'left', 'right',
            'sound', 'shit', 'lang', 'space', 'done'
        ];
        const enBreakLine = ['backspace', ']', 'enter', 'right'];
        const enShiftLayout = [
            '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'backspace',
            'tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '{', '}',
            'caps', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', '|', 'enter',
            'shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', 'left', 'right',
            'sound', 'shit', 'lang', 'space', 'done'             
        ];
        const enShiftBreakLine = ['backspace', '}', 'enter', 'right'];
        const ruLayout = [
            'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
            'tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ',
            'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', '\\', 'enter',
            'shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'left', 'right',
            'sound', 'shit', 'lang', 'space', 'done'
        ];
        const ruBreakLine = ['backspace', 'ъ', 'enter', 'right'];
        const ruShiftLayout = [
            'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '_', '+', 'backspace',
            'tab', 'Й', 'Ц', 'У', 'К', 'Е', 'Н', 'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ',
            'caps', 'Ф', 'Ы', 'В', 'А', 'П', 'Р', 'О', 'Л', 'Д', 'Ж', 'Э', '/', 'enter',
            'shift', 'Я', 'Ч', 'С', 'М', 'И', 'Т', 'Ь', 'Б', 'Ю', ',', 'left', 'right',
            'sound', 'shit', 'lang', 'space', 'done'             
        ];
        const ruShiftBreakLine = ['backspace', 'Ъ', 'enter', 'right'];

        let keyLayout;
        let breakLine;

        if (this.properties.lang === 'en') {
            if (this.properties.shift) {
                keyLayout = enShiftLayout;
                breakLine = enShiftBreakLine;            
            } else {
                keyLayout = enLayout;
                breakLine = enBreakLine;            
            }            
        } else {
            if (this.properties.shift) {
                keyLayout = ruShiftLayout;
                breakLine = ruShiftBreakLine;            
            } else {
                keyLayout = ruLayout;
                breakLine = ruBreakLine;            
            }  
        }

        const isChrome = !!window.chrome;
        const lang = {
            en: 'en-US',
            ru: 'ru-RU'
        }
        let text_voice = ''

        if (isChrome) {
            window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            keyLayout.push('rec'); 
            this.rec = new SpeechRecognition();
            this.rec.interimResults = false;            
            this.rec.lang = lang[this.properties.lang];

            this.rec.addEventListener('result', e => {
                /* text_voice = Array.from(e.results)
                                .map(result => result[0])
                                .map(result => result.transcript)
                                .join(''); */                   
                text_voice = e.results[0][0].transcript;
            });

            this.rec.addEventListener("end", e => {                
                this.textArea.typeText(text_voice);
                text_voice = '';

                if (this.properties.rec)
                    this.rec.start();
                else
                    this.rec.stop();
            });
        }

        const createIconHTML = iconName => `<i class="material-icons">${iconName}</i>`;

        keyLayout.forEach(key => {
            const keyElement = document.createElement('div');
            const hexagonPart = document.createElement('div');
            const keyText = document.createElement('p');
            const insertLineBreak = breakLine.indexOf(key) !== -1;
            let skip = false;
            
            keyElement.classList.add(this.cssClasses.keyClass);
            hexagonPart.classList.add(this.cssClasses.hexagonPart);
            keyText.classList.add(this.cssClasses.keyTextClass);

            keyElement.appendChild(hexagonPart);
            keyElement.appendChild(hexagonPart.cloneNode(true));
            
            const hexagonPartText = hexagonPart.cloneNode(true);
            hexagonPartText.appendChild(keyText);
            keyElement.appendChild(hexagonPartText);
            
            switch (key) {
                case 'rec':                                        
                    keyText.innerHTML = createIconHTML('keyboard_voice');
                    keyElement.setAttribute('name', 'Voice');
                    keyElement.classList.toggle('vk-key-on-rec', this.properties.rec);
                    keyElement.addEventListener('mouseup', () => {  
                        this.properties.rec = !this.properties.rec;
                        keyElement.classList.toggle('vk-key-on-rec', this.properties.rec);                        
                        if (this.properties.rec)
                            this.rec.start();
                        else
                            this.rec.stop();
                    });                    
                    break;
                case 'backspace':
                    keyText.innerHTML = createIconHTML('backspace');
                    keyElement.setAttribute('name', 'Backspace');
                    keyElement.addEventListener('mousedown', () => {                        
                        if (this.properties.sound)
                            this.audio.backspace.play();                   
                    });
                    keyElement.addEventListener('mouseup', () => {  
                        this.textArea.removeChar();     
                    });
                    break;
                case 'caps':
                    keyText.innerHTML = createIconHTML('keyboard_capslock');
                    keyElement.setAttribute('name', 'CapsLock');
                    keyElement.classList.toggle('vk-key-on', this.properties.capsLock);
                    keyElement.addEventListener('mousedown', () => {
                        this.properties.capsLock = !this.properties.capsLock;                        
                        keyElement.classList.toggle('vk-key-on', this.properties.capsLock);
                        if (this.properties.sound)
                            this.audio.caps.play(); 
                        this.createNewKeys();
                    });
                    break;
                case 'enter':
                    keyText.innerHTML = createIconHTML('keyboard_return');
                    keyElement.setAttribute('name', 'Enter');    
                    keyElement.addEventListener('mousedown', () => {                        
                        if (this.properties.sound)
                            this.audio.enter.play();                   
                    });    
                    keyElement.addEventListener('mouseup', () => {  
                        this.textArea.typeText('\n');     
                    });
                    break;
                case 'lang':
                    keyText.innerHTML = createIconHTML('language');
                    keyElement.setAttribute('name', 'lang');
                    keyElement.addEventListener('mousedown', () => {
                        this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';    
                        this.createNewKeys();       
                        this.rec.lang = lang[this.properties.lang];                 
                        if (this.properties.sound)
                            this.audio.lang.play(); 
                    });
                    break;
                case 'shit':
                    keyText.textContent = this.properties.lang;
                    keyElement.setAttribute('name', 'lang');
                    keyElement.addEventListener('mousedown', () => {
                        this.properties.lang = this.properties.lang === 'en' ? 'ru' : 'en';    
                        this.createNewKeys();       
                        this.rec.lang = lang[this.properties.lang];                 
                        if (this.properties.sound)
                            this.audio.lang.play(); 
                    });
                    break;
                case 'sound':
                    if (this.properties.sound)
                        keyText.innerHTML = createIconHTML('music_note');
                    else 
                        keyText.innerHTML = createIconHTML('music_off');
                    keyElement.setAttribute('name', 'sound');
                    keyElement.addEventListener('mousedown', () => {
                        this.properties.sound = !this.properties.sound;
                        if (this.properties.sound)
                            keyText.innerHTML = createIconHTML('music_note');
                        else 
                            keyText.innerHTML = createIconHTML('music_off');
                        this.audio.type.play();   
                    });
                    break;
                case 'left':
                    keyText.innerHTML = createIconHTML('keyboard_arrow_left');
                    keyElement.setAttribute('name', 'ArrowLeft');
                    keyElement.addEventListener('mousedown', () => {                        
                        if (this.properties.sound) {
                            if (this.properties.lang === 'en')
                                this.audio.type.play();   
                            else
                                this.audio.typeru.play();   
                        }
                    });
                    keyElement.addEventListener('mouseup', () => {  
                        this.textArea.moveLeftCaretPosition(); 
                    });
                    break;
                case 'right':
                    keyText.innerHTML = createIconHTML('keyboard_arrow_right');
                    keyElement.setAttribute('name', 'ArrowRight');
                    keyElement.addEventListener('mousedown', () => {                        
                        if (this.properties.sound) {
                            if (this.properties.lang === 'en')
                                this.audio.type.play();   
                            else
                                this.audio.typeru.play();
                        }
                    });
                    keyElement.addEventListener('mouseup', () => {  
                        this.textArea.moveRightCaretPosition();
                    });
                    break;
                case 'shift':                    
                    keyText.innerHTML = createIconHTML('keyboard_shift');
                    keyText.classList.add('shift_correct');
                    keyElement.setAttribute('name', 'Shift');
                    keyElement.classList.toggle('vk-key-on', this.properties.shift);
                    keyElement.addEventListener('mousedown', () => {
                        this.properties.shift = !this.properties.shift;
                        this.createNewKeys();
                        keyElement.classList.toggle('vk-key-on', this.properties.shift);
                        if (this.properties.shift) 
                            this._createKeys();
                        else
                            this._createKeys();
                        if (this.properties.sound)
                            this.audio.shift.play();     
                    });
                    break;
                case 'space':
                    const linePart = document.createElement('div');
                    linePart.classList.add('vk_part_key-hexagon_part');
                    const lineTxt = document.createElement('div');
                    lineTxt.classList.add('vk_part_key-hexagon_part_txt');
                    lineTxt.innerHTML = createIconHTML('space_bar');
                    const keyPart = document.createElement('div');
                    keyPart.classList.add('vk_part_key');
                    keyPart.appendChild(linePart);
                    keyPart.appendChild(linePart.cloneNode(true));
                    const bigKey = document.createElement('div');
                    bigKey.classList.add('big_key');
                    bigKey.appendChild(keyPart);
                    bigKey.appendChild(keyPart.cloneNode(true));
                    bigKey.appendChild(keyPart.cloneNode(true));
                    bigKey.appendChild(lineTxt);
                    bigKey.setAttribute('name', ' ');
                    bigKey.addEventListener('mousedown', () => {                        
                        if (this.properties.sound) {
                            if (this.properties.lang === 'en')
                                this.audio.type.play();   
                            else
                                this.audio.typeru.play();
                        }
                    });
                    bigKey.addEventListener('mouseup', () => {  
                        this.textArea.typeText(' ');
                    });
                    fragment.appendChild(bigKey);
                    skip = true;           
                    break;            
                case 'done':
                    keyText.innerHTML = createIconHTML('check_circle');
                    keyElement.setAttribute('name', 'Escape');
                    keyElement.addEventListener('mouseup', () => {
                        this.hide();                        
                    });
                    break;                        
                case 'tab':
                    keyText.innerHTML = createIconHTML('keyboard_tab');
                    keyElement.setAttribute('name', 'tab');
                    keyElement.addEventListener('mousedown', () => {                                                
                        if (this.properties.sound) {
                            if (this.properties.lang === 'en')
                                this.audio.type.play();   
                            else
                                this.audio.typeru.play();
                        }
                    });
                    keyElement.addEventListener('mouseup', () => {  
                        this.textArea.typeText('\t');
                    });
                    break;    
                default:
                    keyText.textContent = this.properties.capsLock ^ this.properties.shift ? key.toUpperCase() : key.toLowerCase();
                    keyElement.setAttribute('name', key);
                    keyElement.addEventListener('mousedown', () => {   
                        if (this.properties.sound) {
                            if (this.properties.lang === 'en')
                                this.audio.type.play();   
                            else
                                this.audio.typeru.play();       
                        }                       
                    });                    
                    keyElement.addEventListener('mouseup', () => {   
                        if (this.properties.capsLock ^ this.properties.shift)
                            this.textArea.typeText(key.toUpperCase()); 
                        else
                            this.textArea.typeText(key.toLowerCase());                          
                    });
                    break;            
            }

            if (!skip)
                fragment.appendChild(keyElement);

            if (insertLineBreak)
                fragment.appendChild(document.createElement('br'));
        });

        return fragment;
    }

    createNewKeys() {
        this.elements.keyContainer.innerHTML = '';                        
        this.elements.keyContainer.appendChild(this._createKeys());
    }

    show() {
        if (!this.properties.show) {
            this.properties.show = true;
            if (this.properties.sound)
                this.audio.show.play();
            this.elements.main.classList.remove(this.cssClasses.hiddenClass);        
        }
    }

    hide() {
        if (this.properties.show) {
            this.properties.show = false;
            if (this.properties.sound)
                this.audio.hide.play();
            this.elements.main.classList.add(this.cssClasses.hiddenClass);
        }
    }    
}
