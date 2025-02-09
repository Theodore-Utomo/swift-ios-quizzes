# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
# Accessing API Endpoints
In order to access the API and make API calls to retrieve data, some steps need to be taken.
First you want to activate a virtual environment for python through 
- source .../.../swift-ios-quizzes/venv-fastapi/bin/activate

Once you're in the virtual environment, install the dependencies
- pip install "fastapi[standard]"
- pip install "uvicorn[standard]"

It's also common practice to update your pip, so run 
pip install --upgrade pip or whatever the command is to make sure pip is up to date

Once you're in the virtual environment, run the server with
 - uvicorn backed.app.main:app --reload

Once the server is running you can make API calls at the address it shows
An example API call is using fetch to request data at http://127.0.0.1:8000/quizzes to retrieve quizzes. This is mock data for now. Not integrated with database.

#NEW UPDATES
The user login is connected to Theo's personal Google Cloud Firebase account. The SECRET_KEY and GOOGLE_APPLICATION_CREDENTIALS are stored in an .env file. 

TODO: Fix login so that when a user logs in, it automatically takes them to the main page.