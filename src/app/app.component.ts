import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import 'fabric';
declare const fabric: any;

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})

export class AppComponent {

	private canvas: any;
	private printArea: any;
	// Internal Print Area Configuration
	private printAreaConfig: any = {
		clipName: 'print_area',
		width: 200,
		height: 200,
		ratio: 1,
		dpi: 300,
		top: 150,
		left: 150,
		angle: 0,
		fill: 'transparent',
		stroke: '#ffffff',
		strokeWidth: 2
	};

	private mmToInch = 25.4; // 1 inch = 25.4 mm

	private size: any = {
		// Canvas Size
		width: 500, // in pixel
		height: 500, // in pixel
		ratio: 1,
		dpi: 72, // in ppi // Canvas Acctual DPI which is created by canvas.toDataURL()

		// Canvas Printing Size
		canvasPrintWidth: 50, // in mm
		canvasPrintHeight: 50, // in mm
		canvasPrintRatio: 1,
		canvasPrintDPI: 300, // in ppi // Canvas Output DPI which is required



	};

	private canvasPixelPerMillimeret = this.size.canvasPrintDPI / this.mmToInch;

	private textString: string;
	private url: string | any = '';


	private json: any;
	private globalEditor: boolean = false;
	private textEditor: boolean = false;
	private imageEditor: boolean = false;
	private figureEditor: boolean = false;
	private selected: any;


	private props: any = {
		canvasFill: '#00000',
		canvasImage: 'assets/ShirteeProducts/man_basic_front_css_4.png',
		id: null,
		opacity: null,
		fill: null,
		fontSize: null,
		lineHeight: null,
		charSpacing: null,
		fontWeight: null,
		fontStyle: null,
		textAlign: null,
		fontFamily: null,
		TextDecoration: ''
	};


	constructor() { }

	calculateCanvasSize() {
		// this.size.width = parseFloat(`${this.size.canvasPrintWidth * this.canvasPixelPerMillimeret}`).toFixed(2);		
		// this.size.height = parseFloat(`${this.size.canvasPrintHeight * this.canvasPixelPerMillimeret}`).toFixed(2);		
	}

	updatePrintAreaConfig(selectedObject){
		if (selectedObject && selectedObject.clipName == "print_area") {
			this.printAreaConfig = {
				...this.printAreaConfig,
				left: parseInt(selectedObject.left),
				top: parseInt(selectedObject.top),
				width: parseInt(`${selectedObject.width * selectedObject.scaleX}`),
				height:parseInt(`${selectedObject.height * selectedObject.scaleY}`),
				angle: selectedObject.angle,
			}
		}
	}

	updatePrintAreaInCanvas() {
		// let print_area = (this.canvas.getObjects() || []).find(o => o.clipName == this.printAreaConfig.clipName);
		// print_area.set(this.printAreaConfig);
		// this.canvas.item(0).setHeight(this.printAreaConfig.height);
		// this.canvas.item(0).setWidth(this.printAreaConfig.width);
		// this.canvas.item(0).setScaleX(1);
		// this.canvas.item(0).setScaleY(1);
		// this.canvas.item(0).setCoords();
		// console.log(this.canvas.item(0));

		// this.canvas.renderAll();
		this.printArea.set('top', parseInt(this.printAreaConfig.top, 10)).setCoords();
		this.printArea.set('left', parseInt(this.printAreaConfig.left, 10)).setCoords();
		this.printArea.set('height', parseInt(this.printAreaConfig.height, 10)).setCoords();
		this.printArea.set('width', parseInt(this.printAreaConfig.width, 10)).setCoords();
		this.canvas.requestRenderAll();
		let calculateRation:any = this.printAreaConfig.width / this.printAreaConfig.height;
		this.printAreaConfig.ratio = parseFloat(calculateRation).toFixed(2)

	}

	loadCanvasSizeConfiguration() {
		this.canvas.setWidth(this.size.width);
		this.canvas.setHeight(this.size.height);

		this.setCanvasImage();
		this.setCanvasFill();

		// Start Initial Print Area Drawing.
		this.loadInitialPrintArea();
	}

