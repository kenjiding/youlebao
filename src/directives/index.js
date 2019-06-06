import Vue from 'vue';
import loadmore from './loadmore';
import has from './has';

const directives = {
  loadmore,
  has,
};

Object.keys(directives).forEach(key => Vue.directive(key, directives[key]));
