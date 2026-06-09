document.addEventListener('submit', (e) => {
    e.preventDefault();
}, true);

const keys = ['t', 'y', 'g', 'h'];

function triggerReactClick(element) {
    if (!element) return;
    
    const fiberKey = Object.keys(element).find(k => k.startsWith("__reactFiber$"));
    if (!fiberKey) return;
    
    let fiber = element[fiberKey];
    
    const fakeEvent = {
        isTrusted: true,
        bubbles: true,
        cancelable: true,
        preventDefault: () => {},
        stopPropagation: () => {},
        target: element,
        currentTarget: element,
        type: 'pointerdown',
        button: 0,
        buttons: 1
    };

    while (fiber) {
        const props = fiber.memoizedProps;
        
        if (props && props.onPointerDown) {
            props.onPointerDown(fakeEvent);
            return;
        }
        if (props && props.onClick) {
            fakeEvent.type = 'click';
            props.onClick(fakeEvent);
            return;
        }
        
        fiber = fiber.return;
    }
}

window.addEventListener('keydown', (e) => {
    const buttons = document.querySelectorAll('button[data-functional-selector^="answer-"]');
    const keyIndex = keys.indexOf(e.key.toLowerCase());
    
    if (keyIndex !== -1 && buttons[keyIndex]) {
        e.preventDefault();
        triggerReactClick(buttons[keyIndex]);
    }
});
