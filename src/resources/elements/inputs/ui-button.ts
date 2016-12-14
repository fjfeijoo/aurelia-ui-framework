// 
// @description : 
// @author      : Adarsh Pastakia
// @copyright   : 2017
// @license     : MIT
import {autoinject, customElement, bindable, bindingMode, children, inlineView, useView, containerless, View, DOM} from 'aurelia-framework';
import {UIEvent} from "../../utils/ui-event";
import {UIUtils} from "../../utils/ui-utils";

@autoinject()
@inlineView(`<template role="button" class="ui-button \${theme} \${busy?'ui-busy':''} \${disabled?'ui-disabled':''}" click.trigger="toggleDropdown($event)" data-value="\${value}" css.bind="{width: width}">
    <ui-glyph if.bind="busy" class="ui-indicator ui-anim-pulse" glyph="busy"></ui-glyph><ui-glyph if.bind="glyph" glyph.bind="glyph"></ui-glyph><span class="ui-label"><slot>\${label}</slot></span></template>`)
@customElement('ui-button')
export class UIButton {
  constructor(public element: Element) {
    if (this.element.hasAttribute('primary')) this.theme = 'primary';
    else if (this.element.hasAttribute('secondary')) this.theme = 'secondary';
    else if (this.element.hasAttribute('light')) this.theme = 'light';
    else if (this.element.hasAttribute('dark')) this.theme = 'dark';
    else if (this.element.hasAttribute('info')) this.theme = 'info';
    else if (this.element.hasAttribute('danger')) this.theme = 'danger';
    else if (this.element.hasAttribute('success')) this.theme = 'success';
    else if (this.element.hasAttribute('warning')) this.theme = 'warning';

    if (this.element.hasAttribute('icon-top')) this.element.classList.add('ui-icon-top');
    if (this.element.hasAttribute('big')) this.element.classList.add('ui-big');
    if (this.element.hasAttribute('small')) this.element.classList.add('ui-small');
    if (this.element.hasAttribute('square')) this.element.classList.add('ui-square');
    if (this.element.hasAttribute('round')) this.element.classList.add('ui-round');
  }

  // aurelia hooks
  created(owningView: View, myView: View) { }
  bind(bindingContext: Object, overrideContext: Object) {
    this.busy = isTrue(this.busy);
    this.disabled = isTrue(this.disabled);
  }
  attached() {
    if (this.dropdown) {
      this.obMouseup = UIEvent.subscribe('mouseclick', (evt) => {
        if (getParentByClass(evt.target, 'ui-button') == this.element) return;
        this.element.classList.remove('ui-open');
        this.dropdown.classList.remove('ui-open');
      });
      this.element.classList.add('ui-btn-dropdown');
      this.dropdown.classList.add('ui-floating');
      this.tether = UIUtils.tether(this.element, this.dropdown);
    }
  }
  detached() {
    if (this.tether) this.tether.dispose();
    if (this.obMouseup) this.obMouseup.dispose();
    if (this.dropdown) DOM.removeNode(this.dropdown);
  }
  unbind() { }
  // end aurelia hooks

  @bindable() glyph = '';
  @bindable() label = '';
  @bindable() value = '';
  @bindable() theme = 'default';
  @bindable() width = 'auto';
  @bindable() dropdown;
  @bindable() busy = false;
  @bindable() disabled = false;

  private tether;
  private obMouseup;

  toggleDropdown(evt) {
    if (evt.button != 0) return true;
    if (this.dropdown) {
      evt.preventDefault();
      evt.stopPropagation();
      evt.cancelBubble = true;
      if (this.element.classList.contains('ui-open')) {
        UIEvent.fireEvent('menuhide', this.element);
        this.element.classList.remove('ui-open');
        this.dropdown.classList.remove('ui-open');
      }
      else {
        if (UIEvent.fireEvent('menuopen', this.element) !== false) {
          this.element.classList.add('ui-open');
          this.dropdown.classList.add('ui-open');
          this.tether.position();
        }
      }
      return false;
    }
    return true;
  }
}