"use strict";

/**
 * `solr-facet-list`
 * Add list faceted searching/filtering to your solr-base search interface.
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrFacetListInternal extends Polymer.Element {
  constructor() {
    super();
  }

  static get is() { return "solr-facet-list-internal"; }

  static get properties() {
    return {
      route: {
        type: Object,
        notify: true
      },
      results: Object,
      label: String,
      key: String,
      facets: {
        type: Array,
        computed: 'facetAssociativeMap(results, key)'
      }
    }
  }

  connectedCallback() {
    super.connectedCallback();
  }

  facetAssociativeMap(results, key) {
    let facets = results && results.facet_counts;
    let facetResults = facets && facets.facet_fields && facets.facet_fields[key] || [];
    let facetFieldsArray = [];
    for (let i = 0; i < facetResults.length; i+=2) {
      facetFieldsArray.push({
        field: facetResults[i],
        count: facetResults[i+1]
      });
    }
    return facetFieldsArray;
  }

  facetLink(item) {
    let path = this.route.path;
    let queryString = new URLSearchParams(path);
    if (queryString.getAll('fq').indexOf(`${this.key}:${item.field}`) == -1) {
      queryString.append('fq', decodeURIComponent(`${this.key}:${item.field}`));
    }
    return `#${queryString.toString()}`;
  }

  removeFacetFilterLink() {
    let path = this.route.path;
    let queryString = new URLSearchParams(path);
    let values = queryString.getAll('fq');
    queryString.delete('fq');
    for (let value of values) {
      if (!value.startsWith(this.key)) {
        queryString.append('fq', value);
      }
    }
    return `#${queryString.toString()}`;
  }
}

customElements.define(SolrFacetListInternal.is, SolrFacetListInternal);
