// mapkit.init({
//   authorizationCallback: function(done) {
//       var xhr = new XMLHttpRequest();
//       xhr.open("GET", "/services/jwt");
//       xhr.addEventListener("load", function() {
//           done(this.responseText);
//       });
//       xhr.send();
//   }
// });

// var Cupertino = new mapkit.CoordinateRegion(
//   new mapkit.Coordinate(37.3316850890998, -122.030067374026),
//   new mapkit.CoordinateSpan(0.167647972, 0.354985255)
// );
// var map = new mapkit.Map("map");
// map.region = Cupertino;
// map.style="hybrid"
//
// function addPinToMap(coord) {
//   const pin = new mapkit.MarkerAnnotation(new mapkit.Coordinate(coord[1], coord[0]));
//   map.addAnnotation(pin);
// }

let map = L.map("map").setView([0, 0], 1.5);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

async function addPinToMap(coord, info) {
  const marker = L.marker([coord[1], coord[0]]).addTo(map);
  marker.bindPopup(`<b>Magnitude:</b> ${info.magnitude}<br>
                    <b>Place:</b> ${info.place}<br>
                    <b>Time:</b> ${info.time}<br>
                    <a href="${info.link}" target="_blank">More info</a>`);
}

async function fetchData() {
  fetch(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
  )
    .then((response) => response.json())
    .then((data) => {
      const table = document.getElementById("table");
      table.innerHTML =
        "<tr><th>Magnitude </th><th>Place</th><th>Time</th></tr>";
      data.features.forEach((feature) => {
        const magnitude =
          Math.round((feature.properties.mag + Number.EPSILON) * 100) / 100; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/EPSILON
        const place = getCountryName(
          normOrientation(feature.properties.place),
          isoCountries
        );
        //const location = getLocation(feature.geometry.coordinates);
        const time = new Date(feature.properties.time).toLocaleString();
        const link = feature.properties.url;
        const title = feature.properties.title;
        const coord = feature.geometry.coordinates;
        const info = { magnitude, place, time, link };
        addPinToMap(coord, info);
        const row = `<tr><td>${magnitude}</td><td>${place}</td><td>${time}</td><td class="info"><a target="_blank" href="${link}">${title}</a></td></tr>`;
        table.innerHTML += row;
      });
    })
    .catch((err) => console.log("Error fetching data, " + err));
}

function getLocation(coord) {
  const lat = coord[1];
  const lon = coord[0];
  return `Lat: ${lat}, Lon: ${lon}`;
}

function normOrientation(place) {
  const map = {
    N: "North",
    NNE: "North-Northeast",
    NE: "Northeast",
    ENE: "East-Northeast",
    E: "East",
    ESE: "East-Southeast",
    SE: "Southeast",
    SSE: "South-Southeast",
    S: "South",
    SSW: "South-Southwest",
    SW: "Southwest",
    WSW: "West-Southwest",
    W: "West",
    WNW: "West-Northwest",
    NW: "Northwest",
    NNW: "North-Northwest",
  };

  return place.replace(
    /\b(N|NNE|NE|ENE|E|ESE|SE|SSE|S|SSW|SW|WSW|W|WNW|NW|NNW)\b/g,
    (match) => map[match]
  );
}

// COUNTRY ABBREVIATIONS -> NAMES

