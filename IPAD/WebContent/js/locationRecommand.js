window.onload = function () {
	fetcData();
	$.getJSON(contextPath + "/json/emd.geojson", function (geojson) {
		var data = geojson.features;

		data.forEach(val => {
			if (val.properties.temp.includes('송파구 위례동')) {
				songpaPoly = val.geometry.coordinates[0][0];
			}
			if (val.properties.temp.includes('하남시 위례동')) {
				hanamPoly = val.geometry.coordinates[0][0];
			}
			if (val.properties.temp.includes('성남시 위례동')) {
				sungnamPoly = val.geometry.coordinates[0][0];
			}
		});
	});
}

function writeRankList() {
    console.log("write실행")
    document.getElementById('first').innerText = list[0];
    document.getElementById('second').innerText = list[1];
    document.getElementById('third').innerText = list[2];
}

 function selectRegion(event) {
	 var clickedTd = event.target;
     var tdContent = clickedTd.innerText;
     showMapData(tdContent);

 }
 
 function showMapData(tdContent){
	 if (tdContent == '송파구 위례'){
		 songpaHosLoc();
		 document.getElementById('regionDetail').innerText = '송파구 위례';
	 } else if(tdContent == '성남시 위례') {
		 sungnamHosLoc();
		 document.getElementById('regionDetail').innerText = '성남시 위례';
	 } else if(tdContent == '하남시 위례'){
		 hanamHosLoc();
		 document.getElementById('regionDetail').innerText = '하남시 위례';
	 }
 }

function showlist() {
    console.log("나주엥 찍히면 좋겠앙")
}

var list = [];

