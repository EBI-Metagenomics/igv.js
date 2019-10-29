/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019 EMBL-EBI
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

import $ from '../vendor/jquery-3.3.1.slim.js';
import {getCOGColour, getAntiSMASHColour, COLOUR_ABSENCE, COLOUR_PRESENCE} from './mgnifyColours.js';
import FeatureTrack from '../feature/featureTrack.js';
import IGVGraphics from '../igv-canvas.js';
import IGVColor from '../igv-color.js';
import {createCheckbox} from '../igv-icons.js';
import {extend} from '../util/igvUtils.js';
import GtexUtils from '../gtex/gtexUtils.js';

/**
 * EBI-MGnify modification of the FeatureTrack.
 */
const MgnifyFeatureTrack = extend(FeatureTrack,

    function (config, browser) {

        this.type = 'mgnify-feature';

        FeatureTrack.call(this, config, browser);

        // configure the colorBy and labelBy
        if (this.config.colorBy) {
            this.colorByRegex = new RegExp(this.config.colorBy + '=([^;]+)', 'i');
        }
        if (this.config.labelBy) {
            this.labelByRegex = new RegExp(this.config.labelBy + '=([^;]+)', 'i');
        }

        // Set the render function.  This can optionally be passed in the config
        if (config.render) {
            this.render = config.render;
        } else {
            this.render = renderFeature;
            this.arrowSpacing = 30;
            // adjust label positions to make sure they're always visible
            monitorTrackDrag(this);
        }
    }
);

MgnifyFeatureTrack.prototype.colorMenuItem = function () {
    const self = this;
    const items = [];
    if (!self.config.colorAttributes || self.config.colorAttributes.length === 0) {
        return items;
    }
    self.config.colorAttributes.forEach(function([propertyName, propertyValue]) {
        items.push({
            object: createCheckbox(propertyName, propertyValue === self.config.colorBy),
            click: function() {
                self.config.colorBy = propertyValue;
                self.trackView.checkContentHeight();
                self.trackView.repaintViews();
            }
        })
    });
    return items;
};

MgnifyFeatureTrack.prototype.menuItemList = function () {

    const self = this;
    const menuItems = [];

    menuItems.push({object: $('<div class="igv-track-menu-border-top">')});

    ['COLLAPSED', 'SQUISHED', 'EXPANDED'].forEach(function (displayMode) {
        const lut = {
            'COLLAPSED': 'Collapse',
            'SQUISHED': 'Squish',
            'EXPANDED': 'Expand'
        };
        menuItems.push({
            object: createCheckbox(lut[displayMode], displayMode === self.displayMode),
            click: function () {
                self.displayMode = displayMode;
                self.config.displayMode = displayMode;
                self.trackView.checkContentHeight();
                self.trackView.repaintViews();
            }
        });
    });

    return menuItems;
};


MgnifyFeatureTrack.prototype.description = function () {
    return this.name;
};

/**
 * Monitors track drag events, updates label position to ensure that they're always visible.
 * @param track
 */
function monitorTrackDrag(track) {

    if (track.browser.on) {
        track.browser.on('trackdragend', onDragEnd);
        track.browser.on('trackremoved', unSubscribe);
    }

    function onDragEnd() {
        if (!track.trackView || !track.trackView.tile || track.displayMode === 'SQUISHED') {
            return;
        }
        track.trackView.repaintViews();
    }

    function unSubscribe(removedTrack) {
        if (track.browser.un && track === removedTrack) {
            track.browser.un('trackdrag', onDragEnd);
            track.browser.un('trackremoved', unSubscribe);
        }
    }
}

/**
 * @param feature
 * @param bpStart  genomic location of the left edge of the current canvas
 * @param xScale  scale in base-pairs per pixel
 * @returns {{px: number, px1: number, pw: number, h: number, py: number}}
 */
function calculateFeatureCoordinates(feature, bpStart, xScale) {
    let px = (feature.start - bpStart) / xScale;
    let px1 = (feature.end - bpStart) / xScale;
    //px = Math.round((feature.start - bpStart) / xScale),
    //px1 = Math.round((feature.end - bpStart) / xScale),
    let pw = px1 - px;

    if (pw < 3) {
        pw = 3;
        px -= 1.5;
    }

    return {
        px: px,
        px1: px1,
        pw: pw
    };
}

/**
 * Get the colour for an attribute based on the colourBy configuration.
 * @param {Feature} feature a feature
 */
