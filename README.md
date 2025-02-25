# EBI-MGnify notes

## Deprecated
This fork is no longer used or maintained. Since the [IGV Tracks 2.0 API](https://github.com/igvteam/igv.js/wiki/Tracks-2.0), 
most of the modifications this fork introduced are possible using the upstream codebase.
In particular, IGV.js v2.10.1 introduced the [colorBy function](https://github.com/igvteam/igv.js/wiki/Annotation-Track#color-function-igvjs-version-2101).

---


The following is a fork of the igv.js project, adapted to include additional functionality used on the MGnify service.

In order to simplify the upgrade the modifications were made (as much as possible) on separate files. The modifications and patch are on the `js/mgnify/` folder.

Some minor modifications were necessary on the repository on the files `igv-create.js`. The plan is to incorporate the track colour by attribute and submit a PR to the igv-team (there is no time-frame for this).

## EBI-MGnify releases

This project is installed on the MGnify platform using npm.

The current version is based on the release `v2.3.0`. The MGnify versioning for this repo is: `v{igv team tag}+mgnify{mgnify custom build}`.

# igv.js - source docs.
[![Build Status](https://travis-ci.org/igvteam/igv.js.svg?branch=master)](https://travis-ci.org/igvteam/igv.js)
![](https://img.shields.io/npm/dw/igv.svg)
![](https://img.shields.io/github/last-commit/igvteam/igv.js.svg)
![](https://img.shields.io/npm/l/igv.svg)

igv.js is an embeddable interactive genome visualization component developed by the 
 [Integrative Genomics Viewer (IGV)](https://igv.org) team. 
 
Below are examples and a quickstart guide.  
See the [Wiki](https://github.com/igvteam/igv.js/wiki) for more documentation.  

[Release Notes](https://github.com/igvteam/igv.js/releases)

 
# Examples
 
***[Alignments](https://igv.org/web/release/2.3.0/examples/cram.html)***

***[Copy number](https://igv.org/web/release/2.3.0/examples/copyNumber.html)***

***[Multiple regions](https://igv.org/web/release/2.3.0/examples/multi-locus.html)***

***[More](https://igv.org/web/release/2.3.0/examples/)***

 
# Quickstart

## Installation
igv.js consists of a single javascript file with no external dependencies.  To link directly to the current release copy this snippet

```html
<script src="https://cdn.jsdelivr.net/npm/igv@2.3.0/dist/igv.min.js"></script>
``` 

Pre-built files for ES5 (igv.min.js) and ES6 (igv.esm.min.js)
can be downloaded from [https://cdn.jsdelivr.net/npm/igv@2.3.0/dist/](https://cdn.jsdelivr.net/npm/igv@2.3.0/dist/).   
 
Alternatively you can install with npm  
 
 ```npm install igv```

and source the appropriate file for your module system (igv.min.js or igv.esm.min.js)  in node_modules/igv/dist.

To use igv.js include it with a script tag

````<script src="igv.min.js/>````

***or*** import it as a requirejs module 

```requirejs(['igv.min'], function (igv) {...}```   *(see [examples/igv-require.html](https://igv.org/web/release/2.3.0/examples/igv-require.html))*

***or*** import it as an es6 module 

```import igv from 'igv.esm.min.js'```  *(see [examples/igv-esm.html](https://igv.org/web/release/2.3.0/examples/igv-esm.html))*



## Usage

To create an igv.js ***browser*** supply a container div 
and an initial configuration defining the reference genome, initial tracks, and other state to the 
function ```igv.createBrowser(div, config)```.  

This function returns a promise for an igv.Browser object which can used to control the browser.  For example, to open
a browser on a single alignment track opened at a specific locus:

```
      var igvDiv = document.getElementById("igv-div");
      var options =
        {
            genome: "hg38",
            locus: "chr8:127,736,588-127,739,371",
            tracks: [
                {
                    "name": "HG00103",
                    "url": "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram",
                    "indexURL": "https://s3.amazonaws.com/1000genomes/data/HG00103/alignment/HG00103.alt_bwamem_GRCh38DH.20150718.GBR.low_coverage.cram.crai",
                    "format": "cram"
                }
            ]
        };

        igv.createBrowser(igvDiv, options)
                .then(function (browser) {
                    console.log("Created IGV browser");
                })
```

For more details see the [Wiki](https://github.com/igvteam/igv.js/wiki) for full documentation of the API.

## Development

### Requirements

Building igv.js and running the examples require Linux or MacOS.  Other Unix environments will probably
work but have not been tested.  

Windows users can use [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

### Building

Building igv.js and running the examples requires [node.js](https://nodejs.org/).


```  
git clone https://github.com/igvteam/igv.js.git
cd igv.js
npm install
npm run build
```

This creates a dist folder with the following files

* igv.js - ES5 compatible UMDS file for script include, AMD, or CJS modules.  A script include will define an "igv" global.
* igv.min.js - minified version of igv.js
* igv.esm.js --  ES6 module 
* igv.esm.min.js --  minified version of igv.esm.js

### Tests

To run the tests from the command line

```
npm run test
```

To run the tests in a browser start an [http-server](https://www.npmjs.com/package/http-server)

    npm run http-server

Then open [http://localhost:8080/test/runTests.html](http://localhost:8080/test/runTests.html).


### Examples

To run the examples start an [http-server](https://www.npmjs.com/package/http-server)

    npm run http-server

Then open [http://localhost:8080/examples](http://localhost:8080/examples).


# Supported Browsers

igv.js require a modern web browser with support for Javascript ECMAScript 2015. We test on the latest versions of 
Chrome, Safari, Firefox, and Edge. 


# License

igv.js is [MIT](/LICENSE) licensed.


