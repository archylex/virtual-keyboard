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
        
        /*if (keyName != 'Shift' && keyName != 'Alt' && keyName != 'Control' && keyName != 'Tab' && keyName != 'Enter' && keyName != 'Backspace')*/
        if (keyName.length === 1) {
            nowLang = ((keyName.charCodeAt(0) >= 97 && keyName.charCodeAt(0) <= 122) || (keyName.charCodeAt(0) >= 65 && keyName.charCodeAt(0) <= 90)) ? 'en' : 'ru';
               
            if (keyboard.properties.lang != nowLang) {
                keyboard.properties.lang = nowLang;
                keyboard.createNewKeys();
            }
        }
                
        const keysHTML = document.querySelectorAll('.vk-key');

        textarea.textarea.focus();

        keysHTML.forEach(e => {
            if (e.getAttribute('name') == keyName) { 
                e.classList.add('vk-key-active');
                if (keyName === 'Escape') {
                    keyboard.hide();
                    document.querySelectorAll('.use-keyboard-input')[0].blur();
                }
                if (keyName == 'CapsLock') {
                    keyboard.properties.capsLock = !keyboard.properties.capsLock;
                    e.classList.toggle('vk-key-on', keyboard.properties.capsLock);
                }

                if (keyName == 'Shift') {
                    keyboard.properties.shift = true;
                    e.classList.toggle('vk-key-on', keyboard.properties.shift);
                    keyboard.createNewKeys();
                }
            }
        });
        const space = document.querySelector('.big_key');
        if (space.getAttribute('name') === keyName) {
            space.classList.add('big_key-active');
        }
    }, false);

    document.addEventListener('keyup', (event) => {
        const keyName = event.key;
        const keysHTML = document.querySelectorAll('.vk-key');

        keysHTML.forEach(e => {
            if (e.getAttribute('name') == keyName) {                
                e.classList.remove('vk-key-active');
            }

            if (keyName == 'Shift') {
                keyboard.properties.shift = false;
                e.classList.toggle('vk-key-on', keyboard.properties.shift);
                keyboard.createNewKeys();
            }
        });
        const space = document.querySelector('.big_key');
        if (space.getAttribute('name') === keyName) {
            space.classList.remove('big_key-active');
        }
    }, false);
})