function getColourBy(feature) {
    if (!this.config.colorBy) {
        return this.config.defaultColour || this.color;
    }
    // If there is a colorByRegex then the color regex is used
    // that will prevent from changing if a different feature is selected
    let regex = undefined;
    if (this.colorByRegex) {
        regex = this.colorByRegex;
    } else {
        regex = new RegExp(this.config.colorBy + '=([^;]+)', 'i');
    }
    let match = regex.exec(feature.attributeString);
    if (!match) {
        return this.config.defaultColour || COLOUR_ABSENCE;
    }
    const value = match[1];
    switch (this.config.colorBy) {
        // eslint-disable-next-line no-fallthrough
        case 'COG': {
            return getCOGColour(value);
        }
        // antiSMASH results
        case 'gene_kinds': {
            // antiSMASH is coloured based on the gene_kind
            return getAntiSMASHColour(value);
        }
        // eslint-disable-next-line no-fallthrough
        default:
            return COLOUR_PRESENCE;
    }
}

/**
 * Get an attribute value for the label by an attribute value.
 * @param feature Feature a feature
 */
function getLabelBy(feature) {
    if (!this.config.labelBy) {
        return undefined;
    }
    let match = this.labelByRegex.exec(feature.attributeString);
    if (!match) {
        return undefined;
    }
    return match[1];
}

/**
 *
 * @param feature
 * @param bpStart  genomic location of the left edge of the current canvas
 * @param xScale  scale in base-pairs per pixel
 * @param pixelHeight  pixel height of the current canvas
 * @param ctx  the canvas 2d context
 * @param options  genomic state
 */
function renderFeature(feature, bpStart, xScale, pixelHeight, ctx, options) {

    const browser = this.browser;

    const label = getLabelBy.call(this, feature);
    if (label) {
        feature.name = label;
    }

    let color =  getColourBy.call(this, feature) || this.color;
    if (feature.alpha && feature.alpha !== 1) {
        color = IGVColor.addAlpha(this.color, feature.alpha);
    }
    
    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    let h;
    let py;
    if (this.displayMode === 'SQUISHED' && feature.row !== undefined) {
        h = this.featureHeight / 2;
        py = this.margin + this.squishedRowHeight * feature.row;
    } else if (this.displayMode === 'EXPANDED' && feature.row !== undefined) {
        h = this.featureHeight
        py = this.margin + this.expandedRowHeight * feature.row;
    } else {  // collapsed
        h = this.featureHeight;
        py = this.margin;
    }

    const cy = py + h / 2;
    const h2 = h / 2;
    const py2 = cy - h2 / 2;

    const exonCount = feature.exons ? feature.exons.length : 0;
    const coord = calculateFeatureCoordinates(feature, bpStart, xScale);
    const step = this.arrowSpacing;
    const direction = feature.strand === '+' ? 1 : feature.strand === '-' ? -1 : 0;

    if (exonCount === 0) {
        // single-exon transcript
        ctx.fillRect(coord.px, py, coord.pw, h);

        // Arrows
        // Do not draw if strand is not +/-
        if (direction !== 0) {
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'white';
            for (let x = coord.px + step / 2; x < coord.px1; x += step) {
                // draw arrowheads along central line indicating transcribed orientation
                IGVGraphics.strokeLine(ctx, x - direction * 2, cy - 2, x, cy);
                IGVGraphics.strokeLine(ctx, x - direction * 2, cy + 2, x, cy);
            }
            ctx.fillStyle = color;
            ctx.strokeStyle = color;
        }
    } else {
        // multi-exon transcript
        IGVGraphics.strokeLine(ctx, coord.px + 1, cy, coord.px1 - 1, cy); // center line for introns

        const pixelWidth = options.pixelWidth;

        const xLeft = Math.max(0, coord.px) + step / 2;
        const xRight = Math.min(pixelWidth, coord.px1);
        for (let x = xLeft; x < xRight; x += step) {
            // draw arrowheads along central line indicating transcribed orientation
            IGVGraphics.strokeLine(ctx, x - direction * 2, cy - 2, x, cy);
            IGVGraphics.strokeLine(ctx, x - direction * 2, cy + 2, x, cy);
        }
        for (let e = 0; e < exonCount; e++) {
            // draw the exons
            const exon = feature.exons[e];
            let ePx = Math.round((exon.start - bpStart) / xScale);
            let ePx1 = Math.round((exon.end - bpStart) / xScale);
            let ePw = Math.max(1, ePx1 - ePx);
            let ePxU;

            if (ePx + ePw < 0) {
                continue;  // Off the left edge
            }
            if (ePx > pixelWidth) {
                break; // Off the right edge
            }

            if (exon.utr) {
                ctx.fillRect(ePx, py2, ePw, h2); // Entire exon is UTR
            } else {
                if (exon.cdStart) {
                    ePxU = Math.round((exon.cdStart - bpStart) / xScale);
                    ctx.fillRect(ePx, py2, ePxU - ePx, h2); // start is UTR
                    ePw -= (ePxU - ePx);
                    ePx = ePxU;

                }
                if (exon.cdEnd) {
                    ePxU = Math.round((exon.cdEnd - bpStart) / xScale);
                    ctx.fillRect(ePxU, py2, ePx1 - ePxU, h2); // start is UTR
                    ePw -= (ePx1 - ePxU);
                    ePx1 = ePxU;
                }

                ctx.fillRect(ePx, py, ePw, h);

                // Arrows
                if (ePw > step + 5 && direction !== 0) {
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'white';
                    for (let x = ePx + step / 2; x < ePx1; x += step) {
                        // draw arrowheads along central line indicating transcribed orientation
                        IGVGraphics.strokeLine(ctx, x - direction * 2, cy - 2, x, cy);
                        IGVGraphics.strokeLine(ctx, x - direction * 2, cy + 2, x, cy);
                    }
                    ctx.fillStyle = color;
                    ctx.strokeStyle = color;

                }
            }
        }
    }

    const windowX = Math.round(options.viewportContainerX);
    const nLoci = browser.genomicStateList ? browser.genomicStateList.length : 1
    const windowX1 = windowX + options.viewportContainerWidth / nLoci;

    renderFeatureLabels.call(this, ctx, feature, coord.px, coord.px1, py, windowX, windowX1, options.genomicState, options);
}

