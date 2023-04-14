const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const content = document.getElementById("content");
const spinner = document.getElementById("spinner");
const breadcrumb = document.getElementById("breadcrumb");
const footer = document.getElementById("footer");
const thResults = `<tr><th>Zeit</th><th class="col-w10">ST</th><th>Mannschaft</th><th>Erg</th></tr>`;
const thStandings = `<tr><th>Pos</th><th>Verein</th><th>Sp</th><th>Pkt</th><th>Diff</th></tr>`;
let page = 1;
let inc = 1;
let dir = "from";
let sort = "asc";
let liga ="bezirksliga-oberbayern-ost";//initial setup
breadcrumb.innerHTML = "Bezirksliga Oberbayern Ost";
footer.innerHTML = self.location;
const now = new Date()
let pointer = now.toISOString().split('T')[0];
let pointer1 = "";
let pointer2 = "";
const pointers = []; //array of pointers
const proxy = "https://sj-sam.de/proxy/uniProxy.php?url=";
//----------------------------------------------------
var hammertime = new Hammer(content);
hammertime.on('swipe', function (ev) {
  console.log("swipe", ev);
  if (ev.direction == 2) {
    //swipe left
    //changeMatchday(+1);
    plus();
  }
  if (ev.direction == 4) {
    //swipe right
    // changeMatchday(-1);
    minus();
  }
});
//-----------------------------------


//------------------------------------
function selectLiga(slug, l){
  liga = l;
  dir = "from";
  pointer = now.toISOString().split('T')[0];
  breadcrumb.innerHTML = slug;
  getResultsFromFupa();
}

function plus(){
  pointer = pointer2;
  sort = "asc";
  dir = "from";
  
  getResultsFromFupa();
}

function minus(){
  pointer = pointer2;
  sort = "desc";
  dir = "to";
  getResultsFromFupa();
}




async function getResultsFromFupa(){
  spinner.innerHTML = `<img src="spinner.gif">`;
  tbody.innerHTML = "";
  let uri = `https://api.fupa.net/v1/competitions/${liga}/seasons/current/matches?${dir}=${pointer}&sort=${sort}`;
  uri = encodeURIComponent(uri);
  let url = proxy+uri;
  console.log("url ", url);
  const response = await fetch(url);
  const obj = await response.json();
  spinner.innerHTML = "";
  thead.innerHTML="";
  tbody.innerHTML="";
  thead.innerHTML = thResults;
  obj.forEach(element => {
    const datetime = new Date(element.kickoff);
    const weekday = datetime.toLocaleDateString('de-DE', options).substring(0, 2);
    const uhrzeit = datetime.toLocaleTimeString('de-DE').substring(0, 5);
    const date = datetime.toLocaleDateString('de-DE', options).substring(4, 14);
    const team1 = element.homeTeam.name.middle;
    const team2 = element.awayTeam.name.middle;
    const matchday = element.round.number;
    let homeGoal="--";
    let awayGoal="--";
    pointers.push(element.kickoff.substring(0,10));//push all pointers into array pointers
    if(element.homeGoal !==null) homeGoal=element.homeGoal;
    if(element.awayGoal !==null) awayGoal=element.awayGoal;
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>${weekday}, ${uhrzeit}<br>${date}</td><td>${matchday}</td><td>${team1}<br>${team2}</td><td>${homeGoal}:${awayGoal}</td></tr>`;
    tbody.appendChild(tr);
    
  });
  pointer2 = pointers.pop();
  pointer1 = pointers.shift();
  console.log("pointer1: ",pointer1);
  console.log("pointer2: ",pointer2);
}

async function getStandingsFromFupa(slug){
  tbody.innerHTML = "";
  spinner.innerHTML = `<img src = "spinner.gif">`;
  let uri = `https://api.fupa.net/v1/standings?competition=${liga}`;
  uri = encodeURIComponent(uri);
  let url = proxy+uri;
  const response = await fetch(url);
  const obj= await response.json();
  spinner.innerHTML = "";
  thead.innerHTML="";
  tbody.innerHTML="";
  thead.innerHTML = thStandings;
  obj.standings.forEach(element => {
    const matches = element.matches;
    const diff = element.goalDifference;
    const points = element.points;
    const rank = element.rank;
    const team = element.team.name.middle;
   
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>${rank}</td><td>${team}</td><td>${matches}</td><td>${points}</td><td>${diff}</td></tr>`;
    tbody.appendChild(tr);

  });
}
getResultsFromFupa(liga);
// getStandingsFromFupa();