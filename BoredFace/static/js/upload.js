function selectFileImage(fileObj, index) {
	//loading.gif
	// $(".upload_show li").eq(nowNum).find('img').attr('src','img/up.gif');

	var file = fileObj.files['0'];
	var file_len = fileObj.files.length;
	// alert(fileObj.files.length);
	for (var i = 0; i < file_len; i++) {
		FileImageControl(fileObj.files[i], index);
		// console.log(fileObj.files[i]);
	}

	var Orientation = null;

}
var ImageFile = [];
var uploadFiles = [];
function FileImageControl(file, index){
	if (file) {
		var rFilter = /^(image\/jpeg|image\/png)$/i; // 妫€鏌ュ浘鐗囨牸寮�
		if (!rFilter.test(file.type)) {
			return;
		}
		
		EXIF.getData(file, function() {
		   // alert(EXIF.pretty(this));
		    EXIF.getAllTags(this); 
		    //alert(EXIF.getTag(this, 'Orientation')); 
		    Orientation = EXIF.getTag(this, 'Orientation');
		    //return;
		});
		
		var oReader = new FileReader();
		var expectWidth,expectHeight;
		oReader.onload = function(e) {
			//var blob = URL.createObjectURL(file);
			//_compress(blob, file, basePath);
			var image = new Image();
			image.src = e.target.result;
			//console.log(image.src);
			image.onload = function() {
				var expectWidth = this.naturalWidth;
				var expectHeight = this.naturalHeight;
				// alert(expectWidth+'###'+expectHeight)
				
				if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 750) {
					expectWidth = 750;
					expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
				} else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 750) {
					expectHeight = 750;
					expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
				}
				var canvas = document.createElement("canvas");
				var ctx = canvas.getContext("2d");
				canvas.width = expectWidth;
				canvas.height = expectHeight;
				// alert(canvas.width+';'+canvas.height);
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
				var base64 = null;
				base64 = canvas.toDataURL("image/jpeg", 0.6);
				//淇ios
				if (navigator.userAgent.match(/iphone/i)) {
					// console.log('iphone');
					//alert(expectWidth + ',' + expectHeight);
				
					if(Orientation != "" && Orientation != 1){
						// alert('鏃嬭浆澶勭悊');
						switch(Orientation){
						 	case 6://闇€瑕侀『鏃堕拡锛堝悜宸︼級90搴︽棆杞�
						 		// alert('闇€瑕侀『鏃堕拡锛堝悜宸︼級90搴︽棆杞�');
						 		rotateImg(this,'left',canvas,expectWidth,expectHeight);
						 		break;
						 	case 8://闇€瑕侀€嗘椂閽堬紙鍚戝彸锛�90搴︽棆杞�
						 		// alert('闇€瑕侀『鏃堕拡锛堝悜鍙筹級90搴︽棆杞�');
						 		rotateImg(this,'right',canvas,expectWidth,expectHeight);
						 		break;
						 	case 3://闇€瑕�180搴︽棆杞�
						 		// alert('闇€瑕�180搴︽棆杞�');
								rotateImg(this,'right',canvas,expectWidth,expectHeight);//杞袱娆�
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								break;
						}		
					}
					
					/*var mpImg = new MegaPixImage(image);
					mpImg.render(canvas, {
						maxWidth: 800,
						maxHeight: 1200,
						quality: 0.6,
						orientation: 8
					});*/
					base64 = canvas.toDataURL("image/jpeg", 0.6);
				}else if (navigator.userAgent.match(/Android/i)) {// 淇android
					//var encoder = new JPEGEncoder();
					base64 = canvas.toDataURL("image/jpeg", 0.6);
					//base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);
				}else{
					//alert(Orientation);
					if(Orientation != "" && Orientation != 1){
						//alert('鏃嬭浆澶勭悊');
						switch(Orientation){
						 	case 6://闇€瑕侀『鏃堕拡锛堝悜宸︼級90搴︽棆杞�
						 		// alert('闇€瑕侀『鏃堕拡锛堝悜宸︼級90搴︽棆杞�');
						 		rotateImg(this,'left',canvas,expectWidth,expectHeight);
						 		break;
						 	case 8://闇€瑕侀€嗘椂閽堬紙鍚戝彸锛�90搴︽棆杞�
						 		// alert('闇€瑕侀『鏃堕拡锛堝悜鍙筹級90搴︽棆杞�');
						 		rotateImg(this,'right',canvas,expectWidth,expectHeight);
						 		break;
						 	case 3://闇€瑕�180搴︽棆杞�
						 		// alert('闇€瑕�180搴︽棆杞�');
								rotateImg(this,'right',canvas,expectWidth,expectHeight);//杞袱娆�
								rotateImg(this,'right',canvas,expectWidth,expectHeight);
								break;
						}		
					}
					
					base64 = canvas.toDataURL("image/jpeg", 0.6);
				}

				ImageFile[0]=base64;
				switch (index)
				{
				case 0:
					$(".btn_upload0>img").attr("src",ImageFile[0]);
					break;
				case 1:
					$(".btn_upload1>img").attr("src",ImageFile[0]);
					break;
				}

				uploadFiles[index] = ImageFile[0];
				//uploadFiles[index] = image.src;
	
			};
		};
		oReader.readAsDataURL(file);
	}
}