function getRankList() {

    var checkImpl = document.getElementById('implant').checked;
    var checkOrth = document.getElementById('orthodontics').checked;
    var data = {
        checkImpl: checkImpl,
        checkOrth: checkOrth
    };
    
    fetch(contextPath + "/locationRecommand/submit.do", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(jsonArray => {
            console.log("fetch 시작", jsonArray);
            list.length = 0;
            console.log(jsonArray);
            for (let i = 0; i < jsonArray.length; i++) {
                list.push(jsonArray[i]["adm_nm"]);
                
            }
            console.log(list);
            console.log("list삽입끝")
        })
        .then(() => {
            writeRankList();

            // 이제 writeRankList가 실행된 이후에 아래 코드가 실행됩니다.
            var tempcon = document.getElementById('first').innerText;
            showMapData(tempcon);
        })
        
        .catch(error => {
            console.error('에러 발생:', error);
        });
}

function mapMenuClick(e) {
	document.querySelector('#mapMenu').innerHTML = e.innerHTML;
	document.querySelector('#areaMenu').style.display = 'none';
	var selall = document.querySelectorAll('.tempNum');
	for (let i = 0; i < selall.length; i++) {
		selall[i].innerHTML = e.innerHTML;
	}

}


function ClickPopUpBtn(e) {
	document.querySelector('#selectArea').innerHTML = e.innerHTML;
}

function ClickHosCnt() {
	document.querySelector('#areaMenu').style.display = 'block';
}

function hosLocClick(e) {
	document.querySelector('#areaMenu').innerHTML = e.innerHTML;
}

var t = document.querySelector('#hosLocT');

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
	mapOption = {
		center: new kakao.maps.LatLng(37.47601668950402, 127.15099417223486), // 지도의
		// 중심좌표
		level: 6, // 지도의 확대 레벨
		disableDoubleClickZoom: true,
		scrollwheel: false,
		draggable: false
	};

var map = new kakao.maps.Map(mapContainer, mapOption);

// -----------------------------------------------------------------------

var markerPosition1 = new kakao.maps.LatLng(37.47860551575809, 127.16237294151435);
var markerPosition2 = new kakao.maps.LatLng(37.48274629824583, 127.13696522477319);
var markerPosition3 = new kakao.maps.LatLng(37.468393767232406, 127.14408328318119);

var marker1 = new kakao.maps.Marker({
	position: markerPosition1
});
var marker2 = new kakao.maps.Marker({
	position: markerPosition2
});
var marker3 = new kakao.maps.Marker({
	position: markerPosition3
});


// 지도에 표시 -------------------------------------------------------------
var moveLatLon;

function addArea() {
	deleteArea();
	displayArea(songpaPoly);
	displayArea(hanamPoly);
	displayArea(sungnamPoly);
}

function everyHos() {
	map.setLevel(6);
	moveLatLon = new kakao.maps.LatLng(37.47601668950402, 127.15099417223486);
	map.panTo(moveLatLon);
	deleteMarker();
	hanamHos();
	sungnamHos();
	songpaHos();
	overlayDel.setMap(null);
}

function songpaHosLoc() {
	map.setLevel(5);
	deleteArea();
	displayArea(songpaPoly);
	moveLatLon = new kakao.maps.LatLng(37.48274629824583, 127.13696522477319);
	map.panTo(moveLatLon);
	deleteMarker();
	songpaHos();
	overlayDel.setMap(null);
}

function sungnamHosLoc() {
	map.setLevel(5);
	deleteArea();
	displayArea(sungnamPoly);
	moveLatLon = new kakao.maps.LatLng(37.468393767232406, 127.14408328318119);
	map.panTo(moveLatLon);
	deleteMarker();
	sungnamHos();
	overlayDel.setMap(null);
}

function hanamHosLoc() {
	map.setLevel(5);
	deleteArea();
	displayArea(hanamPoly);
	moveLatLon = new kakao.maps.LatLng(37.47860551575809, 127.16237294151435);
	map.panTo(moveLatLon);
	deleteMarker();
	hanamHos();
	overlayDel.setMap(null);
}


// json으로 가져오기----------------------------------------------------------------
var array = [];
function fetcData() {
	fetch(contextPath + '/json/map.do')
		.then(response => {
			if (!response.ok) {
				throw new Error('네트워크 응답이 올바르지 않습니다.');
			}
			return response.json();
		})
		.then(data => {
			for (let i = 0; i < data.length; i++) {
				array.push(data[i])
			}
			console.log(array);
		})
		.catch(error => console.error('에러:', error));
}

function hanamHos() {
	for (let i = 0; i < array.length; i++) {
		if (array[i].region == '하남시' && array[i].business_status == '영업/정상') {
			displayMarker(array[i],openHosImg);
		} else if (array[i].region == '하남시' && array[i].business_status != '영업/정상'){
			displayMarker(array[i],closeHosImg);
		}
		
	}
}

function sungnamHos() {
	for (let i = 0; i < array.length; i++) {
		if (array[i].region == '성남시'&& array[i].business_status == '영업/정상') {
			displayMarker(array[i],openHosImg);
		}else if (array[i].region == '성남시' && array[i].business_status != '영업/정상'){
			displayMarker(array[i],closeHosImg);
		}
	}
}

function songpaHos() {
	for (let i = 0; i < array.length; i++) {
		if (array[i].region == '송파구' && array[i].business_status == '영업/정상') {
			displayMarker(array[i],openHosImg);
		}else if (array[i].region == '송파구' && array[i].business_status != '영업/정상'){
			displayMarker(array[i],closeHosImg);
		}
	}
}

// 오버레이 ----------------------------------------
const markerArr = [];
var overlayDel = new kakao.maps.CustomOverlay({
	yAnchor: 3,
	position: null
});;

var openHosImg = contextPath + "/img/hosMark.png"
var closeHosImg = contextPath + "/img/closeHosMark.png"
var imageSize = new kakao.maps.Size(20, 20);
var hos = document.getElementById('hos');
var hosLoc = document.getElementById('hosLoc');

function displayMarker(data, img) {
	var markerImage = new kakao.maps.MarkerImage(img, imageSize);
	var position = new kakao.maps.LatLng(Number(data.x_coordinate), Number(data.y_coordinate));

	var marker = new kakao.maps.Marker({
		map: map,
		position: position,
		image: markerImage,
	});

	markerArr.push(marker);

	var overlay = new kakao.maps.CustomOverlay({
		yAnchor: 3,
		position: marker.getPosition(),
	});

	kakao.maps.event.addListener(marker, 'click', function () {
		hos.innerHTML = data.hospital_name;
		hosLoc.innerHTML = data.address;
	});
}

function deleteMarker() {
	for (let i = 0; i < markerArr.length; i++) {
		markerArr[i].setMap(null);
	}
}

// 폴리곤 ----------------------------------------
var songpaPoly;
var hanamPoly;
var sungnamPoly;
var polygon = [];

function displayArea(coordinates) {
	var path = [];
	coordinates.forEach(coordinate => {
		var point = {
			x: coordinate[1],
			y: coordinate[0]
		};
		path.push(new kakao.maps.LatLng(coordinate[1], coordinate[0]))
	});

	polygon.push(new kakao.maps.Polygon({
		map: map,
		path: path,
		strokeWeight: 4,
		strokeColor: 'red',
		strokeOpacity: 0.5,
		strokeStyle: 'solid',
		fillColor: 'red',
		fillOpacity: 0.05
	}));
}
function deleteArea() {
	polygon.forEach(coordinate => {
		coordinate.setMap(null)
	}
	)
}

