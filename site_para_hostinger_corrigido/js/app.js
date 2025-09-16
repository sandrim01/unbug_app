// Unbug Solutions TI - Aplicação Principal
// Utilitários e funções globais

// Configuração da aplicação
const APP_CONFIG = {
    name: 'Unbug Solutions TI',
    version: '1.0.0',
    apiBaseUrl: '/api'
};

// Utilitários para formatação
class Formatters {
    static phone(value) {
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        }
        return value;
    }

    static currency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }

    static date(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }

    static datetime(dateString) {
        return new Date(dateString).toLocaleString('pt-BR');
    }

    static status(status) {
        const statusMap = {
            'aberto': { text: 'Aberto', class: 'badge-danger' },
            'em_andamento': { text: 'Em Andamento', class: 'badge-warning' },
            'aguardando_cliente': { text: 'Aguardando Cliente', class: 'badge-info' },
            'resolvido': { text: 'Resolvido', class: 'badge-success' },
            'fechado': { text: 'Fechado', class: 'badge-secondary' }
        };
        const statusInfo = statusMap[status] || { text: 'Desconhecido', class: 'badge-secondary' };
        return `<span class="badge ${statusInfo.class}">${statusInfo.text}</span>`;
    }

    static urgencia(urgencia) {
        const urgenciaMap = {
            'baixa': { text: 'Baixa', class: 'badge-info' },
            'media': { text: 'Média', class: 'badge-warning' },
            'alta': { text: 'Alta', class: 'badge-danger' },
            'critica': { text: 'Crítica', class: 'badge-danger' }
        };
        const urgenciaInfo = urgenciaMap[urgencia] || { text: 'Média', class: 'badge-warning' };
        return `<span class="badge ${urgenciaInfo.class}">${urgenciaInfo.text}</span>`;
    }
}

// Classe para gerenciar notificações
class NotificationManager {
    static show(message, type = 'info', duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">&times;</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        return notification;
    }

    static success(message, duration) {
        return this.show(message, 'success', duration);
    }

    static error(message, duration) {
        return this.show(message, 'danger', duration);
    }

    static warning(message, duration) {
        return this.show(message, 'warning', duration);
    }

    static info(message, duration) {
        return this.show(message, 'info', duration);
    }
}

// Classe para requisições HTTP
class ApiClient {
    static async request(url, options = {}) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const token = localStorage.getItem('adminToken');
        if (token) {
            defaultOptions.headers['Authorization'] = `Bearer ${token}`;
        }

        const finalOptions = {
            ...defaultOptions,
            ...options,
            headers: {
                ...defaultOptions.headers,
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, finalOptions);
            
            // Se não autorizado, remover token
            if (response.status === 401 || response.status === 403) {
                localStorage.removeItem('adminToken');
                if (window.location.pathname === '/admin') {
                    window.location.reload();
                }
            }

            const data = await response.json();
            return { response, data };
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    static async get(url) {
        const { data } = await this.request(url);
        return data;
    }

    static async post(url, body) {
        const { data } = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(body),
        });
        return data;
    }

    static async patch(url, body) {
        const { data } = await this.request(url, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
        return data;
    }

    static async delete(url) {
        const { data } = await this.request(url, {
            method: 'DELETE',
        });
        return data;
    }
}

// Validadores
class Validators {
    static email(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    static phone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        return cleaned.length >= 10;
    }

    static required(value) {
        return value && value.trim().length > 0;
    }

    static minLength(value, length) {
        return value && value.length >= length;
    }

    static maxLength(value, length) {
        return !value || value.length <= length;
    }
}

// Classe para gerenciar formulários
class FormManager {
    constructor(formElement) {
        this.form = formElement;
        this.validators = {};
        this.setupFormValidation();
    }

    setupFormValidation() {
        this.form.addEventListener('submit', (e) => {
            if (!this.validateForm()) {
                e.preventDefault();
            }
        });

        // Validação em tempo real
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
        });
    }

    addValidator(fieldName, validator, message) {
        if (!this.validators[fieldName]) {
            this.validators[fieldName] = [];
        }
        this.validators[fieldName].push({ validator, message });
    }

    validateField(field) {
        const fieldName = field.name || field.id;
        const validators = this.validators[fieldName];
        
        if (!validators) return true;

        // Remover mensagem de erro anterior
        this.removeFieldError(field);

        for (const { validator, message } of validators) {
            if (!validator(field.value)) {
                this.showFieldError(field, message);
                return false;
            }
        }

        return true;
    }

    validateForm() {
        let isValid = true;
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        field.style.borderColor = '#ef4444';
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#ef4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '5px';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }

    removeFieldError(field) {
        field.style.borderColor = '';
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }

    getFormData() {
        const formData = new FormData(this.form);
        return Object.fromEntries(formData);
    }

    reset() {
        this.form.reset();
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            this.removeFieldError(input);
        });
    }
}

// Utilitários DOM
class DOMUtils {
    static createElement(tag, attributes = {}, children = []) {
        const element = document.createElement(tag);
        
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className') {
                element.className = value;
            } else if (key === 'innerHTML') {
                element.innerHTML = value;
            } else {
                element.setAttribute(key, value);
            }
        });

        children.forEach(child => {
            if (typeof child === 'string') {
                element.appendChild(document.createTextNode(child));
            } else {
                element.appendChild(child);
            }
        });

        return element;
    }

    static show(element) {
        element.style.display = 'block';
    }

    static hide(element) {
        element.style.display = 'none';
    }

    static toggle(element) {
        element.style.display = element.style.display === 'none' ? 'block' : 'none';
    }

    static addClass(element, className) {
        element.classList.add(className);
    }

    static removeClass(element, className) {
        element.classList.remove(className);
    }

    static toggleClass(element, className) {
        element.classList.toggle(className);
    }
}

// Classe para loading
class LoadingManager {
    static show(element, text = 'Carregando...') {
        const loading = document.createElement('div');
        loading.className = 'loading-overlay';
        loading.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div class="loading" style="margin: 0 auto 10px;"></div>
                <div>${text}</div>
            </div>
        `;
        loading.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255,255,255,0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        element.style.position = 'relative';
        element.appendChild(loading);
        return loading;
    }

    static hide(element) {
        const loading = element.querySelector('.loading-overlay');
        if (loading) {
            loading.remove();
        }
    }
}

// Utilitários de localStorage
class Storage {
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
        }
    }

    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('Erro ao ler do localStorage:', error);
            return defaultValue;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('Erro ao remover do localStorage:', error);
        }
    }

    static clear() {
        try {
            localStorage.clear();
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
        }
    }
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Função para scroll suave
function smoothScrollTo(element) {
    element.scrollIntoView({ behavior: 'smooth' });
}

// Adicionar estilos para animações
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes slideInUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .fade-in {
        animation: fadeIn 0.3s ease;
    }

    .slide-in-up {
        animation: slideInUp 0.3s ease;
    }
`;
document.head.appendChild(animationStyles);

// Exportar para uso global
window.UnbugApp = {
    Formatters,
    NotificationManager,
    ApiClient,
    Validators,
    FormManager,
    DOMUtils,
    LoadingManager,
    Storage,
    debounce,
    throttle,
    smoothScrollTo
};

// Log da inicialização
console.log(`${APP_CONFIG.name} v${APP_CONFIG.version} carregado com sucesso!`);
