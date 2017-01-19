import React from 'react';
import { Scene, Actions } from 'hanzojs/router';

module.exports = (store, modules) => {
  return Actions.create(
    <Scene key="root">
        <Scene key="helloworld" component={modules.Helloworld} hideNavBar />
    </Scene>
  );
};