const isoCountries = {'AF':'Afghanistan','AX':'Aland Islands','AL':'Albania','DZ':'Algeria','AS':'American Samoa','AD':'Andorra','AO':'Angola','AI':'Anguilla','AQ':'Antarctica','AG':'Antigua And Barbuda','AR':'Argentina','AM':'Armenia','AW':'Aruba','AU':'Australia','AT':'Austria','AZ':'Azerbaijan','BS':'Bahamas','BH':'Bahrain','BD':'Bangladesh','BB':'Barbados','BY':'Belarus','BE':'Belgium','BZ':'Belize','BJ':'Benin','BM':'Bermuda','BT':'Bhutan','BO':'Bolivia','BA':'Bosnia And Herzegovina','BW':'Botswana','BV':'Bouvet Island','BR':'Brazil','IO':'British Indian Ocean Territory','BN':'Brunei Darussalam','BG':'Bulgaria','BF':'Burkina Faso','BI':'Burundi','KH':'Cambodia','CM':'Cameroon','CA':'Canada','CV':'Cape Verde','KY':'Cayman Islands','CF':'Central African Republic','TD':'Chad','CL':'Chile','CN':'China','CX':'Christmas Island','CC':'Cocos (Keeling) Islands','CO':'Colombia','KM':'Comoros','CG':'Congo','CD':'Congo, Democratic Republic','CK':'Cook Islands','CR':'Costa Rica','CI':'Cote D\'Ivoire','HR':'Croatia','CU':'Cuba','CY':'Cyprus','CZ':'Czech Republic','DK':'Denmark','DJ':'Djibouti','DM':'Dominica','DO':'Dominican Republic','EC':'Ecuador','EG':'Egypt','SV':'El Salvador','GQ':'Equatorial Guinea','ER':'Eritrea','EE':'Estonia','ET':'Ethiopia','FK':'Falkland Islands (Malvinas)','FO':'Faroe Islands','FJ':'Fiji','FI':'Finland','FR':'France','GF':'French Guiana','PF':'French Polynesia','TF':'French Southern Territories','GA':'Gabon','GM':'Gambia','GE':'Georgia','DE':'Germany','GH':'Ghana','GI':'Gibraltar','GR':'Greece','GL':'Greenland','GD':'Grenada','GP':'Guadeloupe','GU':'Guam','GT':'Guatemala','GG':'Guernsey','GN':'Guinea','GW':'Guinea-Bissau','GY':'Guyana','HT':'Haiti','HM':'Heard Island & Mcdonald Islands','VA':'Holy See (Vatican City State)','HN':'Honduras','HK':'Hong Kong','HU':'Hungary','IS':'Iceland','IN':'India','ID':'Indonesia','IR':'Iran, Islamic Republic Of','IQ':'Iraq','IE':'Ireland','IM':'Isle Of Man','IL':'Israel','IT':'Italy','JM':'Jamaica','JP':'Japan','JE':'Jersey','JO':'Jordan','KZ':'Kazakhstan','KE':'Kenya','KI':'Kiribati','KR':'Korea','KW':'Kuwait','KG':'Kyrgyzstan','LA':'Lao People\'s Democratic Republic','LV':'Latvia','LB':'Lebanon','LS':'Lesotho','LR':'Liberia','LY':'Libyan Arab Jamahiriya','LI':'Liechtenstein','LT':'Lithuania','LU':'Luxembourg','MO':'Macao','MK':'Macedonia','MG':'Madagascar','MW':'Malawi','MY':'Malaysia','MV':'Maldives','ML':'Mali','MT':'Malta','MH':'Marshall Islands','MQ':'Martinique','MR':'Mauritania','MU':'Mauritius','YT':'Mayotte','MX':'Mexico','FM':'Micronesia, Federated States Of','MD':'Moldova','MC':'Monaco','MN':'Mongolia','ME':'Montenegro','MS':'Montserrat','MA':'Morocco','MZ':'Mozambique','MM':'Myanmar','NA':'Namibia','NR':'Nauru','NP':'Nepal','NL':'Netherlands','AN':'Netherlands Antilles','NC':'New Caledonia','NZ':'New Zealand','NI':'Nicaragua','NE':'Niger','NG':'Nigeria','NU':'Niue','NF':'Norfolk Island','MP':'Northern Mariana Islands','NO':'Norway','OM':'Oman','PK':'Pakistan','PW':'Palau','PS':'Palestinian Territory, Occupied','PA':'Panama','PG':'Papua New Guinea','PY':'Paraguay','PE':'Peru','PH':'Philippines','PN':'Pitcairn','PL':'Poland','PT':'Portugal','PR':'Puerto Rico','QA':'Qatar','RE':'Reunion','RO':'Romania','RU':'Russian Federation','RW':'Rwanda','BL':'Saint Barthelemy','SH':'Saint Helena','KN':'Saint Kitts And Nevis','LC':'Saint Lucia','MF':'Saint Martin','PM':'Saint Pierre And Miquelon','VC':'Saint Vincent And Grenadines','WS':'Samoa','SM':'San Marino','ST':'Sao Tome And Principe','SA':'Saudi Arabia','SN':'Senegal','RS':'Serbia','SC':'Seychelles','SL':'Sierra Leone','SG':'Singapore','SK':'Slovakia','SI':'Slovenia','SB':'Solomon Islands','SO':'Somalia','ZA':'South Africa','GS':'South Georgia And Sandwich Isl.','ES':'Spain','LK':'Sri Lanka','SD':'Sudan','SR':'Suriname','SJ':'Svalbard And Jan Mayen','SZ':'Swaziland','SE':'Sweden','CH':'Switzerland','SY':'Syrian Arab Republic','TW':'Taiwan','TJ':'Tajikistan','TZ':'Tanzania','TH':'Thailand','TL':'Timor-Leste','TG':'Togo','TK':'Tokelau','TO':'Tonga','TT':'Trinidad And Tobago','TN':'Tunisia','TR':'Turkey','TM':'Turkmenistan','TC':'Turks And Caicos Islands','TV':'Tuvalu','UG':'Uganda','UA':'Ukraine','AE':'United Arab Emirates','GB':'United Kingdom','US':'United States','UM':'United States Outlying Islands','UY':'Uruguay','UZ':'Uzbekistan','VU':'Vanuatu','VE':'Venezuela','VN':'Viet Nam','VG':'Virgin Islands, British','VI':'Virgin Islands, U.S.','WF':'Wallis And Futuna','EH':'Western Sahara','YE':'Yemen','ZM':'Zambia','ZW':'Zimbabwe'};

function getCountryName(country, iso) {
  for (const [abbr, name] of Object.entries(iso)) {
    if (country.includes(abbr)) {
      country = country.replace(abbr, name);
    }
  }
  return country;
}

// TOGGLE AND SORT
// MAGNITUDE

document.addEventListener("DOMContentLoaded", () => {
  const Mtoggle = document.getElementById("mag-toggle");
  const MtoggleL = document.querySelector(".mag-toggle-label");
  const Mtable = document.getElementById("table");
  //const rows = Array.from(Mtable.rows).slice(1);
  if (Mtable.rows.length > 1) {
    Mtoggle.click();
  }

  Mtoggle.addEventListener("change", () => {
    const isChecked = Mtoggle.checked;
    MtoggleL.classList.toggle("sorted");
    const Mtable = document.getElementById("table");
    const rows = Array.from(Mtable.rows).slice(1);

    rows.sort((a, b) => {
      const amag = parseFloat(
        isChecked ? a.cells[0].innerText : b.cells[0].innerText // 0 since it's going to be sliced by 1
      );
      const bmag = parseFloat(
        isChecked ? b.cells[0].innerText : a.cells[0].innerText
      );

      //const comparison = isChecked ? amag - bmag : bmag - amag;
      return amag < bmag ? -1 : amag > bmag ? 1 : 0;
    });

    Mtable.innerHTML = "<tr><th>Magnitude</th><th>Place</th><th>Time</th></tr>";
    // Mtable.append(...rows)
    for (const row of rows) {
      Mtable.appendChild(row);
    }
  });
});

fetchData();
setInterval(fetchData, 60000);
