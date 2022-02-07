
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;

var id=0;
function save(form) {
    var data = {};
    data.ilosc = form.ilosc.value;
    data.marka = form.marka.value;
    data.cena = form.cena.value;
    data.male = form.male.value;
    data.wiek = form.wiek.value;

    console.log("a");

    var open = indexedDB.open("localDB", 2);

    open.onupgradeneeded = function () {
        var db = open.result;
        if (!db.objectStoreNames.contains("quest")) {
            db.createObjectStore("quest", { keyPath: "id" });
        }
    };
    open.onsuccess = function () {
        var db = open.result;
        var tx = db.transaction("quest", "readwrite");
        var store = tx.objectStore("quest");
        store.put({id:id, ilosc: data.ilosc, marka: data.marka, cena: data.cena, male: data.male, wiek: data.wiek});
        tx.oncomplete = function () {
            db.close();
        };
    }
    id++;
    // window.location.replace('/');
}

function send_all()
{
    console.log("b");
    var open = indexedDB.open("localDB", 2);
   open.onupgradeneeded = function() {
      var db = openRequest.result;
      if (!db.objectStoreNames.contains('quest')) { 
        db.createObjectStore('quest', {keyPath: 'id'}); 
      }
    };

    var data = {};
    var txt;
    open.onsuccess = function() {
      var db= open.result;
      var tx= db.transaction("quest", "readwrite");
      var store= tx.objectStore("quest");
      var g = store.getAll();
      g.onsuccess = function() {
         var res = g.result;
        for(const item of res) {
               data.ilosc = item["ilosc"];
               data.marka = item["marka"];
               data.cena = item["cena"];
               data.male = item["male"];
               data.wiek = item["wiek"];
               txt = JSON.stringify(data);
               sendOne(txt);
        }
      };
      store.clear();
      tx.oncomplete = function() {
         db.close();
      };
    }
}

function sendOne(txt) {
    console.log(txt);
    fetch("/ankieta", { method: 'POST', body: txt })
      .then()
      .catch(error => console.log("Błąd: ", error));
}