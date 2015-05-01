# DiagramLayoutManager
Before running any src files with node, please run `npm install` followed by `bower install` to install the node dependencies, then change working directory to `src` folder.
Bower and Browserify are both dependent Node modules for this project. Run the following commands:
 `sudo npm install -g bower`
 `sudo npm install -g browserify`

Generate the bundle.js script by running `npm run build-js` or `npm run watch-js`
In case of npm run command error, run this command directly to build js scripts: `browserify js/app.js > js/bundle.js -d`
To run the manager, run `node server.js` in the project root directory and open up `localhost:8080` on your browser