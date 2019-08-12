/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 EMBL-EBI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Created by mberacochea on 08/08/19.
 */
var igv = (function (igv) {

    "use strict";

    const DEFAULT_COLOUR = '#ff726e';
    const DEFAULT_COLOUR_ABS = '#000096';

    igv.EBIDefaultColor = DEFAULT_COLOUR; 
    igv.EBIDefaultColorAbs = DEFAULT_COLOUR_ABS;

    /**
     * EBI extension.
     * This extension is intended to be used in the MGnify platform.
     * Extended features:
     * - Colours per attribute name and value (exon in gff). Used in bacterial assemblies and genomes.
     * - Legend with the colours.
    */
    igv.EBIextension = function (browser, config) {
        this.colourCache = {};
        this.currentSelectedAttribute = '';
        // Regexes to get the attributes
        this.attrRegexes = {};
        if (config.ebi.colorAttributes) {
            const names = config.ebi.colorAttributes;
            this.colorAttributes = names;
            for (let i = 0, len = names.length; i < len; i++) {
                const name = names[i];
                if (name.length > 0) {
                    this.attrRegexes[name] = new RegExp(name + '=([^;]+)');
                }
            }
        }
        // Legend button
        if (config.ebi && config.ebi.showLegendButton) {
            browser.trackLegendControl = new igv.TrackLegendControl(
                $('.igv-nav-bar-toggle-button-container'), browser);
        }        
    }

    /**
     * Set the currently selected Attribute
     */
    igv.EBIextension.prototype.setSelectedAttribute = function (attrName) {
        this.currentSelectedAttribute = attrName;
    }

    /**
     * Add value to the colour cache
     */
    igv.EBIextension.prototype.getCachedColour = function (attrName, attrValue, colourCallBack) {
        // TODO not used at the moment.
        if (!(attrName in this.colourCache)) {
            this.colourCache[attrName] = {}
        }
        if (attrValue in this.colourCache[attrName]) {
            return this.colourCache[attrName][attrValue];
        } else {
            let colour = colourCallBack(attrValue);
            this.colourCache[attrName][attrValue] = colour;
            return colour;
        }
    }

    /**
     * Get the attribute (name, value) colour, this methid is memoized
     * @param {string} attribute Attribute 
     * @param {string} value Attribute colour 
     */
    igv.EBIextension.prototype.getAttributeColour = function (attrName, attrValue) {
        return this.getCachedColour(attrName, attrValue, (attrValue) => this.StringToHexColour(attrValue));
    }

    /**
     * Get the colour for a feature (feature).
     * This will store the colour in the cache also.
     * @param {Object} feature The feature to extract the data from
     * @param {string} defaultColour IGV default colour
     */
    igv.EBIextension.prototype.colorForAttribute = function (feature) {
        let attrName = this.currentSelectedAttribute;
        if (!attrName) {
            return;
        }
        const match = this.attrRegexes[attrName].exec(feature['attributeString']);
        if (match) {
            if (attrName === 'COG') {
                return this.getCOGcolour(match[1]);
            } else {
                // presence
                return DEFAULT_COLOUR;
            };
        } else {
            // absence
            return DEFAULT_COLOUR_ABS;
        }
    }

    igv.EBIextension.prototype.COG_MAP = {
        'A': '#ff2101', // RNA processing and modification
        'B': '#ff8802', // Chromatin Structure and dynamics
        'C': '#fffa03', // Energy production and conversion
        'D': '#83f902', // Cell cycle control and mitosis
        'E': '#05f802', // Amino Acid metabolis and transport
        'F': '#03f987', // Nucleotide metabolism and transport
        'G': '#00fdff', // Carbohydrate metabolism and transport
        'H': '#008cff', // Coenzyme metabolis
        'I': '#002eff', // Lipid metabolism
        'J': '#8931ff', // Tranlsation
        'K': '#ff39ff', // Transcription
        'L': '#ff2987', // Replication and repair
        'M': '#ff726e', // Cell wall/membrane/envelop biogenesis
        'N': '#ffce6e', // Cell motility
        'O': '#fffb6d', // Post-translational modification, protein turnover, chaperone functions
        'P': '#cefa6e', // Inorganic ion transport and metabolism
        'Q': '#68f96e', // Secondary Structure
        'T': '#68fbd0', // Signal Transduction
        'U': '#68fdff', // Intracellular trafficing and secretion
        'Y': '#6acfff', // Nuclear structure
        'Z': '#6e76ff', // Cytoskeleton
        'S': '#ff7aff', // Function Unknown
        'R': '#545453', // General Functional Prediction only
    }

    /**
     * Get the colour for the COG cateogry.
     * If the category is not mapped then use the R, this also
     * applies if the suplied category is not found (for example: multiles COG categories)
     */
    igv.EBIextension.prototype.getCOGcolour = function (cog) {
        if (cog in this.COG_MAP) {
            return this.COG_MAP[cog];
        }
        return this.COG_MAP['R'];
    }

    return igv;

}) (igv || {});
