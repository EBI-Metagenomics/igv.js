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
import TrackView from '../trackView.js';
import TrackGearPopover from "../ui/trackGearPopover.js";
import MenuUtils from "../util/menuUtils.js";
import {createIcon} from "../igv-icons.js";
import MgnifyFeatureTrack from "./mgnifyFeatureTrack.js";


export const MgnifyConfigOverrides = function () {
    
    TrackView.prototype.appendRightHandGutter = function($parent) {
        let $div = $('<div class="igv-right-hand-gutter">');
        $parent.append($div);
        
        let $cogContainer = $('<div>', {class: 'igv-trackgear-container'});
        $div.append($cogContainer);
    
        $cogContainer.append(createIcon('cog'));
    
        this.trackGearPopover = new TrackGearPopover($div);
        this.trackGearPopover.$popover.hide();
    
        let self = this;
        $cogContainer.click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            self.trackGearPopover.presentMenuList(-(self.trackGearPopover.$popover.width()), 0, MenuUtils.trackMenuItemList(self));
        });

        if (this.track instanceof MgnifyFeatureTrack) {
            const colorMenuItems = self.track.colorMenuItem();
            if (colorMenuItems.length === 0) {
                return
            }
            let $colourContainer = $('<div>', {class: 'igv-trackgear-container'});
            $div.append($colourContainer);
            $colourContainer.append(createIcon('paint-brush'));

            this.trackGearPopoverColour = new TrackGearPopover($div);
            this.trackGearPopoverColour.$popover.find('.igv-trackgear-popover-header')
                                                .prepend('<div class="igv-trackgear-popover-header-title">Select color</div>');
            this.trackGearPopoverColour.$popover.hide();

            $colourContainer.click(function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.trackGearPopoverColour.presentMenuList(
                    -(self.trackGearPopover.$popover.width()),
                    0,
                    colorMenuItems);
            });
        }
    }
}
