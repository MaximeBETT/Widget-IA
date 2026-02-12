# Widget-IA - Documentation d'intégration

## 🚀 Installation rapide

### 1. Démarrer le serveur

```bash
npm install
npm start
```

Le serveur sera accessible à `http://localhost:3000`

### 2. Intégrer le widget sur votre site

Ajoutez simplement ces 2 lignes avant la fermeture du `</body>` :

```html
<script>
  window.WIDGET_IA_SITE_ID = 'mon-site.com';
  window.WIDGET_IA_API_URL = 'http://localhost:3000';
</script>
<script src="http://localhost:3000/widget.js"></script>
```

**Note** : Remplacez `mon-site.com` par votre ID de site unique et l'URL API par l'adresse de votre serveur.

## 📱 Le widget apparaîtra

- **En bas à droite** de votre page
- Une **bulle violette** qui s'ouvre en panneau de chat
- **Responsive** sur mobile et desktop

## 🔐 Accéder à l'admin

Allez à : `http://localhost:3000/admin.html`

**Identifiants par défaut** :
- Token admin : `your-secret-admin-token`
- ID du site : `mon-site.com` (ou celui que vous avez configuré)

### Variables d'environnement (.env)

```env
PORT=3000
ADMIN_TOKEN=your-secret-admin-token
```

## 📊 Fonctionnalités

### Pour les visiteurs
✅ Chat intégré au site
✅ Questions illimitées
✅ Interface simple et intuitive

### Pour l'admin
✅ Historique des conversations
✅ Signaler les mauvaises réponses
✅ Corriger manuellement les réponses
✅ Valider les réponses correctes

## 🔧 API Endpoints

### Public
- `POST /api/chat/ask` - Envoyer une question au chatbot
- `POST /api/chat/message` - Enregistrer un message

### Admin (authentifié)
- `GET /api/admin/conversations/:siteId` - Lister les conversations
- `GET /api/admin/corrections/:siteId` - Lister les corrections
- `POST /api/admin/corrections/report` - Signaler une mauvaise réponse
- `POST /api/admin/corrections/submit` - Soumettre une correction

## 📁 Structure du projet

```
Widget-IA/
├── src/
│   ├── server.js              (Serveur Express)
│   ├── server/
│   │   ├── routes/            (Endpoints API)
│   │   ├── controllers/       (Logique métier)
│   │   └── middleware/        (Auth, etc)
│   └── client/
│       ├── widget/            (Widget JavaScript)
│       └── admin/             (Interface admin)
├── public/
│   ├── widget.js              (Widget compilé - à intégrer)
│   └── admin.html             (Panel admin)
├── data/                      (Stockage JSON local)
└── package.json
```

## 🚀 Déploiement

Pour déployer en production :

1. Configurez les variables d'environnement
2. Changez `API_URL` dans le code du widget
3. Utilisez un service comme Heroku, Railway ou Vercel

```bash
npm run build
npm start
```

## 🔍 Dépannage

### Le widget n'apparaît pas
- Assurez-vous que le serveur est en cours d'exécution
- Vérifiez que `window.WIDGET_IA_SITE_ID` est défini
- Vérifiez la console du navigateur pour les erreurs

### Les messages ne s'envoient pas
- Vérifiez CORS : le domaine doit être autorisé
- Vérifiez l'URL API
- Vérifiez les logs du serveur

### L'admin ne fonctionne pas
- Assurez-vous que le token admin est correct
- L'ID du site doit correspondre à celui du widget
- Les fichiers de données doivent exister dans `/data`

## 📝 Personnalisation

### Changer les couleurs
Éditer les gradients dans [widget.js](public/widget.js) :
```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Intégrer une véritable API IA
Remplacer la fonction `generateAIResponse()` dans [chatController.js](src/server/controllers/chatController.js) avec un appel à votre API (OpenAI, etc).

## 📞 Support
Pour toute question, consultez le SPECS.md ou les commentaires du code.
