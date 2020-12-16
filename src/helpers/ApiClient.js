import superagent from 'superagent';
import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

function formatUrl(path) {
  //if full url is given then return this path
  if(path.substr(0, 4) === 'http') return path;

  const adjustedPath = path[0] !== '/' ? '/' + path : path;
  // Prepend `/api` to relative URL, to proxy to API server.
  return config.path.apiserver + adjustedPath;
  // return custom backend server + adjustedPath;
}

export default class ApiClient {
  constructor(req) {
    methods.forEach((method) =>
      this[method] = (path, { params, data, files, progressTracker, headers } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));

        if (params) {
          request.query(params);
        }

        // request.withCredentials();

        if (data) {
          request.send(data);
        }

        if(headers) {
          Object.keys(headers).map(key => request.set(key, headers[key]))
        }

        if (files){
          // files.map(file =>
          //   request.attach(file)
          // );
          request.attach('random_screen', files[0])
        }

        if(progressTracker){
          request.on('progress', progressTracker);
        }

        request.end(function(err, { body, text } = {}) {
          if(err){
            reject(body || err)
          }
          else{
            if(body) resolve(body);
            else{
              try{
                resolve(JSON.parse(text));
              }
              catch(e){
                resolve(body);
              }
            }
          }
        });
      }));
  }
  /*
   * There's a V8 bug where, when using Babel, exporting classes with only
   * constructors sometimes fails. Until it's patched, this is a solution to
   * "ApiClient is not defined" from issue #14.
   * https://github.com/erikras/react-redux-universal-hot-example/issues/14
   *
   * Relevant Babel bug (but they claim it's V8): https://phabricator.babeljs.io/T2455
   *
   * Remove it at your own risk.
   */
  empty() {}
}
