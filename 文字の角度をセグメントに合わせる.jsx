(function() {

	// Settings
	var settings = {
		followPathDirection : false,
		keepAnchor : true,
		showAlert : true
	};

	// Title and version
	const SCRIPT_TITLE = 'セグメントと文字のの角度を揃える';
	const SCRIPT_VERSION = '0.5.0';

	// Document and selection
	var doc = app.activeDocument;
	var sel = doc.selection;

	// Get target items
	var targetText = getTargetItems(sel, 'TextFrame');
	var targetPoints = getTargetPoints(getTargetItems(sel, 'PathItem'));
	var effectiveSegment = targetPoints.length === 2;

	// Confirm and execute
	if(settings.showAlert) {
		if(!doc || sel.length < 1) {
			alert('オブジェクトが選択されていません\n少なくとも1つ以上のオブジェクトを選択してください');
			return;
		} else if(targetText.length < 1) {
			alert('テキストオブジェクトが選択されていません\n少なくとも1つ以上の「ポイント文字」か「エリア内文字」を選択してください');
			return;
		} else if(!effectiveSegment) {
			if(!confirm('セグメントの選択が適切ではありません\nセグメントの角度に合わせて文字を回転するには、1セグメントのみを選択してください。このまま続けると選択した文字オブジェクトの回転をすべてリセットします。続行しますか？')) return;
		}
	}
	mainProcess();

	// Main process
	function mainProcess() {

			var pathAngle = 0;

			if(effectiveSegment) {
				var points = [getPathPointProperties(targetPoints[0]), getPathPointProperties(targetPoints[1])];
				pathAngle = getAngle(points[0].anchor, points[1].anchor, false) * (180 / Math.PI);
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

				var textAngle = getAngle(dummyTextLocate[0], dummyTextLocate[1], false) * (180 / Math.PI);

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
		if(isDegree) {
			return radian / Math.PI * 180;
		} else {
			return radian;
		}
	}

	// --------------使用してない--------------

	// Get the distance
	function getDistance(p1, p2) {
		return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
	}

	// Get the position from the angle and the distance
	function getPosition(radian, distance, offsetPoint) {
		return [
			Math.cos(radian) * distance + offsetPoint.x,
			Math.sin(radian) * distance + offsetPoint.y
		];
	}

	// プロパティをalert表示
	function alertP(obj) {
		var str = '';
		for(var key in obj) {
			try {
				str += '\n' + key + ' : ' + String(obj[key]);
			} catch(e) {
				str += '\n' + key + ' : --読み込み失敗--';
			}
		}
		alert(str);
	}

}());