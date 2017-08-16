class SolrFacetNumberRange extends Polymer.Element {
  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();
  }

  static get is() {
    return 'solr-facet-number-range';
  }

  static get properties() {
    return {
      label: String,
      key: String,
      min: Number,
      max: Number,
      step: Number
    }
  }
}

window.customElements.define(SolrFacetNumberRange.is, SolrFacetNumberRange);