/**
 * @param ctx       the canvas 2d context
 * @param feature
 * @param featureX  feature start x-coordinate
 * @param featureX1 feature end x-coordinate
 * @param featureY  feature y-coordinate
 * @param windowX   visible window start x-coordinate
 * @param windowX1  visible window end x-coordinate
 * @param genomicState  genomic state
 * @param options  options
 */
function renderFeatureLabels(ctx, feature, featureX, featureX1, featureY, windowX, windowX1, genomicState, options) {

    var geneColor, geneFontStyle, transform,
        boxX, boxX1,    // label should be centered between these two x-coordinates
        labelX, labelY,
        textFitsInBox;
    // feature outside of viewable window
    if (featureX1 < windowX || featureX > windowX1) {
        boxX = featureX;
        boxX1 = featureX1;
    } else {
        // center label within visible portion of the feature
        boxX = Math.max(featureX, windowX);
        boxX1 = Math.min(featureX1, windowX1);
    }

    if (genomicState.selection && GtexUtils.gtexLoaded && feature.name !== undefined) {
        // TODO -- for gtex, figure out a better way to do this
        geneColor = genomicState.selection.colorForGene(feature.name);
    }


    textFitsInBox = (boxX1 - boxX) > ctx.measureText(feature.name).width;

    if (//(feature.name !== undefined && feature.name.toUpperCase() === selectedFeatureName) ||
        ((textFitsInBox || geneColor) && this.displayMode !== 'SQUISHED' && feature.name !== undefined)) {
        geneFontStyle = {
            // font: '10px PT Sans',
            textAlign: 'center',
            fillStyle: geneColor || feature.color || this.color,
            strokeStyle: geneColor || feature.color || this.color
        };

        if (this.displayMode === 'COLLAPSED' && this.labelDisplayMode === 'SLANT') {
            transform = {rotate: {angle: 45}};
            delete geneFontStyle.textAlign;
        }

        labelX = boxX + ((boxX1 - boxX) / 2);
        labelY = getFeatureLabelY(featureY, transform);

        // TODO: This is for compatibility with JuiceboxJS.
        if (options.labelTransform) {
            ctx.save();
            options.labelTransform(ctx, labelX);
            IGVGraphics.fillText(ctx, feature.name, labelX, labelY, geneFontStyle, undefined);
            ctx.restore();

        } else {
            IGVGraphics.fillText(ctx, feature.name, labelX, labelY, geneFontStyle, transform);
        }

    }
}

function getFeatureLabelY(featureY, transform) {
    return transform ? featureY + 20 : featureY + 25;
}

export default MgnifyFeatureTrack;
