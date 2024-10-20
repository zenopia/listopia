# Listopia Project Structure

```
listopia/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmDialog.js
│   │   │   ├── ListForm.js
│   │   │   ├── ListItem.js
│   │   │   └── LoadingSpinner.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── toast.js
│   │   ├── App.js
│   │   ├── constants.js
│   │   ├── index.css
│   │   └── index.js
│   └── package.json
└── server/
    ├── models/
    │   └── List.js
    ├── routes/
    │   └── lists.js
    ├── .env
    ├── package.json
    └── server.js
