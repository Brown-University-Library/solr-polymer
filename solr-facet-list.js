class SolrFacetList extends Polymer.Element {
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
    return 'solr-facet-list';
  }

  static get properties() {
    return {
      label: String,
      key: String
    }
  }
}

window.customElements.define(SolrFacetList.is, SolrFacetList);
