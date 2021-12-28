const tbody = document.getElementById("tbody");
const thead = document.getElementById("thead");
const options = { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' };
const content = document.getElementById("content");
const thResults = `<tr><th>Zeit</th><th class="col-w10">ST</th><th>Mannschaft</th><th>Erg</th></tr>`;
const thStandings = `<tr><th>Pos</th><th>Verein</th><th>Sp</th><th>Pkt</th><th>Diff</th></tr>`;
let page = 1;
let dir = "";
let inc = 1;
// let liga = "bayern-landesliga-suedost";
// let liga = "inn-salzach-kreisliga-2";
let liga ="";
const now = new Date()
let pointer = now.toISOString().split('T')[0];
const proxy = "https://api.allorigins.win/get?url=";
//----------------------------------------------------
var hammertime = new Hammer(content);
//hammertime.get('swipe').set({ direction: Hammer.DIRECTION_VERTICAL });
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

function selectLiga(l){
  liga = l;
  dir="";
  page=1;
  getResultsFromFupa(liga);
}

function plus(){
  if(page>1 && dir =="prev"){
    inc=-1;
  }else if(page==1 && dir=="prev"){
    dir="next";
    inc = 1;
  }else{
    inc = 1;
    dir = "next";
  }
  page = page+inc;
  getResultsFromFupa();
}

function minus(){
  if(page>1 && dir =="next"){
    inc=-1;
  }else if(page==1 && dir=="next"){
    dir="prev";
    inc = 1;
  }else{
    inc=1;
    dir="prev";
  }
  page = page+inc;
  getResultsFromFupa();
}




async function getResultsFromFupa(){
  console.log(inc+ " " +page+ " " +dir+ " " + liga);
  
  let uri = `https://api.fupa.net/v1/competitions/${liga}/seasons/current/matches?pointer=${pointer}&dir=${dir}&page=${page}`;
  uri = encodeURIComponent(uri);
  let url = proxy+uri;
  
  const response = await fetch(url);
  const json = await response.json();
  const sdata = json.contents;
  const obj = JSON.parse(sdata);
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
    
    if(element.homeGoal !==null) homeGoal=element.homeGoal;
    if(element.awayGoal !==null) awayGoal=element.awayGoal;
    const tr = document.createElement("tr");
    tr.innerHTML = `<tr><td>${weekday}, ${uhrzeit}<br>${date}</td><td>${matchday}</td><td>${team1}<br>${team2}</td><td>${homeGoal}:${awayGoal}</td></tr>`;
    tbody.appendChild(tr);

  });
}

async function getStandingsFromFupa(){
  let uri = `https://api.fupa.net/v1/standings?competition=${liga}`;
  uri = encodeURIComponent(uri);
  let url = proxy+uri;
  const response = await fetch(url);
  const json = await response.json();
  const sdata = json.contents;
  const obj = JSON.parse(sdata);
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
// getResultsFromFupa();
// getStandingsFromFupa();