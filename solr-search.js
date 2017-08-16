class SolrSearch extends Polymer.Element {
  constructor() {
    super();
    this.routeGuard = false;
  }

  ready() {
    super.ready();
  }

  connectedCallback() {
    super.connectedCallback();

    let configSlot = this.$.config;
    let configs = configSlot.assignedNodes();
    let facets = [];
    configs.forEach((e) => {
      if (e instanceof HTMLElement) {
        if (e.localName.indexOf("list") > -1) {
          facets.push({
            label: e.label,
            key: e.key,
            name: e.localName
          });
        } else if (e.localName.indexOf("number-range") > -1) {
          facets.push({
            label: e.label,
            key: e.key,
            min: e.min,
            max: e.max,
            step: e.step,
            name: e.localName
          });
        }
      }
    });
    this.facets = facets;
    this.updateFacets();
  }

  static get is() {
    return 'solr-search';
  }

  static get properties() {
    return {
      url: String,
      jsonp: {
        type: Boolean,
        value: false
      },
      route: {
        type: Object,
        notify: true
      },
      results: {
        type: Object
      },
      facets: {
        type: Array
      }
    }
  }

  static get observers() {
    return [
      '__routeChanged(route.*)'
    ]
  }

  isListFacet(name) {
    return name === "solr-facet-list";
  }

  isNumberRangeFacet(name) {
    return name === "solr-facet-number-range";
  }

  updateFacets() {
    let path = this.route.path;
    let urlSearchParams = new URLSearchParams(path);
    if (this.facets.length > 0) {
      for (let facet of this.facets) {
        switch (facet.name) {
          case "solr-facet-list":
            urlSearchParams.set('facet', 'on');
            if (!urlSearchParams.get('facet.mincount')) {
              urlSearchParams.set('facet.mincount', '1');
            }
            if (urlSearchParams.getAll('facet.field').indexOf(facet.key) == -1) {
              urlSearchParams.append('facet.field', facet.key);
            }
            break;
          case 'solr-facet-number-range':
            let filters = urlSearchParams.getAll('fq');
            if (!filters || filters === []) {
              urlSearchParams.append('fq', decodeURIComponent(`${facet.key}:[${facet.min} TO ${facet.max}]`));
            } else {
              let alreadyPresent = false;
              for (let filter of filters) {
                if (filter.startsWith(`${facet.key}:`)) {
                  alreadyPresent = true;
                }
              }
              if (!alreadyPresent) {
                urlSearchParams.append('fq', decodeURIComponent(`${facet.key}:[${facet.min} TO ${facet.max}]`));
              }
            }
          default:
            break;
        }
      }
    }
    this.set('route.path', urlSearchParams.toString());
  }

  __routeChanged(changeRecord) {
    switch (changeRecord.path) {
      case 'route':
      case 'route.path':
        this.search(this.__fullUrl, this.jsonp);
        break;
      default:
        break;
    }
  }

  get __fullUrl() {
    let url = this.constructURL(this.url, this.route.path); // pure
    return url.toString();
  }

  constructURL(base, query) {
    let url = new URL(base);
    let urlSearchParams = new URLSearchParams(query);
    url.search = urlSearchParams;
    return url;
  }

  async search(url, jsonp = false) {
    // get results
    let results = await this.fetchResults(this.__fullUrl, this.jsonp); // pure
    results = await results.json();
    this.set('results', results);
  }

  async fetchResults(url, jsonp = false) { // pure
    let fetchReponse;
    if (!jsonp) {
      let req = new Request(url);
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');
      let init = {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'default'
      };
      fetchReponse = fetch(req, init);
    } else {
      fetchReponse = fetchJsonp(url);
    }

    return fetchReponse;
  }
}

window.customElements.define(SolrSearch.is, SolrSearch);
