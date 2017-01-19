import { connect } from 'hanzojs';
import model from './model';

module.exports = {
  models: model,
  views: {
    Helloworld: connect((state) => state, model)(require('./views/index.js')),
  },
};
