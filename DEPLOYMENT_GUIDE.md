# Guide de Déploiement Backend - Correction Erreur 403

## 🔍 Diagnostic Rapide

### Étape 1 : Vérifier si le serveur a les changements
1. Accédez à **cPanel** → **File Manager**
2. Navigez vers `backend/` → `server.js`
3. Cherchez la ligne qui contient `admin_tokens` (Ctrl+F)
   - ✅ Si vous la trouvez → changements appliqués
   - ❌ Si absente → le fichier n'a pas été mis à jour

### Étape 2 : Vérifier les logs du serveur
1. **cPanel** → **Terminal** (ou SSH)
2. Lancez :
   ```bash
   cd ~/Agence_voyage/backend
   tail -f logs/server.log  # ou npm start pour voir les erreurs
   ```
3. Cherchez les erreurs de connexion DB ou "CREATE TABLE"

### Étape 3 : Vérifier la connexion DB
En Terminal cPanel :
```bash
psql -U $DB_USER -h $DB_HOST -d $DB_NAME -c "SELECT * FROM admin_tokens LIMIT 5;"
```
- ✅ Si vous voyez des résultats → table existe
- ❌ Si erreur "relation does not exist" → les tables n'ont pas été créées

---

## 📋 Processus de Déploiement Complet

### Option A : Via cPanel File Manager (Recommandé pour mise à jour simple)

1. **Télécharger le fichier modifié**
   - Sur votre machine : `c:\Users\Eli Valisoa\Agence_voyage\backend\server.js`
   - Ouvrez le fichier et vérifiez qu'il contient "admin_tokens"

2. **Uploader via cPanel**
   - Allez à **cPanel** → **File Manager**
   - Naviguez vers `backend/`
   - Cliquez **Upload** et sélectionnez `server.js` de votre machine
   - Confirmez le remplacement

3. **Redémarrer Node.js**
   - Allez à **cPanel** → **Node.js Manager** (ou **Application Manager**)
   - Trouvez votre application (port 5000 ou `Agence_voyage`)
   - Cliquez **Restart**
   - Attendez 15-30 secondes

4. **Vérifier les erreurs de démarrage**
   - Allez à **cPanel** → **View Logs** ou **Terminal**
   - Lancez :
     ```bash
     tail -n 50 ~/Agence_voyage/backend/logs/server.log
     ```
   - Si erreurs "Cannot connect to database" → problème DB
   - Si "admin_tokens table created" → succès ✅

---

### Option B : Via Git Push (si repo GitHub configuré)

1. Validez les changements localement :
   ```bash
   cd c:\Users\Eli Valisoa\Agence_voyage
   git add backend/server.js
   git commit -m "Fix: Migrate token storage to database"
   git push origin main
   ```

2. Sur le serveur cPanel :
   ```bash
   cd ~/Agence_voyage
   git pull origin main
   ```

3. Redémarrez Node.js via cPanel

---

## ✅ Vérification Post-Déploiement

Après redémarrage, testez dans la console navigateur (DevTools → Console) :

```javascript
// 1. Testez le login
fetch('https://explorile.mg/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username: 'Tourisme', password: '2026' })
})
.then(r => r.json())
.then(data => {
  console.log('Token reçu:', data.token);
  localStorage.setItem('adminToken', data.token);
})
.catch(e => console.error('Erreur login:', e));

// 2. Attendez 2-3 secondes, puis testez messages
setTimeout(() => {
  const token = localStorage.getItem('adminToken');
  fetch('https://explorile.mg/api/messages', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => console.log('Messages:', data))
  .catch(e => console.error('Erreur messages:', e));
}, 3000);
```

**Résultats attendus :**
- ✅ Token reçu dans la console
- ✅ Tableau de messages retourné (pas 403)
- ❌ Si toujours 403 → voir section Troubleshooting ci-dessous

---

## 🚨 Troubleshooting

### Problème : Toujours 403 après redémarrage

**Cause 1 : Le fichier n'a pas été mis à jour**
- Retéléchargez `server.js` depuis votre machine locale
- Vérifiez que la date de modification a changé en cPanel
- Redémarrez à nouveau

**Cause 2 : La base de données ne s'est pas créée**
- En Terminal cPanel :
  ```bash
  psql -U $DB_USER -h $DB_HOST -d $DB_NAME
  \dt  # Listez les tables - cherchez "admin_tokens"
  ```
- Si absent, créez manuellement :
  ```sql
  CREATE TABLE IF NOT EXISTS admin_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  CREATE INDEX idx_admin_tokens_token ON admin_tokens(token);
  ```

**Cause 3 : Le cache navigateur**
- Ouvrez DevTools → Application → Clear storage
- Puis rafraîchissez la page (Ctrl+Shift+R pour videz le cache)
- Reconnectez-vous

**Cause 4 : CORS bloqué par le serveur**
- Vérifiez que `app.use(cors());` est présent au début de `server.js` (ligne 11)
- Si absent, ajoutez-le juste après `const app = express();`

### Problème : Erreur "Cannot find module" après redémarrage

- Assurez-vous que toutes les dépendances sont installées :
  ```bash
  cd ~/Agence_voyage/backend
  npm install
  ```
- Puis redémarrez l'application en cPanel

---

## 📌 Checklist Final

- [ ] Fichier `backend/server.js` mis à jour sur cPanel (vérifié en File Manager)
- [ ] Application Node.js redémarrée (via cPanel Node.js Manager)
- [ ] Pas d'erreurs dans les logs
- [ ] Table `admin_tokens` créée en DB
- [ ] Login fonctionne (token reçu)
- [ ] `/api/messages` répond sans 403
- [ ] `/api/bookings` répond sans 403
- [ ] Page Admin charge correctement sans erreur TypeScript

---

## 💡 Notes Importantes

1. **Token Persistence** : Avec les nouveaux changements, les tokens restent valides après redémarrage du serveur
2. **Expiration Auto** : Les tokens expirent après 24h et sont nettoyés automatiquement toutes les 6h
3. **Session Utilisateur** : Après déploiement, l'utilisateur doit se reconnecter UNE FOIS, puis ça marche
4. **Diagnostic** : Si les erreurs persiste, vérifiez les logs en Terminal/SSH avant de chercher ailleurs