	ngOnInit() {
		this.calculateCanvasSize();

		//setup front side canvas
		this.canvas = new fabric.Canvas('canvas', {
			hoverCursor: 'pointer',
			selection: true,
			selectionBorderColor: 'blue'
		});
		fabric.Object.prototype.transparentCorners = false;

		this.printArea = new fabric.Rect({
			left: this.printAreaConfig.left,
			top: this.printAreaConfig.top,
			width: this.printAreaConfig.width,
			height: this.printAreaConfig.height,
			fill: this.printAreaConfig.fill,
			stroke: this.printAreaConfig.stroke,
			strokeWidth: this.printAreaConfig.strokeWidth,
			clipName: this.printAreaConfig.clipName,
		});

		this.loadCanvasSizeConfiguration();

		this.canvas.on({
			'object:moving': (e) => {
				let selectedObject = e.target;
				switch (selectedObject.clipName) {
					case "print_area":
						this.updatePrintAreaConfig(selectedObject);
						break;				
					default:
						break;
				}
			},
			'object:modified': (e) => {
				let selectedObject = e.target;
				switch (selectedObject.clipName) {
					case "print_area":
						this.updatePrintAreaConfig(selectedObject);
						break;				
					default:
						break;
				}
			},
			'object:selected': (e) => {

				// let selectedObject = e.target;
				// this.selected = selectedObject
				// selectedObject.hasRotatingPoint = true;
				// selectedObject.transparentCorners = false;
				// // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

				// this.resetPanels();

				// if (selectedObject.type !== 'group' && selectedObject) {

				// 	this.getId();
				// 	this.getOpacity();

				// 	switch (selectedObject.type) {
				// 		case 'rect':
				// 		case 'circle':
				// 		case 'triangle':
				// 			this.figureEditor = true;
				// 			this.getFill();
				// 			break;
				// 		case 'i-text':
				// 			this.textEditor = true;
				// 			this.getLineHeight();
				// 			this.getCharSpacing();
				// 			this.getBold();
				// 			this.getFontStyle();
				// 			this.getFill();
				// 			this.getTextDecoration();
				// 			this.getTextAlign();
				// 			this.getFontFamily();
				// 			break;
				// 		case 'image':
				// 			console.log('image');
				// 			break;
				// 	}
				// }
			},
			'selection:cleared': (e) => {
				// this.selected = null;
				// this.resetPanels();
			}
		});

		// this.canvas.setWidth(this.size.width);
		// this.canvas.setHeight(this.size.height);

		// get references to the html canvas element & its context
		// this.canvas.on('mouse:down', (e) => {
		// let canvasElement: any = document.getElementById('canvas');
		// console.log(canvasElement)
		// });
		// this.setCanvasImage();
		// this.setCanvasFill();

		// Start Initial Print Area Drawing.
		// this.loadInitialPrintArea();
	}

	loadInitialPrintArea() {

		this.extend(this.printArea, this.randomId());
		this.canvas.add(this.printArea);
		// this.canvas.item(0).selectable = false;
	}

	/*--------------------------Design Cliping Calculation-------------------------*/

	d2R(deg) {
		return deg * (Math.PI / 180);
	}

	clip_name(name) {
		return _.find(this.canvas.getObjects(), {
			clipFor: name
		})
	}

	clip(ctx, _this) {
		// let objScope = this.canvas.getActiveObject();
		// objScope.setCoords();
		// var clipObj = this.clip_name(objScope.clipName);
		// var scaleXTo1 = (1 / objScope.scaleX);
		// var scaleYTo1 = (1 / objScope.scaleY);
		// ctx.save();
		// var ctxLeft = -(objScope.width / 2) + clipObj.strokeWidth;
		// var ctxTop = -(objScope.height / 2) + clipObj.strokeWidth;
		// var ctxWidth = clipObj.width - clipObj.strokeWidth;
		// var ctxHeight = clipObj.height - clipObj.strokeWidth;
		// ctx.translate(ctxLeft, ctxTop);
		// ctx.scale(scaleXTo1, scaleYTo1);
		// ctx.rotate(this.d2R(objScope.angle * -1));
		// ctx.beginPath();
		// ctx.rect(clipObj.left - objScope.oCoords.tl.x, clipObj.top - objScope.oCoords.tl.y, clipObj.width, clipObj.height);
		// ctx.closePath();
		// ctx.restore();

		_this.setCoords();
		var clipObj = this.clip_name(_this.clipName);
		var scaleXTo1 = (1 / _this.scaleX);
		var scaleYTo1 = (1 / _this.scaleY);
		ctx.save();
		var ctxLeft = -(_this.width / 2) + clipObj.strokeWidth;
		var ctxTop = -(_this.height / 2) + clipObj.strokeWidth;
		var ctxWidth = clipObj.width - clipObj.strokeWidth;
		var ctxHeight = clipObj.height - clipObj.strokeWidth;
		ctx.translate(ctxLeft, ctxTop);
		ctx.scale(scaleXTo1, scaleYTo1);
		ctx.rotate(this.d2R(_this.angle * -1));
		ctx.beginPath();
		ctx.rect(clipObj.left - _this.oCoords.tl.x, clipObj.top - _this.oCoords.tl.y, clipObj.width, clipObj.height);
		ctx.closePath();
		ctx.restore();
	}


