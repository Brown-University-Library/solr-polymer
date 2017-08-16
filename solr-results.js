"use strict";

/**
 * `solr-results`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrResults extends Polymer.Element {
  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get is() { return "solr-results"; }

  static get properties() {
    return {
      __results: {
        type: Object,
        computed: 'parseResults(results, path)'
      },
      path: {
        type: String,
        value: 'response.docs'
      },
      results: {
        type: Object
      },
      prev: {
        type: String
      },
      next: {
        type: String
      }
    }
  }

  static get observers() {
    return [
      '_updatePrevNext(results)'
    ]
  }

  parseResults(results, path) {
    let keys = path.split('.');
    for (let key of keys) {
      if (!results) {
        return [];
      }
      results = results[key];
    }
    return results;
  }

  _updatePrevNext(results) {
    let numFound = parseInt(results.response.numFound);
    let rows = parseInt(results.responseHeader.params.rows);
    let start = parseInt(results.response.start);

    if (numFound > rows) {
      let prevStart = start - rows;
      let nextStart = start + rows;
      // bounds check the start and end
      prevStart < 0 ? prevStart = 0 : prevStart = prevStart;
      nextStart > (numFound - rows) ? nextStart = (numFound - rows) : nextStart = nextStart;
      let prevUrl = new URLSearchParams(window.location.hash.substring(1));
      let nextUrl = new URLSearchParams(window.location.hash.substring(1));
      prevUrl.set("start", `${prevStart}`);
      nextUrl.set("start", `${nextStart}`);
      this.prev = `#?${prevUrl.toString()}`;
      this.next = `#?${nextUrl.toString()}`;
    } else {
      this.prev = window.location.hash;
      this.next = window.location.hash;
    }
  }
}

customElements.define(SolrResults.is, SolrResults);