function rotateImg(img, direction,canvas,expectWidth,expectHeight) {  
	//alert(img);
	//鏈€灏忎笌鏈€澶ф棆杞柟鍚戯紝鍥剧墖鏃嬭浆4娆″悗鍥炲埌鍘熸柟鍚�  
	var min_step = 0;  
	var max_step = 3;  
	//var img = document.getElementById(pid);  
	if (img == null) return;  
	//img鐨勯珮搴﹀拰瀹藉害涓嶈兘鍦╥mg鍏冪礌闅愯棌鍚庤幏鍙栵紝鍚﹀垯浼氬嚭閿�  
	var width = expectWidth;//img.width; //
	var height = expectHeight;// img.height;//
	// alert(width+';'+height);
	//var step = img.getAttribute('step');  
	var step = 2;  
	if (step == null) {  
		step = min_step;  
	}  
	if (direction == 'right') {  
		step++;  
		//鏃嬭浆鍒板師浣嶇疆锛屽嵆瓒呰繃鏈€澶у€�  
		step > max_step && (step = min_step);  
	} else {  
		step--;  
		step < min_step && (step = max_step);  
	}  
	//img.setAttribute('step', step);  
	/*var canvas = document.getElementById('pic_' + pid);  
	if (canvas == null) {  
		img.style.display = 'none';  
		canvas = document.createElement('canvas');  
		canvas.setAttribute('id', 'pic_' + pid);  
		img.parentNode.appendChild(canvas);  
	}  */
	//鏃嬭浆瑙掑害浠ュ姬搴﹀€间负鍙傛暟  
	var degree = step * 90 * Math.PI / 180;  
	var ctx = canvas.getContext('2d');  
	switch (step) {  
		case 0:  
			canvas.width = width;  
			canvas.height = height;  
			ctx.drawImage(img, 0, 0, expectWidth, expectHeight);  
			break;  
		case 1:  
			canvas.width = height;  
			canvas.height = width;  
			ctx.rotate(degree);  
			ctx.drawImage(img, 0, -height, expectWidth, expectHeight);  
			break;  
		case 2:  
			canvas.width = width;  
			canvas.height = height;  
			ctx.rotate(degree);  
			ctx.drawImage(img, -width, -height, expectWidth, expectHeight);  
			break;  
		case 3:  
			canvas.width = height;  
			canvas.height = width;  
			ctx.rotate(degree);  
			ctx.drawImage(img, -width, 0, expectWidth, expectHeight);  
			break;  
	}  
}  


var clickTimes = 1;
function faceSwap(fileObj){
	document.getElementById("loading").style.display="inline";
	console.log("faceSwap");
	
	console.log("clickTimes:" + clickTimes);
	if(clickTimes==1){
		clickTimes++;

		requestTimes++;
		requestPicNow();
         
	}

    
}

