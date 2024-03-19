import { detecType, setStorage, detecIcon } from "./helpers.js";

//htmlden gelenler
const form = document.querySelector("form");
const list = document.querySelector("ul");

//olay izleyicisi
form.addEventListener("submit", handleSubmit);
list.addEventListener("click", handleClick);

//ortak kullanım alanı
var map;
var notes = JSON.parse(localStorage.getItem("notes")) || [];
var coords = [];
var layerGroup = [];

navigator.geolocation.getCurrentPosition(loadMap, console.log("kullanıcı kabul etmedi")
);
//haritaya tıklanınca çalışır
function onMapClick(e){
form.style.display = "flex";
coords = [e.latlng.lat, e.latlng.lng];
}
//kullanıcının konumuna göre haritayı getir
function loadMap(e){
    //haritanın kurulumu
    map = new L.map('map').setView([e.coords.latitude, e.coords.longitude], 10);
    L.control;
    //haritanın görünümü
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
//haritada ekrana basılacak imleçlerin tutulacağı katman
layerGroup = L.layerGroup().addTo(map);
//localden gelen notları ekrana renderlama
renderNoteList(notes)
//haritaya tıklanıldığında çalışacak fonksiyon
map.on("click", onMapClick);
}
function renderMarker (item) {
    //marker oluşturur
    L.marker(item.coords, {icon: detecIcon(item.status)})
    //imleçlerin olduğu katmanı ekler
    .addTo(layerGroup)
    //üzerine tıklanınca popup ekleme
    .bindPopup(`${item.desc}`);
}
//form gönderme
function handleSubmit(e) {
    e.preventDefault();
    console.log(e);
  
    const desc = e.target[0].value;
    if (!desc) return;
    const date = e.target[1].value;
    const status = e.target[2].value;
    // notes dizisine eleman ekleme
    notes.push({ id: new Date().getTime(), desc, date, status, coords });
    console.log(notes);
    // local storage güncelleme
    setStorage(notes);
    // renderNoteList fonksiyonuna notes dizsinie gönderme
    renderNoteList(notes);
    // formu kapatma
    form.style.display = "none";
  }
//ekrana notları basma
function renderNoteList(item){
    //notları temizler
    list.innerHTML = "";
    //markerları temizle
    layerGroup.clearLayers();
    //her not için diziyi dönüp notları aktarma
    item.forEach((item) =>{
    const listElement = document.createElement("li");
    //datasına sahip olduğu id yi ekleme
    listElement.dataset.id = item.id;
    listElement;
    listElement.innerHTML = 
    `
    <div>
            <p>${item.desc}</p>
            <p><span>Tarih: </span>${item.date}</p>
            <p><span>Durum: </span>${detecType(item.status)}</p>

            <i class="bi bi-x" id="delete"></i>
            <i class="bi bi-airplane-fill" id="fly"></i>
    </div>
    `;
    list.insertAdjacentElement("afterbegin", listElement);
    renderMarker(item);
    });
}

function handleClick (e){
    //güncellenecek elemanın idsini öğrenme
    const id = e.target.parentElement.parentElement.dataset.id;
    if(e.target.id === "delete"){
        //idsini bildiğimiz elemanı diziden kaldırma
        notes = notes.filter((note) => note.id != id);
        //locali güncelle
        setStorage(notes);
        //ekranı güncelleme
        renderNoteList(notes);
    }
    if (e.target.id === "fly") {
        const note = notes.find((note) => note.id == id);
        console.log(note);
        map.flyTo(note.coords);
      }
}