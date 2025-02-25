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

import $ from "../vendor/jquery-3.3.1.slim.js";
import GenericContainer from "../ui/genericContainer.js";
import {COG_MAP, ANTISMASH_MAP_GK_LABELS, COLOUR_ABSENCE, COLOUR_PRESENCE} from "./mgnifyColours";

const TrackLegendControl = function ($parent, browser) {

    var self = this;

    this.browser = browser;
    
    this.$button = $('<div class="igv-nav-bar-button">');
    $parent.append(this.$button);
    this.$button.text('legend');
    
    var $legentParent = (browser.config.legendParent) ? $(browser.config.legendParent) : browser.$parent;
    this.legend = new GenericContainer({
        $parent: $legentParent,
        width: 384,
        height: 'auto',
        closeHandler: () => {
            self.browser.trackLegendVisible = false;
            self.$button.removeClass('igv-nav-bar-button-clicked');
            self.legend.$container.hide();
        }
    });

    browser.trackLegendVisible = false;
    self.legend.$container.hide();

    const $legendContainter = $('<table class="legend-container"></table>');

    const legendGroups = browser.config.legendGroups || {cog: true, antiSMASH: true, other: true};

    /* COG */
    const $cogLegend = $('<table class="sub-legend"><caption>COG</caption></table>')
    const cogs = Object.keys(COG_MAP).sort();

    for (let i = 0, len = cogs.length; i < len; i++) {
        const key = cogs[i];
        const $legendEntry = $('<tr class="legend-entry"></tr>');
        const $color = $('<td class="legend-color" style="background:' + COG_MAP[key] + '"></td>');
        const $label = $('<td class="legend-label">' + key + '</td>');
        $legendEntry.append($color);
        $legendEntry.append($label);
        $cogLegend.append($legendEntry);
    }

    /* antiSMASH */
    const $antiSMLegend = $('<table class="sub-legend"><caption>antiSMASH</caption></table>')
    const asLabels = Object.keys(ANTISMASH_MAP_GK_LABELS);

    for (let i = 0, len = asLabels.length; i < len; i++) {
        const key = asLabels[i];
        const $legendEntry = $('<tr class="legend-entry clear"></tr>');
        const $color = $('<td class="legend-color" style="background:' + ANTISMASH_MAP_GK_LABELS[key] + '"></td>');
        const $label = $('<td class="legend-label">' + key + '</td>');
        $legendEntry.append($color);
        $legendEntry.append($label);
        $antiSMLegend.append($legendEntry);
    }

    const $otherLegend = $('<table class="sub-legend"><caption>For other attributes</caption></table>');
    const $prescenceTr = $('<tr class="legend-entry"></tr>');
    $prescenceTr.append($('<td class="legend-color" style="background:'+ COLOUR_PRESENCE + '"></td>'));
    $prescenceTr.append($('<td class="legend-label">Presence</td>'));
    $otherLegend.append($prescenceTr);

    const $abscenceTr = $('<tr class="legend-entry"></tr>');
    $abscenceTr.append($('<td class="legend-color" style="background:' + COLOUR_ABSENCE + '"></td>'));
    $abscenceTr.append($('<td class="legend-label">Absence</td>'));
    $otherLegend.append($abscenceTr);

    if (legendGroups.cog) {
        $legendContainter.append($cogLegend);
    }
    if (legendGroups.antiSMASH) {
        $legendContainter.append($antiSMLegend);
    }
    if (legendGroups.other) {
        $legendContainter.append($otherLegend);
    }

    this.legend.$container.append($('<div class="legend-title">Legend</div>'));
    this.legend.$container.append($legendContainter);

    this.$button.on('click', function () {
        if (true === browser.trackLegendVisible) {
            browser.trackLegendVisible = false;
            self.$button.removeClass('igv-nav-bar-button-clicked');
            self.legend.$container.hide();
        } else {
            browser.trackLegendVisible = true;
            self.$button.addClass('igv-nav-bar-button-clicked');
            self.legend.$container.show();
        }
    });

};

export default TrackLegendControl;