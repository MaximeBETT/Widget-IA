// Widget-IA - Lightweight chatbot widget
(function() {
  class WidgetIA {
    constructor(config) {
      this.siteId = config.siteId || 'default';
      this.apiUrl = config.apiUrl || 'http://localhost:3000';
      this.visitorId = this.generateVisitorId();
      this.init();
    }

    generateVisitorId() {
      let id = localStorage.getItem('widget_ia_visitor_id');
      if (!id) {
        id = 'visitor_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('widget_ia_visitor_id', id);
      }
      return id;
    }

    init() {
      // Create widget HTML
      this.createWidget();
      // Load styles
      this.injectStyles();
      // Setup event listeners
      this.setupListeners();
    }

    createWidget() {
      const container = document.createElement('div');
      container.id = 'widget-ia-container';
      container.innerHTML = `
        <div class="widget-ia-bubble" id="widget-ia-bubble">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
        <div class="widget-ia-panel hidden" id="widget-ia-panel">
          <div class="widget-ia-header">
            <h3>Assistant IA</h3>
            <button id="close-widget" class="close-btn">✕</button>
          </div>
          <div class="widget-ia-messages" id="messages-container"></div>
          <div class="widget-ia-input">
            <input type="text" id="message-input" placeholder="Posez votre question..." />
            <button id="send-btn">Envoyer</button>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    }

    injectStyles() {
      const style = document.createElement('style');
      style.textContent = `
        #widget-ia-container {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .widget-ia-bubble {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
          z-index: 9998;
        }

        .widget-ia-bubble:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .widget-ia-panel {
          position: fixed;
          bottom: 100px;
          right: 24px;
          width: 380px;
          height: 600px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
          display: flex;
          flex-direction: column;
          z-index: 9997;
          animation: slideUp 0.3s ease;
        }

        .widget-ia-panel.hidden {
          display: none;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .widget-ia-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-radius: 12px 12px 0 0;
        }

        .widget-ia-header h3 {
          margin: 0;
          font-size: 16px;
        }

        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 20px;
          padding: 0;
        }

        .widget-ia-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .message {
          display: flex;
          margin-bottom: 12px;
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .message.visitor {
          justify-content: flex-end;
        }

        .message-bubble {
          max-width: 70%;
          padding: 12px 16px;
          border-radius: 12px;
          word-wrap: break-word;
        }

        .message.visitor .message-bubble {
          background: #667eea;
          color: white;
          border-radius: 12px 2px 12px 12px;
        }

        .message.ai .message-bubble {
          background: #f0f0f0;
          color: #333;
          border-radius: 2px 12px 12px 12px;
        }

        .widget-ia-input {
          display: flex;
          gap: 8px;
          padding: 16px;
          border-top: 1px solid #e0e0e0;
        }

        #message-input {
          flex: 1;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          outline: none;
          transition: border-color 0.2s;
        }

        #message-input:focus {
          border-color: #667eea;
        }

        #send-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          cursor: pointer;
          font-weight: 500;
          transition: transform 0.2s;
        }

        #send-btn:hover {
          transform: translateY(-2px);
        }

        @media (max-width: 480px) {
          .widget-ia-panel {
            width: calc(100% - 32px);
            height: 70vh;
          }
        }
      `;
      document.head.appendChild(style);
    }

    setupListeners() {
      const bubble = document.getElementById('widget-ia-bubble');
      const panel = document.getElementById('widget-ia-panel');
      const closeBtn = document.getElementById('close-widget');
      const sendBtn = document.getElementById('send-btn');
      const input = document.getElementById('message-input');

      bubble.addEventListener('click', () => {
        panel.classList.toggle('hidden');
        if (!panel.classList.contains('hidden')) {
          input.focus();
        }
      });

      closeBtn.addEventListener('click', () => {
        panel.classList.add('hidden');
      });

      sendBtn.addEventListener('click', () => this.sendMessage());
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.sendMessage();
      });
    }

    sendMessage() {
      const input = document.getElementById('message-input');
      const message = input.value.trim();

      if (!message) return;

      // Add message to UI
      this.addMessageToUI('visitor', message);
      input.value = '';

      // Send to server
      fetch(`${this.apiUrl}/api/chat/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          siteId: this.siteId,
          visitorId: this.visitorId,
          question: message
        })
      })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          if (data.success && data.response) {
            this.addMessageToUI('ai', data.response);
          } else if (data.error) {
            this.addMessageToUI('ai', `Erreur: ${data.error}`);
          } else {
            this.addMessageToUI('ai', 'Réponse invalide du serveur.');
          }
        })
        .catch(err => {
          console.error('Widget-IA error:', err);
          this.addMessageToUI('ai', `Erreur: ${err.message}`);
        });
    }

    addMessageToUI(type, content) {
      const container = document.getElementById('messages-container');
      const msgDiv = document.createElement('div');
      msgDiv.className = `message ${type}`;
      msgDiv.innerHTML = `<div class="message-bubble">${this.escapeHtml(content)}</div>`;
      container.appendChild(msgDiv);
      container.scrollTop = container.scrollHeight;
    }

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.WidgetIA = WidgetIA;
      // Auto-init with default config
      new WidgetIA({
        siteId: window.WIDGET_IA_SITE_ID || 'default',
        apiUrl: window.WIDGET_IA_API_URL || 'http://localhost:3000'
      });
    });
  } else {
    window.WidgetIA = WidgetIA;
    new WidgetIA({
      siteId: window.WIDGET_IA_SITE_ID || 'default',
      apiUrl: window.WIDGET_IA_API_URL || 'http://localhost:3000'
    });
  }
})();
