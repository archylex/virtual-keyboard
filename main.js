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
        })
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
        })
    }, false);
})