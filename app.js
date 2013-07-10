var sub = "SXGWLZPDOKFIVUHJYTQBNMACERxswgzldpkoifuvjhtybqmncare";
var nouns = ''; 
var verbs = '';
var url = location.href;

function encodeStr(uncoded) {
  uncoded = uncoded.toUpperCase().replace(/^\s+|\s+$/g,"");
  var coded = "";
  var chr;
  for (var i = uncoded.length - 1; i >= 0; i--) {
    chr = uncoded.charCodeAt(i);
    coded += (chr >= 65 && chr <= 90) ? 
      sub.charAt(chr - 65 + 26*Math.floor(Math.random()*2)) :
      String.fromCharCode(chr); 
    }
  return encodeURIComponent(coded);  
}

function decodeStr(coded) {
  coded = decodeURIComponent(coded);  
  var uncoded = "";
  var chr;
  for (var i = coded.length - 1; i >= 0; i--) {
    chr = coded.charAt(i);
    uncoded += (chr >= "a" && chr <= "z" || chr >= "A" && chr <= "Z") ?
      String.fromCharCode(65 + 32 + sub.indexOf(chr) % 26) :
      chr; 
    }
  return uncoded;   
} 

function gup( name ){
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
  var regexS = "[\\?&]"+name+"=([^&#]*)";  
  var regex = new RegExp( regexS );  
  var results = regex.exec( window.location.href ); 
  if( results == null ) {
    return "";  
  }
  else {
return results[1];
  }
}

$('#reload').click(chiasmize);

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
}

function chiasmize() {
  var noun = nouns.pick().word;
  var noun2 = nouns.pick().word;
  var verb = verbs.pick().word;
  var results = [
    'Ask not what your ' + noun + ' can ' + verb + ' for you, but what you can ' + verb + ' for your ' + noun + '.',
    noun.pluralize().capitalize() + ' must put an end to ' + noun2.pluralize() + ' or ' + noun2.pluralize() + ' will put an end to ' + noun.pluralize() + '.',
    'The ' + noun + ' did not invent the ' + noun2 + '. In a very real sense, the ' + noun2 + ' invented the ' + noun + '.'
  ]
  $('#chiasmus').text(results.pick());
}

function getWords() {
  $.ajax({
    url: 'http://api.wordnik.com/v4/words.json/randomWords?minCorpusCount=10000&minDictionaryCount=5&excludePartOfSpeech=proper-noun,proper-noun-plural,proper-noun-posessive,suffix,family-name,idiom,affix&hasDictionaryDef=true&includePartOfSpeech=noun&limit=1000&maxLength=22&api_key='+key.API_KEY,
    success: function(data) {
      nouns = data;
        $.ajax({
          url: 'http://api.wordnik.com//v4/words.json/randomWords?limit=1000&excludePartOfSpeech=adjective&hasDictionaryDef=true&includePartOfSpeech=verb-transitive&minCorpusCount=1000&api_key='+key.API_KEY,
          success: function(data) {
            verbs = data;
            chiasmize();
            //$('#share').attr('href',location.href.split('?')[0]+'?word='+encodeStr(verb)+'$'+encodeStr(nouns));
          },
          async: false,
          dataType:"json"
        });
      },
    async: false,
    dataType:"json"
  });
  return false;
}

if (gup('word') === "") {
  getWords();
}
else {
  verb = decodeStr(gup('word').split('$')[0]);
  nouns = decodeStr(gup('word').split('$')[1]);
  $('#allthethings').text('');
  $("#allthethings").append(verb + " ALL the " + nouns + "<br>");
  $('#reload').attr('href','');
  $('#share').attr('href',url);
}
