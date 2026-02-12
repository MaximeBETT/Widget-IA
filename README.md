# 🤖 Widget-IA - Chatbot IA intégrable

Un widget JavaScript **léger, facile à intégrer** pour ajouter un chatbot IA à votre site en quelques secondes.

## ✨ Fonctionnalités principales

### Pour les visiteurs
- 💬 Interface de chat simple et intuitive
- ⚡ Réponses instantanées de l'IA
- 📱 Responsive (desktop, tablette, mobile)
- 🔒 Aucun accès aux outils d'admin

### Pour les propriétaires de site (Admin)
- 📊 Historique complet des conversations
- 🚫 Signalement des mauvaises réponses
- ✏️ Correction manuelle des réponses
- ✅ Validation des réponses correctes
- 🎯 Amélioration continue de l'IA via les corrections

## 🚀 Démarrage rapide

### 1. Installation

```bash
git clone <repo-url>
cd Widget-IA
npm install
```

### 2. Configuration

Créez un fichier `.env` :

```env
PORT=3000
ADMIN_TOKEN=your-secret-admin-token-change-me
```

### 3. Lancer le serveur

```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 4. Intégrer sur votre site

Ajoutez ces 2 lignes avant la fermeture `</body>` :

```html
<script>
  window.WIDGET_IA_SITE_ID = 'mon-site.com';
  window.WIDGET_IA_API_URL = 'http://localhost:3000';
</script>
<script src="http://localhost:3000/widget.js"></script>
```

✅ **C'est tout !** Le widget apparaîtra en bas à droite de votre page.

## 📁 Accès rapides

- **Admin Panel** : http://localhost:3000/admin.html
- **Example** : http://localhost:3000/example.html
- **Widget** : http://localhost:3000/widget.js

## 🔐 Identifiants par défaut

- **Token Admin** : `your-secret-admin-token-change-me`
- **Site ID** : `mon-site.com` (ou celui configuré)

## 📚 Documentation

Consultez [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) pour :
- L'intégration détaillée
- La configuration en production
- L'API complète
- La personnalisation
- Les solutions aux problèmes courants

## 📁 Structure du projet

```
Widget-IA/
├── src/
│   ├── server.js                    # Serveur Express principal
│   ├── server/
│   │   ├── routes/                   # Routes API
│   │   │   ├── chat.js              # Routes publiques
│   │   │   └── admin.js             # Routes protégées
│   │   ├── controllers/              # Logique métier
│   │   │   ├── chatController.js
│   │   │   └── adminController.js
│   │   └── middleware/
│   │       └── auth.js              # Authentification
│   └── client/
│       ├── widget/
│       └── admin/
├── public/
│   ├── widget.js                    # Widget compilé à intégrer
│   ├── admin.html                   # Panel d'administration
│   ├── example.html                 # Page d'exemple
│   └── integration.html             # Guide d'intégration
├── data/                            # Stockage des conversations (JSON)
├── SPECS.md                         # Spécifications du projet
├── INTEGRATION_GUIDE.md             # Guide détaillé
├── package.json
└── .env.example
```

## 🔌 API Endpoints

### Routes publiques

```
POST /api/chat/ask
- Envoyer une question au chatbot

POST /api/chat/message
- Enregistrer un message
```

### Routes protégées (admin)

```
GET /api/admin/conversations/:siteId
- Lister toutes les conversations

GET /api/admin/corrections/:siteId
- Lister l'historique des corrections

POST /api/admin/corrections/report
- Signaler une mauvaise réponse

POST /api/admin/corrections/submit
- Soumettre une correction manuelle

POST /api/admin/response/validate
- Valider une réponse comme correcte
```

## 🔧 Variables d'environnement

```env
PORT=3000                                      # Port du serveur
ADMIN_TOKEN=your-secret-admin-token            # Token d'authentification admin
NODE_ENV=development                           # Mode développement/production
```

## 🎨 Personnalisation

### Changer les couleurs du widget

Éditez le gradient dans `public/widget.js` (ligne ~90) :

```javascript
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Intégrer une véritable API IA

Remplacez la fonction `generateAIResponse()` dans `src/server/controllers/chatController.js` pour appeler :
- OpenAI (GPT-4)
- Claude
- Votre propre modèle
- Autre service IA

## 📊 Système de corrections

1. **Visiteur pose une question** → IA répond
2. **Admin signale une mauvaise réponse** dans le panel
3. **Admin propose une correction** manuelle
4. **Correction enregistrée** en base de données
5. **Les futures questions similaires** utilisent la correction

## 🚀 Déploiement

### Production sur Heroku

```bash
heroku create widget-ia
git push heroku main
heroku config:set ADMIN_TOKEN=your-strong-token
```

### Ou sur tout serveur Node.js

```bash
npm run build
npm start
```

## 🆘 Dépannage

**Le widget n'apparaît pas ?**
- Vérifiez que le serveur est en cours d'exécution
- Vérifiez `window.WIDGET_IA_SITE_ID` et `window.WIDGET_IA_API_URL`
- Ouvrez la console du navigateur (F12) pour les erreurs

**Les messages ne s'envoient pas ?**
- Vérifiez CORS dans le code serveur
- Vérifiez les logs du serveur
- Assurez-vous que le dossier `/data` existe

**L'admin ne fonctionne pas ?**
- Vérifiez le token admin
- Assurez-vous que siteId correspond à celui du widget
- Vérifiez les logs du serveur

## 📝 Licence

MIT

## 📞 Support

Pour toute question, consultez :
- [SPECS.md](SPECS.md) - Spécifications du projet
- [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) - Guide d'intégration complet
- Les commentaires dans le code source

---

**N'oubliez pas** : Changez le `ADMIN_TOKEN` en production ! 🔒
Projet de widget (assistant IA) à implémenter sur des sites