function requestPicNow(){
	//console.log("requestPic"); 

	var uuidSrc = null;
	var uuidDst = null;

	if(uploadFiles[0] != null){
		uploadimgUrl = uploadFiles[0];
		 //console.log("uploadimgUrl:" + uploadimgUrl); 
		var start = uploadimgUrl.indexOf(',')+1;
		var uploadUrl = uploadimgUrl.slice(start);
			
		uploadUrl = encodeURIComponent(uploadUrl);
		$.ajax({
				url: 'http://api.ink-image.com:9000/rest/1.0/ink_image/v1/face_swap_upload',
				type: 'post',
				data:'AppKey=9400001&AppSecret=U6VEsPIZXL35BmWaAEnsAAAA&imageBody='+uploadUrl,
				success: function (data) {
					
					uuidSrc = data.tagid;
					console.log("upload succ src:" + uuidSrc);
					if((uuidSrc != null) && (uuidDst != null))
					{
						goFaceSwap(uuidSrc, uuidDst);
					}
					else if((uuidSrc != null) && (uploadFiles[1] == null))
					{
						var modelSet = new Array("model_film", "model_jz", "model_jz2", "model_man", "model_star", "model_star2", "model_star3","model_tv", "model_tv2", "model_tv3");
						var index    = Math.floor((Math.random()*10));
						console.log("model index:" + index);
						var model    = modelSet[index];
						goFaceSwapModel(uuidSrc, model);
					}
					setTimeout(function(){
						clickTimes = 1;
                    },500);
				},
				error: function (xhr, errorType, error) {
					console.log(error);
					clickTimes = 1;
				}
			});
	}
	else{
		clickTimes = 1;
	}

	if(uploadFiles[1] != null){
		uploadimgUrl = uploadFiles[1];
		 //console.log("uploadimgUrl:" + uploadimgUrl); 
		var start = uploadimgUrl.indexOf(',')+1;
		var uploadUrl = uploadimgUrl.slice(start);
			
		uploadUrl = encodeURIComponent(uploadUrl);
		$.ajax({
				url: 'http://api.ink-image.com:9000/rest/1.0/ink_image/v1/face_swap_upload',
				type: 'post',
				data:'AppKey=9400001&AppSecret=U6VEsPIZXL35BmWaAEnsAAAA&imageBody='+uploadUrl,
				success: function (data) {
					
					uuidDst = data.tagid;
					console.log("upload succ dst:" + uuidDst);
					
					if((uuidSrc != null) && (uuidDst != null))
					{
						goFaceSwap(uuidSrc, uuidDst);
					}
					setTimeout(function(){
						clickTimes = 1;
                    },500);
				},
				error: function (xhr, errorType, error) {
					console.log(error);
					clickTimes = 1;
				}
			});
	}
	else{
		clickTimes = 1;
	}
        
}

function goFaceSwap(uuidSrc, uuidDst){
	if(uuidSrc == null || uuidDst == null){
		return;
	}
	console.log("uuidSrc:"+uuidSrc+"uuidDst:"+uuidDst);


	$.ajax({
				url:  'http://api.ink-image.com:9000/rest/1.0/ink_image/v1/face_swap_synthesis',
				type: 'get',
				data: 'uuidSrc='+uuidSrc+'&uuidDst='+uuidDst+'&AppKey=9400001&AppSecret=U6VEsPIZXL35BmWaAEnsAAAA',
				success: function (data) {
					
					imgid = data.tagid;
					console.log("faceSwap succ id:" + imgid);
					document.getElementById("loading").style.display="none";
					getFaceSwapImg(imgid);
					uuidSrc = null;
					uuidDst = null;
				},
				error: function (xhr, errorType, error) {
					document.getElementById("loading").style.display="none";
					alert("换脸失败，请换张照片...");  
					console.log(error);
				}
			});
}

function goFaceSwapModel(uuidSrc, model){
	if(uuidSrc == null || model == null){
		return;
	}
	console.log("uuidSrc:"+uuidSrc+"model:"+model);


	$.ajax({
				url:  'http://api.ink-image.com:9000/rest/1.0/ink_image/v1/face_swap_model',
				type: 'get',
				data: 'uuidSrc='+uuidSrc+'&model='+model+'&AppKey=9400001&AppSecret=U6VEsPIZXL35BmWaAEnsAAAA',
				success: function (data) {
					
					imgid = data.tagid;
					console.log("faceSwapModel succ id:" + imgid);
					document.getElementById("loading").style.display="none";
					getFaceSwapImg(imgid);
					uuidSrc = null;
					uuidDst = null;
				},
				error: function (xhr, errorType, error) {
					document.getElementById("loading").style.display="none";
					alert("换脸失败，请换张照片...");  
					console.log(error);
				}
			});
}

function getFaceSwapImg(uuid){
	$(".btn_upload2>img").attr("src","http://api.ink-image.com:9002/rest/1.0/ink_image/v1/face_swap_get_image?uuid="+uuid+"&AppKey=9400001");
}