	/**************************************************************** 
	 *  							Image size calculation                  *
	 ***************************************************************/

	calculateSize() {

	}


	/*------------------------Block elements------------------------*/

	//Block "Size"

	// changeAreaSize(event: any) {
	// 	this.canvas.setWidth(this.size.width);
	// 	this.canvas.setHeight(this.size.height);
	// }


	/*------------------------Block elements------------------------*/

	//Block "Size"

	changeSize(event: any) {
		this.canvas.setWidth(this.size.width);
		this.canvas.setHeight(this.size.height);
		let calculateRation:any = this.size.width / this.size.height;
		this.size.ratio = parseFloat(calculateRation).toFixed(2);
		this.setCanvasImage();
	}

	//Block "Add text"

	addText() {
		let textString = this.textString;
		let text = new fabric.IText(textString, {
			left: 10,
			top: 10,
			fontFamily: 'helvetica',
			angle: 0,
			fill: '#000000',
			scaleX: 0.5,
			scaleY: 0.5,
			fontWeight: '',
			hasRotatingPoint: true
		});
		this.extend(text, this.randomId());
		this.canvas.add(text);
		this.selectItemAfterAdded(text);
		this.textString = '';
	}

	//Block "Add images"

	getImgPolaroid(event: any) {
		let el = event.target;
		let scope = this;
		fabric.Image.fromURL(el.src, (image) => {
			image.set({
				left: 10,
				top: 10,
				angle: 0,
				padding: 10,
				cornersize: 10,
				hasRotatingPoint: true
			});
			image.scaleToWidth(200);
			image.scaleToHeight(200);
			scope.extend(image, scope.randomId());
			scope.canvas.add(image);
			scope.selectItemAfterAdded(image);
		});
	}

	//Block "Upload Image"

	addImageOnCanvas(url) {
		if (url) {
			let scope = this;
			fabric.Image.fromURL(url, (image) => {
				image.set({
					left: 10,
					top: 10,
					angle: 0,
					padding: 10,
					cornersize: 10,
					hasRotatingPoint: true
				});
				image.scaleToWidth(200);
				image.scaleToHeight(200);
				scope.extend(image, scope.randomId());
				scope.canvas.add(image);
				scope.selectItemAfterAdded(image);
			});
		}
	}

	readUrl(event) {
		let scope = this;
		if (event.target.files && event.target.files[0]) {
			var reader = new FileReader();
			reader.onload = (event) => {
				scope.url = event.target['result'];
			}
			reader.readAsDataURL(event.target.files[0]);
		}
	}

	removeWhite(url) {
		this.url = '';
	};

	//Block "Add figure"

	addFigure(figure) {
		let add: any;
		let classScope = this;
		switch (figure) {
			case 'rectangle':
				add = new fabric.Rect({
					...this.printAreaConfig,
					width: 100,
					height: 100,
					clipName: this.randomId(),
					fill: '#3f51b5'
				});
				break;
			case 'square':
				add = new fabric.Rect({
					width: 100, height: 100, left: 10, top: 10, angle: 0,
					fill: '#4caf50'
				});
				break;
			case 'triangle':
				add = new fabric.Triangle({
					width: 100, height: 100, left: 10, top: 10, fill: '#2196f3'
				});
				break;
			case 'circle':
				add = new fabric.Circle({
					radius: 50, left: 10, top: 10, fill: '#ff5722'
				});
				break;
		}
		this.extend(add, this.randomId());
		add.set({
			clipTo: (ctx) => {
				return this.clip(ctx, add)
			}
		})
		console.log(add);
		this.printArea.set({
			clipFor: add.clipName
		});
		this.canvas.add(add);
		this.selectItemAfterAdded(add);
	}

	/*Canvas*/

	cleanSelect() {
		this.canvas.discardActiveObject();
		this.canvas.requestRenderAll();
	}

	selectItemAfterAdded(obj) {
		this.canvas.discardActiveObject();
		this.canvas.requestRenderAll();
		this.canvas.setActiveObject(obj);
	}

	setCanvasFill() {
		// if (!this.props.canvasImage) {
		this.canvas.backgroundColor = this.props.canvasFill;
		this.canvas.renderAll();
		// }
	}

