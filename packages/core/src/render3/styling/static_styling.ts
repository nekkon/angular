/**
* @license
* Copyright Google Inc. All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://angular.io/license
*/

import {concatStringsWithSpace} from '../../util/stringify';
import {assertFirstCreatePass} from '../assert';
import {AttributeMarker, TAttributes, TNode} from '../interfaces/node';
import {TVIEW} from '../interfaces/view';
import {getLView} from '../state';

/**
 * Compute the static styling (class/style) from `TAttributes`.
 *
 * This function should be called during `firstCreatePass` only.
 *
 * @param tNode The `TNode` into which the styling information should be loaded.
 * @param attrs `TAttributes` containing the styling information.
 */
export function computeStaticStyling(tNode: TNode, attrs: TAttributes): void {
  ngDevMode && assertFirstCreatePass(
                   getLView()[TVIEW], 'Expecting to be called in first template pass only');
  let styles: string|null = tNode.styles as string | null;
  let classes: string|null = tNode.classes as string | null;
  let mode: AttributeMarker|0 = 0;
  for (let i = 0; i < attrs.length; i++) {
    const value = attrs[i];
    if (typeof value === 'number') {
      mode = value;
    } else if (mode == AttributeMarker.Classes) {
      classes = concatStringsWithSpace(classes, value as string);
    } else if (mode == AttributeMarker.Styles) {
      const style = value as string;
      const styleValue = attrs[++i] as string;
      styles = concatStringsWithSpace(styles, style + ': ' + styleValue + ';');
    }
  }
  styles !== null && (tNode.styles = styles);
  classes !== null && (tNode.classes = classes);
}