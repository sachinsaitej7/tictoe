export default function clientMiddleware(client) {
  return ({dispatch, getState}) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }

      const { promise, types, repeat, ...rest } = action; // eslint-disable-line no-redeclare
      if (!promise) {
        return next(action);
      }

      let _repeat = repeat ? repeat : 1;

      const [REQUEST, SUCCESS, FAILURE] = types;
      let actionPromises = [];

      for(let i = 0; i < _repeat; ++i){
        next({...rest, type: REQUEST});

        const actionPromise = !repeat ? promise(client) : promise[i](client);
        actionPromise.then(
          (result) => next({...rest, result, type: SUCCESS}),
          (error) => next({...rest, error, type: FAILURE})
        ).catch((error)=> {
          console.error('MIDDLEWARE ERROR:', error);
          next({...rest, error, type: FAILURE});
        });

        actionPromises.push(actionPromise);
      }

      return new Promise((resolve, reject) => {
          Promise.all(actionPromises).then(result => {
          resolve(result);
        }).catch(err => reject(err));
      });
    };
  };
}
