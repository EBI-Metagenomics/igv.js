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
    
    igv.EBIconfigOverrides = function () {
        /* Track colour selector */
        igv.createColorSwatchSelector = createColorSwatchSelectorEBI.bind(igv);
        igv.TrackView.prototype.createColorPicker = createColorPickerEBI;
        igv.TrackView.prototype.setColorAttr = setColorAttrEBI;
    }

    /* TrackView overrides */
    /**
     * Change the selected attribute
     */
    function setColorAttrEBI(attr) {
        igv.ebi.setSelectedAttribute(attr);
        this.repaintViews(true);
        // Refresh the Legend

    };

    /**
     * Color Picker.
     * This method creates the color picker an hooks the 
     * color change callback.
     */
    function createColorPickerEBI() {

        let self = this;

        self.colorPicker = new igv.genericContainer({
            $parent: $(this.trackDiv),
            width: 384,
            height: undefined,
            closeHandler: () => {
                self.colorPicker.$container.hide();
            }
        });

        igv.createColorSwatchSelector(this.colorPicker.$container,
            rgb => this.setColor(rgb), attr => this.setColorAttr(attr), this.track.color);

        self.colorPicker.$container.hide();
    };

    /**
     * Creates the color changer.
     * @param {HTMLNode} $genericContainer The containter element.
     * @param {function} colorHandler Callback to be called on colour change. 
     * @param {function} colorAttrHandler Callback that changes the selected colour (EBI)
     * @param {string} defaultColor Default colour 
     */
    function createColorSwatchSelectorEBI($genericContainer, colorHandler, colorAttrHandler, defaultColor) {

        let appleColors = Object.values(igv.appleCrayonPalette);

        if (defaultColor && !(typeof defaultColor === 'function')) {

            // Remove 'snow' color.
            appleColors.splice(11, 1);

            // Add default color.
            appleColors.unshift(igv.Color.rgbToHex(defaultColor));
        }

        let $swatchSubtitle = $('<h3 style="clear:both; width:100%">Color by unique color</h3>');

        $genericContainer.append($swatchSubtitle);
        
        for (let color of appleColors) {

            let $swatch = $('<div>', { class: 'igv-color-swatch' });
            $genericContainer.append($swatch);

            $swatch.css('background-color', color);

            if ('white' === color) {
                // do nothing
                console.log('-');
            } else {

                $swatch.hover(() => {
                    $swatch.get(0).style.borderColor = color;
                },
                    () => {
                        $swatch.get(0).style.borderColor = 'white';
                    });

                $swatch.on('click.trackview', (event) => {
                    event.stopPropagation();
                    colorHandler(color);
                });

                $swatch.on('touchend.trackview', (event) => {
                    event.stopPropagation();
                    colorHandler(color);
                });

            }
        }

        /* EBI extension for the colours. */
        const colorAttributes = this.browser.config.ebi.colorAttributes;
        if (colorAttributes && colorAttributes.length > 0) {
            const $tooltip = $('<span class="icon icon-generic" data-icon="?" ' + 
                ' data-tooltip tabindex="1" title="Color by attribute."></span>');
            const $select = $('<select class="igv-colour-selector"></select>');
            for (let attribute of colorAttributes) {
                $select.append($('<option value="' + attribute + '">' + attribute + '</option>'));
            }
            $select.change(() => {
                colorAttrHandler($select.val());
            });
            igv.browser.$toggle_button_container.append($tooltip);
            igv.browser.$toggle_button_container.append($select);
        }
    };

    return igv;

}) (igv || {});
