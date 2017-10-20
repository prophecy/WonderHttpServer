# WonderHttpServer

### WonderHttpServer is a Node.js + Express wrapper for high-reusability purpose.

## Getting Started

### Pre-requisite: You need to install Node.js before start this tutorial.

1. Install [wpm](https://github.com/prophecy/wpm)
2. [Set environment variable](https://stackoverflow.com/questions/7501678/set-environment-variables-on-mac-os-x-lion) to wpm directory 
3. Create file named "wonderconf.json" on your project directory
4. Copy and paste the text below in "wonderconf.json"  
```javascript
{
  "name": "WonderHttpSample",
  "description": "Simple WonderHttp",
  "host": "http://wondersaga.com/wonder_modules/",
  "version": "0.0.1",
  "dependencies": {
    "node.js": {
      "projectPath": "./WonderHttpSample/",
      "WonderHttpServer": "latest"
    }
  }
}
```
5. Open terminal, and browse to your project directory
6. Type
```
wpm install
wpm run WonderHttpServer
```
7. You will have new directories; "wonder_modules" and WonderHttpSample (This is your workspace, and try to start and run Node.js code here)
8. Type
```
cd ./WonderHttpSample
node Application.js
```
9. You already have HTTP server !!