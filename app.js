(function(){
"use strict";
const BPD={14: (27.4, 29.6, 31.8), 15: (30.2, 32.6, 34.9), 16: (33.2, 35.7, 38.1), 17: (36.2, 38.8, 41.4), 18: (39.3, 42.0, 44.7), 19: (42.4, 45.2, 48.0), 20: (45.5, 48.4, 51.4), 21: (48.6, 51.7, 54.8), 22: (51.8, 55.0, 58.1), 23: (54.9, 58.2, 61.5), 24: (58.0, 61.4, 64.8), 25: (61.0, 64.5, 68.0), 26: (64.0, 67.6, 71.2), 27: (66.9, 70.6, 74.3), 28: (69.7, 73.5, 77.3), 29: (72.4, 76.3, 80.1), 30: (75.0, 78.9, 82.8), 31: (77.4, 81.4, 85.4), 32: (79.7, 83.8, 87.8), 33: (81.8, 85.9, 90.1), 34: (83.7, 87.9, 92.2), 35: (85.3, 89.7, 94.0), 36: (86.8, 91.2, 95.7), 37: (88.0, 92.5, 97.1), 38: (88.9, 93.6, 98.3), 39: (89.6, 94.4, 99.2), 40: (89.9, 94.9, 99.9)};
const FL={14: (11.2, 13.1, 15.1), 15: (14.3, 16.3, 18.3), 16: (17.4, 19.5, 21.5), 17: (20.4, 22.5, 24.7), 18: (23.4, 25.5, 27.7), 19: (26.2, 28.5, 30.7), 20: (29.0, 31.3, 33.6), 21: (31.7, 34.1, 36.4), 22: (34.4, 36.7, 39.1), 23: (36.9, 39.4, 41.8), 24: (39.4, 41.9, 44.4), 25: (41.8, 44.4, 46.9), 26: (44.1, 46.7, 49.3), 27: (46.4, 49.0, 51.7), 28: (48.6, 51.3, 54.0), 29: (50.6, 53.4, 56.2), 30: (52.6, 55.5, 58.4), 31: (54.6, 57.5, 60.5), 32: (56.4, 59.4, 62.5), 33: (58.2, 61.3, 64.4), 34: (59.8, 63.1, 66.3), 35: (61.4, 64.8, 68.1), 36: (62.9, 66.4, 69.9), 37: (64.3, 67.9, 71.6), 38: (65.6, 69.4, 73.2), 39: (66.9, 70.8, 74.7), 40: (68.0, 72.1, 76.2)};

function val(id){return parseFloat(document.getElementById(id).value);}
function text(id,s){document.getElementById(id).textContent=s;}
function esc(s){return String(s);}

function interp(table,ga){
  const keys=Object.keys(table).map(Number).sort((a,b)=>a-b);
  if(ga<keys[0]||ga>keys[keys.length-1]) return null;
  const lo=Math.floor(ga), hi=Math.ceil(ga);
  if(table[lo] && table[hi]) {
    if(lo===hi) return table[lo];
    const r=ga-lo;
    return [0,1,2].map(i=>table[lo][i]+(table[hi][i]-table[lo][i])*r);
  }
  return null;
}

function makeResult(id,name,measurement,limits){
  const el=document.getElementById(id);
  el.style.display="block";
  if(!isFinite(measurement)) {
    el.innerHTML='<div class="title">'+name+'</div><div class="small">Not entered</div>';
    return;
  }
  const p10=limits[0], p50=limits[1], p90=limits[2];
  let status, cls;
  if(measurement<p10) {status="⚠ Below the 10th centile"; cls="warn";}
  else if(measurement>p90) {status="⚠ Above the 90th centile"; cls="warn";}
  else {status="✓ Within the 10th–90th centile range"; cls="ok";}
  el.innerHTML='<div class="title">'+name+'</div>'+
    '<div class="value">'+measurement.toFixed(1)+' mm</div>'+
    '<div>10th: '+p10.toFixed(1)+' mm &nbsp; | &nbsp; 50th: '+p50.toFixed(1)+' mm &nbsp; | &nbsp; 90th: '+p90.toFixed(1)+' mm</div>'+
    '<div class="'+cls+'" style="margin-top:7px">'+status+'</div>';
}

function calculate(){
  text("error","");
  document.getElementById("bpdResult").style.display="none";
  document.getElementById("flResult").style.display="none";
  const ga=val("ga"), b=val("bpd"), f=val("fl");
  if(!isFinite(ga)||ga<14||ga>40) {
    text("error","Please enter gestational age from 14 to 40 weeks.");
    return;
  }
  if(!isFinite(b)&&!isFinite(f)) {
    text("error","Please enter BPD and/or FL.");
    return;
  }
  const bl=interp(BPD,ga), fl=interp(FL,ga);
  if(isFinite(b)) makeResult("bpdResult","BPD",b,bl);
  if(isFinite(f)) makeResult("flResult","FL",f,fl);
}

function clearAll(){
  ["ga","bpd","fl"].forEach(id=>document.getElementById(id).value="");
  ["bpdResult","flResult"].forEach(id=>{document.getElementById(id).style.display="none";});
  text("error","");
}
document.addEventListener("DOMContentLoaded",function(){
  document.getElementById("calc").addEventListener("click",calculate,false);
  document.getElementById("clear").addEventListener("click",clearAll,false);
});
})();
