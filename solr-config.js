class SolrConfig extends Polymer.Element {
  constructor() {
    super();
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();

    // get children and set configs
    window.test = this;
    let children = this.children.config.assignedNodes();
    children = children[0].children;
    for (let e of children) {
      if (e instanceof HTMLElement) {
        if (e.localName.indexOf("list") > -1) {
          this.listFacets.push({
            label: e.label,
            key: e.key
          });
        } else if (e.localName.indexOf("number-range") > -1) {
          this.numberRangeFacets.push({
            label: e.label,
            key: e.key,
            min: e.min,
            max: e.max,
            step: e.step
          });
        }
      }
    }

    console.log(this.numberRangeFacets);

    this.dispatchEvent(new CustomEvent('config-complete', {
      bubbles: true,
      composed: true
    }));
  }

  static get is() {
    return 'solr-config';
  }

  static get properties() {
    return {
      listFacets: {
        type: Array,
        notify: true,
        value: []
      },
      numberRangeFacets: {
        type: Array,
        notify: true,
        value: []
      }
    }
  }

  static get observers() {
    return [
    ]
  }
}

window.customElements.define(SolrConfig.is, SolrConfig);
