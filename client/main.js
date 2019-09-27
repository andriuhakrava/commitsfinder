import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import App from '../imports/ui/components/App/App.js';
 
import './main.html';

Meteor.startup(() => render(<App />, document.querySelector("#app")));
