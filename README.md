# &lt;solr-search&gt;

## Installing

```bash
bower install --save git://github.com/Brown-University-Library/solr-search
```

## Usage

```html
<html>
<head>
  <script src="[relativeDirectory]/bower_components/webcomponentsjs/webcomponents-lite.js"></script>
  <link rel="import" href="[relativeDirectory]/bower_components/solr-search.html">
</head>
<body>
  <solr-search url="http://example.com/api/search">
    <!-- configuration tags here -->
    <!-- see demo for more examples -->

    <!-- results template here -->
    <template slot="results">
      <div>Title: [[item.title]]</div>
    </template>
  </solr-search>
</body>
```

## Contributing

### Installing

```bash
git clone https://github.com/Brown-University-Library/solr-search.git

cd solr-search

bower install; yarn install (or npm i)
```

### Running

```bash
polymer server -H 0.0.0.0 -p 8000 (host and port flags optional)
```
