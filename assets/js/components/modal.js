/**
* File: assets/js/components/modal.js
* Enhanced modal management with animations and callbacks
*/

class ModalManager {
    constructor() {
        this.modals = new Map();
        this.initializeGlobalListeners();
    }
 
    initializeGlobalListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.activeModal) {
                this.hide(this.activeModal.id);
            }
        });
    }
 
    register(modalId, options = {}) {
        const modalElement = document.getElementById(modalId);
        if (!modalElement) return;
 
        const config = {
            keyboard: true,
            backdrop: 'static',
            focus: true,
            ...options
        };
 
        const modal = new bootstrap.Modal(modalElement, config);
        
        this.modals.set(modalId, {
            element: modalElement,
            instance: modal,
            callbacks: {
                show: [],
                hide: [],
                hidden: []
            }
        });
 
        this.setupModalListeners(modalId);
    }
 
    setupModalListeners(modalId) {
        const modal = this.modals.get(modalId);
        if (!modal) return;
 
        modal.element.addEventListener('show.bs.modal', () => {
            this.activeModal = modal;
            modal.callbacks.show.forEach(cb => cb());
        });
 
        modal.element.addEventListener('hide.bs.modal', (e) => {
            const canHide = modal.callbacks.hide.every(cb => cb() !== false);
            if (!canHide) {
                e.preventDefault();
            }
        });
 
        modal.element.addEventListener('hidden.bs.modal', () => {
            modal.callbacks.hidden.forEach(cb => cb());
            if (this.activeModal === modal) {
                this.activeModal = null;
            }
        });
    }
 
    show(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.instance.show();
            return true;
        }
        return false;
    }
 
    hide(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.instance.hide();
            return true;
        }
        return false;
    }
 
    onShow(modalId, callback) {
        this.addCallback(modalId, 'show', callback);
    }
 
    onHide(modalId, callback) {
        this.addCallback(modalId, 'hide', callback);
    }
 
    onHidden(modalId, callback) {
        this.addCallback(modalId, 'hidden', callback);
    }
 
    addCallback(modalId, event, callback) {
        const modal = this.modals.get(modalId);
        if (modal && typeof callback === 'function') {
            modal.callbacks[event].push(callback);
        }
    }
 
    updateContent(modalId, content, type = 'body') {
        const modal = this.modals.get(modalId);
        if (!modal) return false;
 
        const selector = type === 'body' ? '.modal-body' : 
                        type === 'title' ? '.modal-title' : 
                        type === 'footer' ? '.modal-footer' : null;
 
        if (selector) {
            const element = modal.element.querySelector(selector);
            if (element) {
                if (typeof content === 'string') {
                    element.innerHTML = content;
                } else if (content instanceof Node) {
                    element.innerHTML = '';
                    element.appendChild(content);
                }
                return true;
            }
        }
        return false;
    }
 
    removeModal(modalId) {
        const modal = this.modals.get(modalId);
        if (modal) {
            modal.instance.dispose();
            this.modals.delete(modalId);
        }
    }
 }
 
 export default ModalManager;