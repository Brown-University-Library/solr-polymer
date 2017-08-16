"use strict";

/**
 * `solr-searchfield`
 * Add text search field to your solr-base search interface.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrSearchfield extends Polymer.Element {
  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get is() { return "solr-searchfield"; }

  static get properties() {
    return {
      route: {
        type: Object,
        notify: true
      },
      __searchTerms: {
        type: String
      }
    }
  }

  static get observers() {
    return [
      '__routeChanged(route.*)',
      '__searchTermsChanged(__searchTerms)'
    ]
  }

  __routeChanged(changeRecord) {
    let path;
    switch (changeRecord.path) {
      case 'route':
        path = changeRecord.value.path;
        break;
      case 'route.path':
        path = changeRecord.value;
        break;
      default:
        return;
    }
    let urlsearchParams = new URLSearchParams(path);
    let searchTerms = urlsearchParams.get('q');
    this.set('__searchTerms', searchTerms || '*');
  }

  __searchTermsChanged(searchTerms) {
    let path = this.route.path;
    let urlsearchParams = new URLSearchParams(path);
    urlsearchParams.set('q', searchTerms || '*');
    let route = urlsearchParams.toString();
    this.set('route.path', route);
  }
}

customElements.define(SolrSearchfield.is, SolrSearchfield);