	extend(obj, id) {
		obj.toObject = (function (toObject) {
			return function () {
				return fabric.util.object.extend(toObject.call(this), {
					id: id
				});
			};
		})(obj.toObject);
	}

	getBgImg(event: any) {
		let el = event.target;
		let self = this;
		fabric.Image.fromURL(el.src, (img) => {
			this.props.canvasImage = el.src;
			self.canvas.setBackgroundImage(img, self.canvas.renderAll.bind(self.canvas), {
				scaleX: self.canvas.width / img.width,
				scaleY: self.canvas.height / img.height
			});
			if (self.props.canvasFill) {
				self.canvas.backgroundColor = self.props.canvasFill;
			} else {
				self.canvas.backgroundColor = '#00000';
			}
		});
	}
	setCanvasImage() {
		let self = this;
		if (this.props.canvasImage) {
			fabric.Image.fromURL(this.props.canvasImage, function (img) {
				// add background image
				self.canvas.setBackgroundImage(img, self.canvas.renderAll.bind(self.canvas), {
					scaleX: self.canvas.width / img.width,
					scaleY: self.canvas.height / img.height
				});
				if (self.props.canvasFill) {
					self.canvas.backgroundColor = self.props.canvasFill;
				} else {
					self.canvas.backgroundColor = '#00000';
				}
			}.bind(this), {
				crossOrigin: 'anonymous'
			});
		}
	}

	randomId() {
		return Math.floor(Math.random() * 999999) + 1;
	}

	/*------------------------Global actions for element------------------------*/

	getActiveStyle(styleName, object) {
		object = object || this.canvas.getActiveObject();
		if (!object) return '';

		return (object.getSelectionStyles && object.isEditing)
			? (object.getSelectionStyles()[styleName] || '')
			: (object[styleName] || '');
	}


	setActiveStyle(styleName, value, object) {
		object = object || this.canvas.getActiveObject();
		if (!object) return;

		if (object.setSelectionStyles && object.isEditing) {
			var style = {};
			style[styleName] = value;
			object.setSelectionStyles(style);
			object.setCoords();
		}
		else {
			object.set(styleName, value);
		}

		object.setCoords();
		this.canvas.renderAll();
	}


	getActiveProp(name) {
		var object = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();
		if (!object) return '';

		return object[name] || '';
	}

	setActiveProp(name, value) {
		var object = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();
		if (!object) return;
		object.set(name, value).setCoords();
		this.canvas.renderAll();
	}

	clone() {
		let activeObject = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject(),
			activeGroup = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();

		if (activeObject) {
			let clone;
			switch (activeObject.type) {
				case 'rect':
					clone = new fabric.Rect(activeObject.toObject());
					break;
				case 'circle':
					clone = new fabric.Circle(activeObject.toObject());
					break;
				case 'triangle':
					clone = new fabric.Triangle(activeObject.toObject());
					break;
				case 'i-text':
					clone = new fabric.IText('', activeObject.toObject());
					break;
				case 'image':
					clone = fabric.util.object.clone(activeObject);
					break;
			}
			if (clone) {
				clone.set({ left: 10, top: 10 });
				this.canvas.add(clone);
				this.selectItemAfterAdded(clone);
			}
		}
	}

	getId() {
		this.props.id = this.canvas.getActiveObject().toObject().id;
	}

	setId() {
		let val = this.props.id;
		let complete = this.canvas.getActiveObject().toObject();
		console.log(complete);
		this.canvas.getActiveObject().toObject = () => {
			complete.id = val;
			return complete;
		};
	}

	getOpacity() {
		this.props.opacity = this.getActiveStyle('opacity', null) * 100;
	}

	setOpacity() {
		this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
	}

	getFill() {
		this.props.fill = this.getActiveStyle('fill', null);
	}

	setFill() {
		this.setActiveStyle('fill', this.props.fill, null);
	}

	getLineHeight() {
		this.props.lineHeight = this.getActiveStyle('lineHeight', null);
	}

	setLineHeight() {
		this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
	}

	getCharSpacing() {
		this.props.charSpacing = this.getActiveStyle('charSpacing', null);
	}

	setCharSpacing() {
		this.setActiveStyle('charSpacing', this.props.charSpacing, null);
	}

	getFontSize() {
		this.props.fontSize = this.getActiveStyle('fontSize', null);
	}

	setFontSize() {
		this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
	}

	getBold() {
		this.props.fontWeight = this.getActiveStyle('fontWeight', null);
	}

	setBold() {
		this.props.fontWeight = !this.props.fontWeight;
		this.setActiveStyle('fontWeight', this.props.fontWeight ? 'bold' : '', null);
	}

