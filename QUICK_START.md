# 🚀 Widget-IA est prêt !

👋 Bon maintenant, voici ce que vous devez savoir :

## ✅ Installation complète

Tout est installé et configuré. Le serveur est **déjà en cours d'exécution** sur le port **3000**.

## 🎯 Accès rapide

### 1️⃣ **Admin Panel** (gérer les conversations)
👉 http://localhost:3000/admin.html

Identifiants par défaut:
- **Token** : `your-secret-admin-token-change-me`
- **Site ID** : `mon-site.com` (ou ce que vous voulez)

### 2️⃣ **Page d'exemple** (voir le widget en action)
👉 http://localhost:3000/example.html

Le widget chatbot est déjà intégré sur cette page. Cliquez sur la bulle violette en bas à droite !

### 3️⃣ **Code du widget** (à intégrer sur VOTRE site)
👉 http://localhost:3000/widget.js

## 📝 Intégrer le widget sur VOTRE site

Ajoutez ceci dans le `<body>` de votre page HTML :

```html
<script>
  window.WIDGET_IA_SITE_ID = 'votre-domaine.com';
  window.WIDGET_IA_API_URL = 'http://localhost:3000';
</script>
<script src="http://localhost:3000/widget.js"></script>
```

Remplacez :
- `votre-domaine.com` par votre ID de site (unique)
- `http://localhost:3000` par l'URL de votre serveur (si en production)

## 🔐 Sécurité en production

**AVANT de mettre en production**, changez :

1. **ADMIN_TOKEN** dans `.env`
   ```env
   ADMIN_TOKEN=votre-token-super-secret-et-long
   ```

2. **Domaines autorisés** pour CORS dans `src/server.js`

3. **Intégrez une véritable API IA** (OpenAI, Claude, etc.)
   - Fichier à modifier : `src/server/controllers/chatController.js`
   - Fonction : `generateAIResponse()`

## 📚 Documentation compète

Consultez ces fichiers :
- **[README.md](README.md)** - Vue d'ensemble
- **[SPECS.md](SPECS.md)** - Spécifications du projet
- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Guide détaillé (A LIRE!)

## 🧪 Tester rapidement

1. Ouvrez http://localhost:3000/example.html dans votre navigateur
2. Cliquez sur la bulle de chat en bas à droite
3. Posez une question
4. Allez à l'admin (http://localhost:3000/admin.html) pour corriger les réponses

## 🔄 Flux de travail

### Pour les visiteurs
1. Posent des questions via le widget
2. Reçoivent des réponses de l'IA

### Pour l'admin
1. Voit toutes les conversations
2. Signale les mauvaises réponses
3. Corrige manuellement
4. L'IA apprend de ces corrections

## 📂 Structure

```
Widget-IA/
├── src/
│   ├── server.js                    ← Serveur principal
│   ├── server/routes/               ← API endpoints
│   ├── server/controllers/          ← Logique métier
│   └── server/middleware/           ← Authentification
├── public/
│   ├── widget.js                    ← À intégrer sur vos sites
│   ├── admin.html                   ← Panel administrateur
│   ├── example.html                 ← Page de démo
│   └── integration.html             ← Guide visuel
├── data/                            ← Conversations (JSON)
└── ... (fichiers de config)
```

## 💡 Prochaines étapes

1. ✅ Testez le widget sur `example.html`
2. ✅ Accédez à l'admin panel
3. ✅ Intégrez le widget sur l'un de vos sites
4. ✅ Configurez un vrai API IA (OpenAI, etc.)
5. ✅ Déployez en production (Heroku, AWS, etc.)

## 🆘 Besoin d'aide ?

- La bulle ne s'affiche pas ? Vérifiez la console (F12)
- Admin ne marche pas ? Utilisez le bon token
- Questions sur l'intégration ? Voir [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)

## 🎉 Bravo !

Vous avez maintenant un système complet de chatbot IA intégrable et administrable !

Profitez ! 🚀
