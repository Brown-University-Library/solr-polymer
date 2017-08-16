"use strict";

/**
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SolrFacetNumberRangeInternal extends Polymer.Element {
  constructor() {
    super();

    this.addEventListener('updateValues', (e) => {
      this.updateValues();
    });
  }

  static get is() { return "solr-facet-number-range-internal"; }

  static get properties() {
    return {
      route: {
        type: Object,
        notify: true
      },
      results: Object,
      label: String,
      key: String,
      min: Number,
      max: Number,
      step: Number
    }
  }

  static get observers() {
    return [
      '__routeChanged(route.*)'
    ]
  }

  connectedCallback() {
    super.connectedCallback();

    if (!this.$.slider._prevUpdateValues) {
      this.$.slider._prevUpdateValues = [0, 0];
      this.$.slider.setValues(this.min, this.max);
    }
  }

  parseFacets(facets) {
    let parsedFacets = [];
    for (let facet of facets) {
      let split = facet.split(":");
      let map = {};
      map.label = split[0];
      map.key = split[1];
      map.min = split[2];
      map.max = split[3];
      map.step = split[4];
      map.id = this.counter++;
      parsedFacets.push(map);
    }
    return parsedFacets;
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
    
    if (!this.$.slider._prevUpdateValues) {
      this.$.slider._prevUpdateValues = [0, 0];
    }
    
    let urlsearchParams = new URLSearchParams(path);
    let filters = urlsearchParams.getAll('fq');
    for (let filter of filters) {
      if (filter.startsWith(`${this.key}:`)) {
        let query = filter.substring(filter.indexOf(":") + 1);
        let regex = /^\[(.*) TO (.*)\]$/;
        let valueArr = query.match(regex);
        if (!valueArr) {
          continue;
        }
        let newMinValue = valueArr[1];
        let newMaxValue = valueArr[2];
        this.$.slider.setValues(newMinValue, newMaxValue);
      }
    }
  }

  updateValues() {
    if (!this.route) {
      return;
    }
    let path = this.route.path;
    let urlSearchParams = new URLSearchParams(path);
    let filters = urlSearchParams.getAll('fq');
    urlSearchParams.delete('fq');
    for (let filter of filters) {
      // NOTE: this assumes that one does not facet list and facet range on the same key!
      if (!filter.startsWith(`${this.key}`)) {
        urlSearchParams.append('fq', decodeURIComponent(filter));
      }
    }
    urlSearchParams.append('fq',decodeURIComponent(`${this.key}:[${this.$.slider.valueMin} TO ${this.$.slider.valueMax}]`));
    this.set('route.path', urlSearchParams.toString());
  }
}

customElements.define(SolrFacetNumberRangeInternal.is, SolrFacetNumberRangeInternal);