	getFontStyle() {
		this.props.fontStyle = this.getActiveStyle('fontStyle', null);
	}

	setFontStyle() {
		this.props.fontStyle = !this.props.fontStyle;
		this.setActiveStyle('fontStyle', this.props.fontStyle ? 'italic' : '', null);
	}


	getTextDecoration() {
		this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
	}

	setTextDecoration(value) {
		let iclass = this.props.TextDecoration;
		if (iclass.includes(value)) {
			iclass = iclass.replace(RegExp(value, "g"), "");
		} else {
			iclass += ` ${value}`
		}
		this.props.TextDecoration = iclass;
		this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
	}

	hasTextDecoration(value) {
		return this.props.TextDecoration.includes(value);
	}


	getTextAlign() {
		this.props.textAlign = this.getActiveProp('textAlign');
	}

	setTextAlign(value) {
		this.props.textAlign = value;
		this.setActiveProp('textAlign', this.props.textAlign);
	}

	getFontFamily() {
		this.props.fontFamily = this.getActiveProp('fontFamily');
	}

	setFontFamily() {
		this.setActiveProp('fontFamily', this.props.fontFamily);
	}

	/*System*/


	removeSelected() {
		let activeObject = this.canvas.getActiveObject(),
			activeGroup = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();

		if (activeObject) {
			this.canvas.remove(activeObject);
			// this.textString = '';
		}
		else if (activeGroup) {
			let objectsInGroup = activeGroup.getObjects();
			this.canvas.discardActiveGroup();
			let self = this;
			objectsInGroup.forEach(function (object) {
				self.canvas.remove(object);
			});
		}
	}

	bringToFront() {
		let activeObject = this.canvas.getActiveObject(),
			activeGroup = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();

		if (activeObject) {
			activeObject.bringToFront();
			// activeObject.opacity = 1;
		}
		else if (activeGroup) {
			let objectsInGroup = activeGroup.getObjects();
			this.canvas.discardActiveGroup();
			objectsInGroup.forEach((object) => {
				object.bringToFront();
			});
		}
	}

	sendToBack() {
		let activeObject = this.canvas.getActiveObject(),
			activeGroup = this.canvas.getActiveObject() == null ? this.canvas.getActiveGroup() : this.canvas.getActiveObject();

		if (activeObject) {
			activeObject.sendToBack();
			// activeObject.opacity = 1;
		}
		else if (activeGroup) {
			let objectsInGroup = activeGroup.getObjects();
			this.canvas.discardActiveGroup();
			objectsInGroup.forEach((object) => {
				object.sendToBack();
			});
		}
	}

	confirmClear() {
		if (confirm('Are you sure?')) {
			this.canvas.clear();
		}
	}

	rasterize() {
		// if (!fabric.Canvas.supports('toDataURL')) {
		//     alert('This browser doesn\'t provide means to serialize canvas to an image');
		// }
		// else {
		console.log(this.canvas.toDataURL('jpg'))
		//window.open(this.canvas.toDataURL('png'));
		var image = new Image();
		image.src = this.canvas.toDataURL('jpg')
		var w = window.open("");
		w.document.write(image.outerHTML);
		// }
	}

	rasterizeSVG() {
		console.log(this.canvas.toSVG())
		// window.open(
		//   'data:image/svg+xml;utf8,' +
		//   encodeURIComponent(this.canvas.toSVG()));
		// console.log(this.canvas.toSVG())
		// var image = new Image();
		// image.src = this.canvas.toSVG()
		var w = window.open("");
		w.document.write(this.canvas.toSVG());
	};


	saveCanvasToJSON() {
		let json = JSON.stringify(this.canvas);
		localStorage.setItem('Kanvas', json);
		console.log('json');
		console.log(json);

	}

	loadCanvasFromJSON() {
		let CANVAS = localStorage.getItem('Kanvas');
		console.log('CANVAS');
		console.log(CANVAS);

		// and load everything from the same json
		this.canvas.loadFromJSON(CANVAS, () => {
			console.log('CANVAS untar');
			console.log(CANVAS);

			// making sure to render canvas at the end
			this.canvas.renderAll();

			// and checking if object's "name" is preserved
			console.log('this.canvas.item(0).name');
			console.log(this.canvas);
		});

	};

	rasterizeJSON() {
		this.json = JSON.stringify(this.canvas, null, 2);
	}

	resetPanels() {
		this.textEditor = false;
		this.imageEditor = false;
		this.figureEditor = false;
	}

}
