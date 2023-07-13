(function() {

	// Settings
	var settings = {
		followPathDirection : false,
		keepAnchor : true,
		showAlert : true
	};

	// Alert messages
	var alertMessages = {
		m0 : {
			ja_JP : 'オブジェクトが選択されていません\n少なくとも1つ以上のオブジェクトを選択してください',
			en_US : 'No objects selected.\nPlease select 1 or more objects.'
		},
		m1 : {
			ja_JP : 'テキストオブジェクトが選択されていません\n少なくとも1つ以上の「ポイント文字」か「エリア内文字」を選択してください',
			en_US : 'Text object is not selected.\nSelect at least one from “Point Type” or “Area Type”.'
		},
		m2 : {
			ja_JP : 'セグメントの選択が適切ではありません\nセグメントの角度に合わせて文字を回転するには、1セグメントのみを選択してください。このまま続けると選択した文字オブジェクトの回転をすべてリセットします。続行しますか？',
			en_US : 'Improper segment selection.\nSelect only one segment when you rotate the text. If you continue, the angle of all text objects selected will be reset.  Continue?'
		},
	};

	// Title and version
	const APP_LOCALE = app.locale;
	const SCRIPT_TITLE = APP_LOCALE === 'ja_JP' ? '文字の角度をセグメントに合わせる' : 'Rotate the text to align with the segment';
	const SCRIPT_VERSION = '0.5.3';

	// Document and selection
	var doc = app.activeDocument;
	var sel = doc.selection;

	// Get target items
	var targetText = getTargetItems(sel, 'TextFrame');
	var targetPathItems = getTargetItems(sel, 'PathItem');
	var targetPoints = getTargetPoints(targetPathItems);
	var effectiveSegment = targetPoints.length === 2;

	// Confirm and execute
	if(settings.showAlert) {
		if(!doc || sel.length < 1) {
			alert(alertMessages.m0[APP_LOCALE]);
			return;
		} else if(targetText.length < 1) {
			alert(alertMessages.m1[APP_LOCALE]);
			return;
		} else if(!effectiveSegment && targetPathItems.length > 0) {
			if(!confirm(alertMessages.m2[APP_LOCALE])) return;
		}
	}
	mainProcess();

	// Main process
	function mainProcess() {

			var pathAngle = 0;

			if(effectiveSegment) {
				var points = [getPathPointProperties(targetPoints[0]), getPathPointProperties(targetPoints[1])];
				pathAngle = getAngle(points[0].anchor, points[1].anchor, true);
			}

			for(var key in targetText) {

				var adjustmentAngle = 0;

				if(!effectiveSegment) {
					adjustmentAngle = targetText[key].orientation === TextOrientation.VERTICAL ? 90 : -180;
				} else if(!settings.followPathDirection) {
					if((targetText[key].orientation === TextOrientation.HORIZONTAL && points[0].anchor.x < points[1].anchor.x) || (targetText[key].orientation === TextOrientation.VERTICAL && points[0].anchor.y > points[1].anchor.y)) {
						adjustmentAngle += 180;
					}
				}

				var dummyTextLocate = [];
				var dummyContents = '.';

				if(targetText[key].kind === TextType.POINTTEXT) {
					var dummyText = targetText[key].duplicate();
					dummyText.contents = dummyContents;
					dummyText.paragraphs[0].justification = Justification.CENTER;
					dummyTextLocate[0] = {
						x : dummyText.geometricBounds[0],
						y : dummyText.geometricBounds[1]
					};
					dummyText.paragraphs[0].justification = Justification.RIGHT;
					dummyTextLocate[1] = {
						x : dummyText.geometricBounds[0],
						y : dummyText.geometricBounds[1]
					};
					dummyText.remove();
				} else {
					var dummyTextR = targetText[key].duplicate();
					dummyTextR.contents = dummyContents;
					dummyTextR.textRange.size = 1;
					var dummyTextC = dummyTextR.duplicate();

					dummyTextR.paragraphs[0].justification = Justification.RIGHT;
					dummyTextR = dummyTextR.createOutline();
					dummyTextLocate[0] = {
						x : dummyTextR.geometricBounds[0],
						y : dummyTextR.geometricBounds[1]
					};
					dummyTextR.remove();

					dummyTextC.paragraphs[0].justification = Justification.CENTER;
					dummyTextC = dummyTextC.createOutline();
					dummyTextLocate[1] = {
						x : dummyTextC.geometricBounds[0],
						y : dummyTextC.geometricBounds[1]
					};
					dummyTextC.remove();
				}

				var textAngle = getAngle(dummyTextLocate[0], dummyTextLocate[1], true);

				var anchorOrigin = targetText[key].kind === TextType.POINTTEXT ? targetText[key].anchor : [];
				targetText[key].rotate(pathAngle - textAngle + adjustmentAngle);
				if(anchorOrigin.length > 0 && settings.keepAnchor) targetText[key].translate(anchorOrigin[0] - targetText[key].anchor[0], anchorOrigin[1] - targetText[key].anchor[1]);
			}
	}

	// Get target items
	function getTargetItems(objects, typename) {
		var items = [];
		for(var i = 0; i < objects.length; i++) {
			if(objects[i].typename === typename) {
				items.push(objects[i]);
			} else if(objects[i].typename === 'GroupItem') {
				items = items.concat(getTargetItems(objects[i].pageItems, typename));
			}
		}
		return items;
	}

	// Get target path points
	function getTargetPoints(objects) {
		var points = [];
		for(var key in objects) {
			if(objects[key].typename !== 'PathItem') break;
			if(objects[key].pathPoints.length === 2)  {
				points.push(objects[key].pathPoints[0]);
				points.push(objects[key].pathPoints[1]);
				break;
			}
			for(var i = 0; i < objects[key].pathPoints.length; i++) {
				var nextIndex = i === objects[key].pathPoints.length - 1 ? 0 : i + 1;
				if(i === objects[key].pathPoints.length - 1 && !objects[key].closed) break;
				if((objects[key].pathPoints[i].selected === PathPointSelection.RIGHTDIRECTION && objects[key].pathPoints[nextIndex].selected === PathPointSelection.LEFTDIRECTION) || (objects[key].pathPoints[i].selected === PathPointSelection.ANCHORPOINT && objects[key].pathPoints[nextIndex].selected === PathPointSelection.ANCHORPOINT)) {
					points.push(objects[key].pathPoints[i]);
					points.push(objects[key].pathPoints[nextIndex]);
				}
			}
		}
		return points;
	}

	// Get path point propaties
	function getPathPointProperties(point) {
		return {
			pathPoint : point,
			anchor : {
				x : point.anchor[0],
				y : point.anchor[1]
			},
			leftDirection : {
				x : point.leftDirection[0],
				y : point.leftDirection[1]
			},
			rightDirection : {
				x : point.rightDirection[0],
				y : point.rightDirection[1]			
			}
		};
	}

	// Get angle from two points
	function getAngle(p1, p2, isDegree) {
		var radian = Math.atan2(p2.y - p1.y, p2.x - p1.x);
		return isDegree ? radian / Math.PI * 180 : radian;
	}

}());